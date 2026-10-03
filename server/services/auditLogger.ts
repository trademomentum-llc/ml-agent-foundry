import { InsertAuditLog } from "@shared/schema";
import { storage } from "../storage";
import { Request } from "express";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function metadataString(metadata: unknown, key: string): string | undefined {
  if (!isRecord(metadata)) return undefined;
  const value = metadata[key];
  return typeof value === "string" ? value : undefined;
}

class AuditLogger {
  async log(
    userId: string | null,
    action: string,
    resource: string,
    resourceId?: string | null,
    req?: Request | null,
    success: boolean = true,
    error?: string | null,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const auditEntry: InsertAuditLog = {
        userId: userId || "system",
        action,
        resource,
        resourceId,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
        userAgent: req?.get("User-Agent") || null,
        success,
        error,
        metadata,
      };

      await storage.createAuditLog(auditEntry);

      // Console sink: never pass external/user strings (CodeQL js/log-injection).
      // Persist full detail via storage.createAuditLog above; log lengths/outcome only.
      const outcome = success ? "SUCCESS" : "FAILED";
      const actionLen = typeof action === "string" ? action.length : 0;
      const userLen = userId ? userId.length : 0;
      const resourceLen = typeof resource === "string" ? resource.length : 0;
      const resourceIdLen = resourceId ? resourceId.length : 0;
      const errorLen = error ? error.length : 0;

      if (success) {
        console.log(
          "Audit event recorded outcome=%s actionLen=%s userLen=%s resourceLen=%s resourceIdLen=%s",
          outcome,
          String(actionLen),
          String(userLen),
          String(resourceLen),
          String(resourceIdLen),
        );
      } else {
        console.error(
          "Audit event recorded outcome=%s actionLen=%s userLen=%s resourceLen=%s resourceIdLen=%s errorLen=%s",
          outcome,
          String(actionLen),
          String(userLen),
          String(resourceLen),
          String(resourceIdLen),
          String(errorLen),
        );
      }

      // Additional security alerting for critical actions
      if (this.isCriticalAction(action) || !success) {
        await this.handleCriticalEvent(auditEntry);
      }

    } catch (auditError) {
      console.error("Failed to write audit log");
      // No external strings in the sink — lengths/outcome only.
      console.error(
        "AUDIT FAILURE outcome=%s actionLen=%s userLen=%s resourceLen=%s",
        success ? "SUCCESS" : "FAILED",
        String(typeof action === "string" ? action.length : 0),
        String(userId ? userId.length : 0),
        String(typeof resource === "string" ? resource.length : 0),
      );
    }
  }

  async logSecurityEvent(
    userId: string | null,
    eventType: string,
    severity: "low" | "medium" | "high" | "critical",
    description: string,
    req?: Request | null,
    metadata?: Record<string, any>
  ): Promise<void> {
    const action = `security.${eventType}`;
    const success = severity !== "critical";
    
    await this.log(
      userId,
      action,
      "security",
      null,
      req,
      success,
      severity === "critical" ? description : null,
      {
        ...metadata,
        severity,
        eventType,
        description,
      }
    );

    // Immediate console output — severity enum is local; never log eventType/description strings.
    const sev = severity.toUpperCase();
    if (severity === "critical" || severity === "high") {
      console.error(
        "SECURITY event severity=%s eventTypeLen=%s descriptionLen=%s",
        sev,
        String(eventType.length),
        String(description.length),
      );
    } else {
      console.warn(
        "SECURITY event severity=%s eventTypeLen=%s descriptionLen=%s",
        sev,
        String(eventType.length),
        String(description.length),
      );
    }
  }

  async logAuthEvent(
    userId: string | null,
    eventType: "login" | "logout" | "login_failure" | "password_change" | "account_locked",
    req?: Request | null,
    metadata?: Record<string, any>
  ): Promise<void> {
    const success = !eventType.includes("failure") && eventType !== "account_locked";
    
    await this.log(
      userId,
      `auth.${eventType}`,
      "authentication",
      userId,
      req,
      success,
      success ? null : `Authentication event: ${eventType}`,
      metadata
    );
  }

  async logDataAccess(
    userId: string,
    resource: string,
    resourceId: string,
    operation: "read" | "write" | "delete",
    req?: Request | null,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log(
      userId,
      `data.${operation}`,
      resource,
      resourceId,
      req,
      true,
      null,
      {
        ...metadata,
        operation,
        sensitive: this.isSensitiveResource(resource),
      }
    );
  }

  async logSystemEvent(
    eventType: string,
    description: string,
    success: boolean = true,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log(
      null,
      `system.${eventType}`,
      "system",
      null,
      null,
      success,
      success ? null : description,
      {
        ...metadata,
        description,
        timestamp: new Date().toISOString(),
      }
    );
  }

  async getSecurityAlerts(
    userId: string,
    timeRange: { from: Date; to: Date },
    severity?: "low" | "medium" | "high" | "critical"
  ): Promise<any[]> {
    // This would fetch security-related audit logs
    const auditLogs = await storage.getAuditLogs(userId, 100);
    
    return auditLogs
      .filter(log => 
        log.action.startsWith("security.") &&
        log.createdAt != null &&
        log.createdAt >= timeRange.from &&
        log.createdAt <= timeRange.to &&
        (!severity || metadataString(log.metadata, "severity") === severity)
      )
      .map(log => ({
        id: log.id,
        action: log.action,
        severity: metadataString(log.metadata, "severity") || "medium",
        description: metadataString(log.metadata, "description") || log.action,
        timestamp: log.createdAt,
        userId: log.userId,
        ipAddress: log.ipAddress,
        success: log.success,
      }));
  }

  async generateSecurityReport(
    userId: string,
    timeRange: { from: Date; to: Date }
  ): Promise<{
    totalEvents: number;
    securityEvents: number;
    failedLogins: number;
    criticalEvents: number;
    topActions: Array<{ action: string; count: number }>;
    ipAddresses: Array<{ ip: string; count: number }>;
  }> {
    const auditLogs = await storage.getAuditLogs(userId, 1000);
    
    const filteredLogs = auditLogs.filter(log => 
      log.createdAt != null &&
      log.createdAt >= timeRange.from &&
      log.createdAt <= timeRange.to
    );

    const securityEvents = filteredLogs.filter(log => 
      log.action.startsWith("security.") || log.action.startsWith("auth.")
    );

    const failedLogins = filteredLogs.filter(log => 
      log.action === "auth.login_failure"
    );

    const criticalEvents = filteredLogs.filter(log => 
      metadataString(log.metadata, "severity") === "critical" || !log.success
    );

    // Count actions
    const actionCounts = new Map<string, number>();
    filteredLogs.forEach(log => {
      const count = actionCounts.get(log.action) || 0;
      actionCounts.set(log.action, count + 1);
    });

    // Count IP addresses
    const ipCounts = new Map<string, number>();
    filteredLogs.forEach(log => {
      if (log.ipAddress) {
        const count = ipCounts.get(log.ipAddress) || 0;
        ipCounts.set(log.ipAddress, count + 1);
      }
    });

    return {
      totalEvents: filteredLogs.length,
      securityEvents: securityEvents.length,
      failedLogins: failedLogins.length,
      criticalEvents: criticalEvents.length,
      topActions: Array.from(actionCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([action, count]) => ({ action, count })),
      ipAddresses: Array.from(ipCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ip, count]) => ({ ip, count })),
    };
  }

  private isCriticalAction(action: string): boolean {
    const criticalActions = [
      "auth.login_failure",
      "auth.account_locked",
      "security.breach",
      "security.unauthorized_access",
      "agent.delete",
      "credential.create",
      "credential.delete",
      "system.shutdown",
      "system.configuration_change",
    ];

    return criticalActions.some(critical => action.includes(critical));
  }

  private isSensitiveResource(resource: string): boolean {
    const sensitiveResources = [
      "credential",
      "user",
      "security",
      "payment",
      "personal_data",
    ];

    return sensitiveResources.some(sensitive => resource.includes(sensitive));
  }

  private async handleCriticalEvent(auditEntry: InsertAuditLog): Promise<void> {
    // In a production environment, this would:
    // 1. Send alerts to administrators
    // 2. Trigger automated security responses
    // 3. Log to external security monitoring systems
    // 4. Create incident tickets

    console.error(
      "SECURITY ALERT: critical audit event actionLen=%s resourceLen=%s userLen=%s",
      String(auditEntry.action ? auditEntry.action.length : 0),
      String(auditEntry.resource ? auditEntry.resource.length : 0),
      String(auditEntry.userId ? auditEntry.userId.length : 0),
    );
    
    // Here you would integrate with:
    // - Email/SMS alerting systems
    // - Slack/Teams notifications
    // - External SIEM systems
    // - Incident management tools
    
    // Lengths only — do not log error/metadata contents to console.
    if (auditEntry.error) {
      console.error("Critical event has error detailLen=%s", String(auditEntry.error.length));
    }
    
    if (auditEntry.metadata) {
      console.error("Critical event metadataKeyCount=%s", String(Object.keys(auditEntry.metadata).length));
    }
  }
}

export const auditLogger = new AuditLogger();
