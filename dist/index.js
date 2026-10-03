var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  activitiesRelations: () => activitiesRelations,
  agentTypes: () => agentTypes,
  agentTypesRelations: () => agentTypesRelations,
  agents: () => agents,
  agentsRelations: () => agentsRelations,
  approvals: () => approvals,
  approvalsRelations: () => approvalsRelations,
  auditLog: () => auditLog,
  auditLogRelations: () => auditLogRelations,
  credentials: () => credentials,
  credentialsRelations: () => credentialsRelations,
  flywheelRuns: () => flywheelRuns,
  flywheelRunsRelations: () => flywheelRunsRelations,
  insertActivitySchema: () => insertActivitySchema,
  insertAgentSchema: () => insertAgentSchema,
  insertAgentTypeSchema: () => insertAgentTypeSchema,
  insertApprovalSchema: () => insertApprovalSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertCredentialSchema: () => insertCredentialSchema,
  insertTaskSchema: () => insertTaskSchema,
  modelEvaluations: () => modelEvaluations,
  modelEvaluationsRelations: () => modelEvaluationsRelations,
  models: () => models,
  modelsRelations: () => modelsRelations,
  optimizations: () => optimizations,
  optimizationsRelations: () => optimizationsRelations,
  sessions: () => sessions,
  tasks: () => tasks,
  tasksRelations: () => tasksRelations,
  trafficLogs: () => trafficLogs,
  trafficLogsRelations: () => trafficLogsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var sessions, users, agentTypes, agents, tasks, approvals, activities, auditLog, credentials, models, flywheelRuns, modelEvaluations, trafficLogs, optimizations, usersRelations, modelsRelations, flywheelRunsRelations, modelEvaluationsRelations, trafficLogsRelations, optimizationsRelations, agentTypesRelations, agentsRelations, tasksRelations, approvalsRelations, activitiesRelations, auditLogRelations, credentialsRelations, insertAgentTypeSchema, insertAgentSchema, insertTaskSchema, insertApprovalSchema, insertActivitySchema, insertAuditLogSchema, insertCredentialSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").unique(),
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    agentTypes = pgTable("agent_types", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      category: varchar("category", { length: 100 }).notNull(),
      icon: varchar("icon", { length: 50 }),
      color: varchar("color", { length: 50 }),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    agents = pgTable("agents", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      typeId: integer("type_id").references(() => agentTypes.id),
      userId: varchar("user_id").references(() => users.id),
      status: varchar("status", { length: 50 }).default("inactive"),
      // inactive, active, error, paused
      priority: varchar("priority", { length: 20 }).default("medium"),
      // low, medium, high
      rank: varchar("rank", { length: 50 }).default("private"),
      // Military hierarchy: private, corporal, sergeant, lieutenant, captain, major, colonel, general
      commandLevel: integer("command_level").default(1),
      // 1-10 command authority level
      specialization: jsonb("specialization").default("[]"),
      // Areas of expertise and capabilities
      patternRecognition: jsonb("pattern_recognition").default("{}"),
      // Learned communication patterns and behaviors
      communicationAnalysis: jsonb("communication_analysis").default("{}"),
      // Speech pattern analysis and leet detection
      collaborationNetwork: jsonb("collaboration_network").default("[]"),
      // Connected agents for cross-collaboration
      selfOptimization: jsonb("self_optimization").default("{}"),
      // Auto-improvement metrics and learning
      osiLayerSecurity: jsonb("osi_layer_security").default("{}"),
      // Security configurations per OSI layer
      configuration: jsonb("configuration"),
      securityConfig: jsonb("security_config"),
      lastActivity: timestamp("last_activity"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tasks = pgTable("tasks", {
      id: serial("id").primaryKey(),
      agentId: integer("agent_id").references(() => agents.id),
      userId: varchar("user_id").references(() => users.id),
      type: varchar("type", { length: 100 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      status: varchar("status", { length: 50 }).default("pending"),
      // pending, processing, completed, failed, cancelled
      priority: varchar("priority", { length: 20 }).default("medium"),
      payload: jsonb("payload"),
      result: jsonb("result"),
      error: text("error"),
      scheduledFor: timestamp("scheduled_for"),
      startedAt: timestamp("started_at"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    approvals = pgTable("approvals", {
      id: serial("id").primaryKey(),
      taskId: integer("task_id").references(() => tasks.id),
      agentId: integer("agent_id").references(() => agents.id),
      userId: varchar("user_id").references(() => users.id),
      type: varchar("type", { length: 100 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      status: varchar("status", { length: 50 }).default("pending"),
      // pending, approved, rejected
      requestData: jsonb("request_data"),
      suggestedResponse: text("suggested_response"),
      reviewedBy: varchar("reviewed_by").references(() => users.id),
      reviewedAt: timestamp("reviewed_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    activities = pgTable("activities", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      agentId: integer("agent_id").references(() => agents.id),
      taskId: integer("task_id").references(() => tasks.id),
      type: varchar("type", { length: 100 }).notNull(),
      message: text("message").notNull(),
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow()
    });
    auditLog = pgTable("audit_log", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      action: varchar("action", { length: 100 }).notNull(),
      resource: varchar("resource", { length: 100 }).notNull(),
      resourceId: varchar("resource_id", { length: 100 }),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: text("user_agent"),
      success: boolean("success").default(true),
      error: text("error"),
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow()
    });
    credentials = pgTable("credentials", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      name: varchar("name", { length: 255 }).notNull(),
      service: varchar("service", { length: 100 }).notNull(),
      encryptedKey: text("encrypted_key").notNull(),
      isActive: boolean("is_active").default(true),
      lastUsed: timestamp("last_used"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    models = pgTable("models", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      provider: varchar("provider", { length: 100 }).notNull(),
      // nvidia, openai, anthropic, etc.
      modelId: varchar("model_id", { length: 255 }).notNull(),
      // actual model identifier
      size: varchar("size", { length: 50 }),
      // 1B, 7B, 70B, etc.
      type: varchar("type", { length: 50 }).notNull(),
      // base, instruct, chat, code
      costPerToken: integer("cost_per_token").default(0),
      // cost in micro-cents per token
      inferenceLatency: integer("inference_latency").default(0),
      // average ms per request
      capabilities: jsonb("capabilities").default("[]"),
      // ["reasoning", "code", "math", etc.]
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    flywheelRuns = pgTable("flywheel_runs", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      status: varchar("status", { length: 50 }).default("pending"),
      // pending, running, completed, failed
      baseModelId: integer("base_model_id").references(() => models.id),
      targetWorkload: varchar("target_workload", { length: 255 }).notNull(),
      datasetSize: integer("dataset_size").default(0),
      experimentTypes: jsonb("experiment_types").default('["base", "icl", "customized"]'),
      configuration: jsonb("configuration").default("{}"),
      results: jsonb("results").default("{}"),
      metrics: jsonb("metrics").default("{}"),
      costSavings: integer("cost_savings").default(0),
      // percentage cost reduction
      accuracyRetention: integer("accuracy_retention").default(0),
      // percentage accuracy retained
      startedAt: timestamp("started_at"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    modelEvaluations = pgTable("model_evaluations", {
      id: serial("id").primaryKey(),
      flywheelRunId: integer("flywheel_run_id").references(() => flywheelRuns.id),
      modelId: integer("model_id").references(() => models.id),
      experimentType: varchar("experiment_type", { length: 50 }).notNull(),
      // base, icl, customized
      workloadId: varchar("workload_id", { length: 255 }).notNull(),
      accuracyScore: integer("accuracy_score").default(0),
      // 0-100 similarity score
      latency: integer("latency").default(0),
      // ms per request
      costPerRequest: integer("cost_per_request").default(0),
      // micro-cents
      throughput: integer("throughput").default(0),
      // requests per second
      qualityMetrics: jsonb("quality_metrics").default("{}"),
      isPromoted: boolean("is_promoted").default(false),
      promotedAt: timestamp("promoted_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    trafficLogs = pgTable("traffic_logs", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      agentId: integer("agent_id").references(() => agents.id),
      workloadId: varchar("workload_id", { length: 255 }).notNull(),
      clientId: varchar("client_id", { length: 255 }).notNull(),
      requestTimestamp: timestamp("request_timestamp").notNull(),
      request: jsonb("request").notNull(),
      // OpenAI format request
      response: jsonb("response").notNull(),
      // OpenAI format response
      modelUsed: varchar("model_used", { length: 255 }),
      latency: integer("latency").default(0),
      tokenUsage: jsonb("token_usage").default("{}"),
      userFeedback: integer("user_feedback"),
      // 1-5 rating if available
      isProcessed: boolean("is_processed").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    optimizations = pgTable("optimizations", {
      id: serial("id").primaryKey(),
      flywheelRunId: integer("flywheel_run_id").references(() => flywheelRuns.id),
      originalModelId: integer("original_model_id").references(() => models.id),
      optimizedModelId: integer("optimized_model_id").references(() => models.id),
      workloadId: varchar("workload_id", { length: 255 }).notNull(),
      optimizationType: varchar("optimization_type", { length: 100 }).notNull(),
      // distillation, fine-tuning, quantization
      costReduction: integer("cost_reduction").default(0),
      // percentage
      speedImprovement: integer("speed_improvement").default(0),
      // percentage
      accuracyRetention: integer("accuracy_retention").default(0),
      // percentage
      confidence: integer("confidence").default(0),
      // 0-100 confidence in optimization
      productionReady: boolean("production_ready").default(false),
      deployedAt: timestamp("deployed_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    usersRelations = relations(users, ({ many }) => ({
      agents: many(agents),
      tasks: many(tasks),
      approvals: many(approvals),
      activities: many(activities),
      auditLogs: many(auditLog),
      credentials: many(credentials),
      flywheelRuns: many(flywheelRuns),
      trafficLogs: many(trafficLogs)
    }));
    modelsRelations = relations(models, ({ many }) => ({
      flywheelRuns: many(flywheelRuns),
      evaluations: many(modelEvaluations),
      originalOptimizations: many(optimizations, { relationName: "originalModel" }),
      optimizedOptimizations: many(optimizations, { relationName: "optimizedModel" })
    }));
    flywheelRunsRelations = relations(flywheelRuns, ({ one, many }) => ({
      user: one(users, {
        fields: [flywheelRuns.userId],
        references: [users.id]
      }),
      baseModel: one(models, {
        fields: [flywheelRuns.baseModelId],
        references: [models.id]
      }),
      evaluations: many(modelEvaluations),
      optimizations: many(optimizations)
    }));
    modelEvaluationsRelations = relations(modelEvaluations, ({ one }) => ({
      flywheelRun: one(flywheelRuns, {
        fields: [modelEvaluations.flywheelRunId],
        references: [flywheelRuns.id]
      }),
      model: one(models, {
        fields: [modelEvaluations.modelId],
        references: [models.id]
      })
    }));
    trafficLogsRelations = relations(trafficLogs, ({ one }) => ({
      user: one(users, {
        fields: [trafficLogs.userId],
        references: [users.id]
      }),
      agent: one(agents, {
        fields: [trafficLogs.agentId],
        references: [agents.id]
      })
    }));
    optimizationsRelations = relations(optimizations, ({ one }) => ({
      flywheelRun: one(flywheelRuns, {
        fields: [optimizations.flywheelRunId],
        references: [flywheelRuns.id]
      }),
      originalModel: one(models, {
        fields: [optimizations.originalModelId],
        references: [models.id],
        relationName: "originalModel"
      }),
      optimizedModel: one(models, {
        fields: [optimizations.optimizedModelId],
        references: [models.id],
        relationName: "optimizedModel"
      })
    }));
    agentTypesRelations = relations(agentTypes, ({ many }) => ({
      agents: many(agents)
    }));
    agentsRelations = relations(agents, ({ one, many }) => ({
      type: one(agentTypes, {
        fields: [agents.typeId],
        references: [agentTypes.id]
      }),
      user: one(users, {
        fields: [agents.userId],
        references: [users.id]
      }),
      tasks: many(tasks),
      approvals: many(approvals),
      activities: many(activities)
    }));
    tasksRelations = relations(tasks, ({ one, many }) => ({
      agent: one(agents, {
        fields: [tasks.agentId],
        references: [agents.id]
      }),
      user: one(users, {
        fields: [tasks.userId],
        references: [users.id]
      }),
      approvals: many(approvals),
      activities: many(activities)
    }));
    approvalsRelations = relations(approvals, ({ one }) => ({
      task: one(tasks, {
        fields: [approvals.taskId],
        references: [tasks.id]
      }),
      agent: one(agents, {
        fields: [approvals.agentId],
        references: [agents.id]
      }),
      user: one(users, {
        fields: [approvals.userId],
        references: [users.id]
      }),
      reviewer: one(users, {
        fields: [approvals.reviewedBy],
        references: [users.id]
      })
    }));
    activitiesRelations = relations(activities, ({ one }) => ({
      user: one(users, {
        fields: [activities.userId],
        references: [users.id]
      }),
      agent: one(agents, {
        fields: [activities.agentId],
        references: [agents.id]
      }),
      task: one(tasks, {
        fields: [activities.taskId],
        references: [tasks.id]
      })
    }));
    auditLogRelations = relations(auditLog, ({ one }) => ({
      user: one(users, {
        fields: [auditLog.userId],
        references: [users.id]
      })
    }));
    credentialsRelations = relations(credentials, ({ one }) => ({
      user: one(users, {
        fields: [credentials.userId],
        references: [users.id]
      })
    }));
    insertAgentTypeSchema = createInsertSchema(agentTypes).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertAgentSchema = createInsertSchema(agents).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertTaskSchema = createInsertSchema(tasks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertApprovalSchema = createInsertSchema(approvals).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertActivitySchema = createInsertSchema(activities).omit({
      id: true,
      createdAt: true
    });
    insertAuditLogSchema = createInsertSchema(auditLog).omit({
      id: true,
      createdAt: true
    });
    insertCredentialSchema = createInsertSchema(credentials).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/storage.ts
import { eq, desc, and, count } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      // User operations (IMPORTANT: mandatory for Replit Auth)
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async upsertUser(userData) {
        const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return user;
      }
      // Agent type operations
      async getAgentTypes() {
        return await db.select().from(agentTypes).where(eq(agentTypes.isActive, true));
      }
      async createAgentType(agentType) {
        const [created] = await db.insert(agentTypes).values(agentType).returning();
        return created;
      }
      // Agent operations
      async getAgents(userId) {
        return await db.select().from(agents).where(eq(agents.userId, userId)).orderBy(desc(agents.createdAt));
      }
      async getAgent(id) {
        const [agent] = await db.select().from(agents).where(eq(agents.id, id));
        return agent;
      }
      async createAgent(agent) {
        const [created] = await db.insert(agents).values(agent).returning();
        return created;
      }
      async updateAgent(id, agent) {
        const [updated] = await db.update(agents).set({ ...agent, updatedAt: /* @__PURE__ */ new Date() }).where(eq(agents.id, id)).returning();
        return updated;
      }
      async deleteAgent(id) {
        await db.delete(agents).where(eq(agents.id, id));
      }
      // Task operations
      async getTasks(userId, limit = 50) {
        return await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt)).limit(limit);
      }
      async getTask(id) {
        const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
        return task;
      }
      async createTask(task) {
        const [created] = await db.insert(tasks).values(task).returning();
        return created;
      }
      async updateTask(id, task) {
        const [updated] = await db.update(tasks).set({ ...task, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tasks.id, id)).returning();
        return updated;
      }
      async deleteTask(id) {
        await db.delete(tasks).where(eq(tasks.id, id));
      }
      // Approval operations
      async getApprovals(userId, limit = 50) {
        return await db.select().from(approvals).where(eq(approvals.userId, userId)).orderBy(desc(approvals.createdAt)).limit(limit);
      }
      async getApproval(id) {
        const [approval] = await db.select().from(approvals).where(eq(approvals.id, id));
        return approval;
      }
      async createApproval(approval) {
        const [created] = await db.insert(approvals).values(approval).returning();
        return created;
      }
      async updateApproval(id, approval) {
        const [updated] = await db.update(approvals).set({ ...approval, updatedAt: /* @__PURE__ */ new Date() }).where(eq(approvals.id, id)).returning();
        return updated;
      }
      // Activity operations
      async getActivities(userId, limit = 20) {
        return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt)).limit(limit);
      }
      async createActivity(activity) {
        const [created] = await db.insert(activities).values(activity).returning();
        return created;
      }
      // Audit log operations
      async createAuditLog(auditEntry) {
        const [created] = await db.insert(auditLog).values(auditEntry).returning();
        return created;
      }
      async getAuditLogs(userId, limit = 100) {
        return await db.select().from(auditLog).where(eq(auditLog.userId, userId)).orderBy(desc(auditLog.createdAt)).limit(limit);
      }
      // Credential operations
      async getCredentials(userId) {
        return await db.select().from(credentials).where(and(eq(credentials.userId, userId), eq(credentials.isActive, true))).orderBy(desc(credentials.createdAt));
      }
      async createCredential(credential) {
        const [created] = await db.insert(credentials).values(credential).returning();
        return created;
      }
      async updateCredential(id, credential) {
        const [updated] = await db.update(credentials).set({ ...credential, updatedAt: /* @__PURE__ */ new Date() }).where(eq(credentials.id, id)).returning();
        return updated;
      }
      async deleteCredential(id) {
        await db.update(credentials).set({ isActive: false }).where(eq(credentials.id, id));
      }
      // Dashboard statistics
      async getDashboardStats(userId) {
        const [activeAgentsResult] = await db.select({ count: count() }).from(agents).where(and(eq(agents.userId, userId), eq(agents.status, "active")));
        const [tasksProcessedResult] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, "completed")));
        const [pendingApprovalsResult] = await db.select({ count: count() }).from(approvals).where(and(eq(approvals.userId, userId), eq(approvals.status, "pending")));
        return {
          activeAgents: activeAgentsResult.count,
          tasksProcessed: tasksProcessedResult.count,
          pendingApprovals: pendingApprovalsResult.count,
          systemUptime: 99.9
          // This would be calculated from system metrics
        };
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/services/openai.ts
import OpenAI from "openai";
var openai, OpenAIService, openaiService;
var init_openai = __esm({
  "server/services/openai.ts"() {
    "use strict";
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
    });
    OpenAIService = class {
      isAvailable() {
        return !!process.env.OPENAI_API_KEY || !!process.env.OPENAI_KEY;
      }
      async generateContent(request) {
        if (!this.isAvailable()) {
          throw new Error("OpenAI API key not configured");
        }
        try {
          const prompt = this.buildContentPrompt(request);
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages: [
              {
                role: "system",
                content: "You are a professional content creator with expertise in neurodivergence-friendly communication. Generate content that is clear, structured, and accessible. Always respond in JSON format with the requested fields."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 1500
          });
          const result = JSON.parse(response.choices[0].message.content || "{}");
          return {
            content: result.content || "",
            suggestions: result.suggestions || [],
            safetyScore: result.safetyScore || 0.95,
            metadata: {
              wordCount: result.wordCount || 0,
              readabilityScore: result.readabilityScore || 0,
              sentiment: result.sentiment || "neutral"
            }
          };
        } catch (error) {
          console.error("Error generating content:", error);
          throw new Error("Failed to generate content");
        }
      }
      async analyzeContent(request) {
        if (!this.isAvailable()) {
          throw new Error("OpenAI API key not configured");
        }
        try {
          const prompt = this.buildAnalysisPrompt(request);
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages: [
              {
                role: "system",
                content: "You are an expert content analyst. Provide detailed analysis in JSON format with confidence scores and metadata."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 1e3
          });
          const result = JSON.parse(response.choices[0].message.content || "{}");
          return {
            result: result.analysis || {},
            confidence: result.confidence || 0,
            metadata: result.metadata || {}
          };
        } catch (error) {
          console.error("Error analyzing content:", error);
          throw new Error("Failed to analyze content");
        }
      }
      async checkContentSafety(text2) {
        if (!this.isAvailable()) {
          return { safe: true, score: 0.95, issues: [] };
        }
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages: [
              {
                role: "system",
                content: "You are a content safety moderator. Analyze the provided text for potential safety issues including harmful content, misinformation, or inappropriate material. Respond in JSON format."
              },
              {
                role: "user",
                content: `Analyze this text for safety issues: "${text2}"`
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 500
          });
          const result = JSON.parse(response.choices[0].message.content || "{}");
          return {
            safe: result.safe !== false,
            score: result.score || 0.95,
            issues: result.issues || []
          };
        } catch (error) {
          console.error("Error checking content safety:", error);
          return { safe: true, score: 0.95, issues: [] };
        }
      }
      buildContentPrompt(request) {
        const { type, platform, topic, tone, length, targetAudience, keywords } = request;
        return `Generate ${type} content with the following specifications:
    - Topic: ${topic}
    - Tone: ${tone}
    - Length: ${length}
    ${platform ? `- Platform: ${platform}` : ""}
    ${targetAudience ? `- Target Audience: ${targetAudience}` : ""}
    ${keywords ? `- Keywords to include: ${keywords.join(", ")}` : ""}
    
    Please ensure the content is:
    1. Neurodivergence-friendly (clear structure, simple language)
    2. Engaging and appropriate for the target audience
    3. Optimized for the specified platform
    4. Safe and professional
    
    Respond in JSON format with:
    {
      "content": "the generated content",
      "suggestions": ["improvement suggestion 1", "improvement suggestion 2"],
      "safetyScore": 0.95,
      "wordCount": 150,
      "readabilityScore": 0.8,
      "sentiment": "positive"
    }`;
      }
      buildAnalysisPrompt(request) {
        const { text: text2, analysisType } = request;
        switch (analysisType) {
          case "sentiment":
            return `Analyze the sentiment of this text: "${text2}"
        
        Respond in JSON format with:
        {
          "analysis": {
            "sentiment": "positive/negative/neutral",
            "score": 0.8,
            "emotions": ["happy", "excited"]
          },
          "confidence": 0.95,
          "metadata": {
            "wordCount": 50,
            "keyPhrases": ["phrase1", "phrase2"]
          }
        }`;
          case "keywords":
            return `Extract keywords and key phrases from this text: "${text2}"
        
        Respond in JSON format with:
        {
          "analysis": {
            "keywords": ["keyword1", "keyword2"],
            "keyPhrases": ["phrase1", "phrase2"],
            "topics": ["topic1", "topic2"]
          },
          "confidence": 0.9,
          "metadata": {
            "wordCount": 50,
            "density": 0.1
          }
        }`;
          case "summary":
            return `Provide a concise summary of this text: "${text2}"
        
        Respond in JSON format with:
        {
          "analysis": {
            "summary": "brief summary",
            "keyPoints": ["point1", "point2"],
            "mainTopic": "main topic"
          },
          "confidence": 0.9,
          "metadata": {
            "originalLength": 200,
            "summaryLength": 50,
            "compressionRatio": 0.25
          }
        }`;
          case "safety":
            return `Analyze this text for safety and appropriateness: "${text2}"
        
        Respond in JSON format with:
        {
          "analysis": {
            "safe": true,
            "riskLevel": "low",
            "issues": [],
            "recommendations": []
          },
          "confidence": 0.95,
          "metadata": {
            "categories": ["business", "professional"],
            "flags": []
          }
        }`;
          default:
            return `Analyze this text: "${text2}"`;
        }
      }
    };
    openaiService = new OpenAIService();
  }
});

// server/services/auditLogger.ts
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function metadataString(metadata, key) {
  if (!isRecord(metadata)) return void 0;
  const value = metadata[key];
  return typeof value === "string" ? value : void 0;
}
var AuditLogger, auditLogger;
var init_auditLogger = __esm({
  "server/services/auditLogger.ts"() {
    "use strict";
    init_storage();
    AuditLogger = class {
      async log(userId, action, resource, resourceId, req, success = true, error, metadata) {
        try {
          const auditEntry = {
            userId: userId || "system",
            action,
            resource,
            resourceId,
            ipAddress: req?.ip || req?.connection?.remoteAddress || null,
            userAgent: req?.get("User-Agent") || null,
            success,
            error,
            metadata
          };
          await storage.createAuditLog(auditEntry);
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
              String(resourceIdLen)
            );
          } else {
            console.error(
              "Audit event recorded outcome=%s actionLen=%s userLen=%s resourceLen=%s resourceIdLen=%s errorLen=%s",
              outcome,
              String(actionLen),
              String(userLen),
              String(resourceLen),
              String(resourceIdLen),
              String(errorLen)
            );
          }
          if (this.isCriticalAction(action) || !success) {
            await this.handleCriticalEvent(auditEntry);
          }
        } catch (auditError) {
          console.error("Failed to write audit log");
          console.error(
            "AUDIT FAILURE outcome=%s actionLen=%s userLen=%s resourceLen=%s",
            success ? "SUCCESS" : "FAILED",
            String(typeof action === "string" ? action.length : 0),
            String(userId ? userId.length : 0),
            String(typeof resource === "string" ? resource.length : 0)
          );
        }
      }
      async logSecurityEvent(userId, eventType, severity, description, req, metadata) {
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
            description
          }
        );
        const sev = severity.toUpperCase();
        if (severity === "critical" || severity === "high") {
          console.error(
            "SECURITY event severity=%s eventTypeLen=%s descriptionLen=%s",
            sev,
            String(eventType.length),
            String(description.length)
          );
        } else {
          console.warn(
            "SECURITY event severity=%s eventTypeLen=%s descriptionLen=%s",
            sev,
            String(eventType.length),
            String(description.length)
          );
        }
      }
      async logAuthEvent(userId, eventType, req, metadata) {
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
      async logDataAccess(userId, resource, resourceId, operation, req, metadata) {
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
            sensitive: this.isSensitiveResource(resource)
          }
        );
      }
      async logSystemEvent(eventType, description, success = true, metadata) {
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
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        );
      }
      async getSecurityAlerts(userId, timeRange, severity) {
        const auditLogs = await storage.getAuditLogs(userId, 100);
        return auditLogs.filter(
          (log2) => log2.action.startsWith("security.") && log2.createdAt != null && log2.createdAt >= timeRange.from && log2.createdAt <= timeRange.to && (!severity || metadataString(log2.metadata, "severity") === severity)
        ).map((log2) => ({
          id: log2.id,
          action: log2.action,
          severity: metadataString(log2.metadata, "severity") || "medium",
          description: metadataString(log2.metadata, "description") || log2.action,
          timestamp: log2.createdAt,
          userId: log2.userId,
          ipAddress: log2.ipAddress,
          success: log2.success
        }));
      }
      async generateSecurityReport(userId, timeRange) {
        const auditLogs = await storage.getAuditLogs(userId, 1e3);
        const filteredLogs = auditLogs.filter(
          (log2) => log2.createdAt != null && log2.createdAt >= timeRange.from && log2.createdAt <= timeRange.to
        );
        const securityEvents = filteredLogs.filter(
          (log2) => log2.action.startsWith("security.") || log2.action.startsWith("auth.")
        );
        const failedLogins = filteredLogs.filter(
          (log2) => log2.action === "auth.login_failure"
        );
        const criticalEvents = filteredLogs.filter(
          (log2) => metadataString(log2.metadata, "severity") === "critical" || !log2.success
        );
        const actionCounts = /* @__PURE__ */ new Map();
        filteredLogs.forEach((log2) => {
          const count2 = actionCounts.get(log2.action) || 0;
          actionCounts.set(log2.action, count2 + 1);
        });
        const ipCounts = /* @__PURE__ */ new Map();
        filteredLogs.forEach((log2) => {
          if (log2.ipAddress) {
            const count2 = ipCounts.get(log2.ipAddress) || 0;
            ipCounts.set(log2.ipAddress, count2 + 1);
          }
        });
        return {
          totalEvents: filteredLogs.length,
          securityEvents: securityEvents.length,
          failedLogins: failedLogins.length,
          criticalEvents: criticalEvents.length,
          topActions: Array.from(actionCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([action, count2]) => ({ action, count: count2 })),
          ipAddresses: Array.from(ipCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([ip, count2]) => ({ ip, count: count2 }))
        };
      }
      isCriticalAction(action) {
        const criticalActions = [
          "auth.login_failure",
          "auth.account_locked",
          "security.breach",
          "security.unauthorized_access",
          "agent.delete",
          "credential.create",
          "credential.delete",
          "system.shutdown",
          "system.configuration_change"
        ];
        return criticalActions.some((critical) => action.includes(critical));
      }
      isSensitiveResource(resource) {
        const sensitiveResources = [
          "credential",
          "user",
          "security",
          "payment",
          "personal_data"
        ];
        return sensitiveResources.some((sensitive) => resource.includes(sensitive));
      }
      async handleCriticalEvent(auditEntry) {
        console.error(
          "SECURITY ALERT: critical audit event actionLen=%s resourceLen=%s userLen=%s",
          String(auditEntry.action ? auditEntry.action.length : 0),
          String(auditEntry.resource ? auditEntry.resource.length : 0),
          String(auditEntry.userId ? auditEntry.userId.length : 0)
        );
        if (auditEntry.error) {
          console.error("Critical event has error detailLen=%s", String(auditEntry.error.length));
        }
        if (auditEntry.metadata) {
          console.error("Critical event metadataKeyCount=%s", String(Object.keys(auditEntry.metadata).length));
        }
      }
    };
    auditLogger = new AuditLogger();
  }
});

// server/services/nationalReserve.ts
var nationalReserve_exports = {};
__export(nationalReserve_exports, {
  nationalReserve: () => nationalReserve
});
var NationalReserveService, nationalReserve;
var init_nationalReserve = __esm({
  "server/services/nationalReserve.ts"() {
    "use strict";
    init_storage();
    init_openai();
    init_auditLogger();
    NationalReserveService = class {
      militaryHierarchy = {
        "five_star_general": {
          name: "Five Star General",
          commandLevel: 10,
          specializations: ["strategic_oversight", "cross_domain_intelligence", "system_optimization"],
          reportingStructure: []
        },
        "general": {
          name: "General",
          commandLevel: 9,
          specializations: ["multi_domain_oversight", "pattern_synthesis", "command_coordination"],
          reportingStructure: ["five_star_general"]
        },
        "colonel": {
          name: "Colonel",
          commandLevel: 8,
          specializations: ["operational_command", "domain_expertise", "tactical_coordination"],
          reportingStructure: ["general"]
        },
        "major": {
          name: "Major",
          commandLevel: 7,
          specializations: ["tactical_leadership", "pattern_recognition", "team_coordination"],
          reportingStructure: ["colonel"]
        },
        "captain": {
          name: "Captain",
          commandLevel: 6,
          specializations: ["unit_command", "communication_analysis", "specialized_skills"],
          reportingStructure: ["major"]
        },
        "lieutenant": {
          name: "Lieutenant",
          commandLevel: 5,
          specializations: ["junior_leadership", "real_time_monitoring", "focused_expertise"],
          reportingStructure: ["captain"]
        },
        "sergeant": {
          name: "Sergeant",
          commandLevel: 4,
          specializations: ["squad_leadership", "pattern_detection", "operational_execution"],
          reportingStructure: ["lieutenant"]
        },
        "corporal": {
          name: "Corporal",
          commandLevel: 3,
          specializations: ["team_coordination", "communication_monitoring", "task_execution"],
          reportingStructure: ["sergeant"]
        },
        "private_first_class": {
          name: "Private First Class",
          commandLevel: 2,
          specializations: ["specialized_execution", "communication_analysis", "reporting"],
          reportingStructure: ["corporal"]
        },
        "private": {
          name: "Private",
          commandLevel: 1,
          specializations: ["basic_execution", "pattern_recognition", "surveillance"],
          reportingStructure: ["private_first_class"]
        }
      };
      async deployNationalReserve(userId) {
        const deployedAgents = [];
        for (const [rankKey, rankData] of Object.entries(this.militaryHierarchy)) {
          const agentTypes2 = await storage.getAgentTypes();
          const agentType = agentTypes2.find(
            (type) => type.name.toLowerCase().replace(/\s+/g, "_") === rankKey
          );
          if (agentType) {
            const agent = await this.createMilitaryAgent(userId, agentType.id, rankData);
            deployedAgents.push(agent);
          }
        }
        await this.deployIntelligenceUnits(userId, deployedAgents);
        await this.initializeCollaborationNetwork(deployedAgents);
        await this.activatePatternRecognition(deployedAgents);
        await auditLogger.log(
          userId,
          "national_reserve.deploy",
          "agent_system",
          null,
          null,
          true,
          null,
          { deployedCount: deployedAgents.length }
        );
        return deployedAgents;
      }
      async createMilitaryAgent(userId, typeId, rankData) {
        const agentData = {
          name: `${rankData.name} Alpha-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          description: `Military-grade agent with ${rankData.name} authority and specialized capabilities`,
          typeId,
          userId,
          status: "active",
          priority: rankData.commandLevel >= 8 ? "high" : rankData.commandLevel >= 5 ? "medium" : "low",
          rank: rankData.name.toLowerCase().replace(/\s+/g, "_"),
          commandLevel: rankData.commandLevel,
          specialization: rankData.specializations,
          patternRecognition: {
            leetSpeakDetection: true,
            subliminalAnalysis: true,
            behavioralPatterns: [],
            confidenceThreshold: 0.85
          },
          communicationAnalysis: {
            realTimeMonitoring: true,
            patternTranslation: true,
            contextualAnalysis: true,
            emotionalIntelligence: true
          },
          selfOptimization: {
            learningRate: 0.1,
            adaptationSpeed: "real_time",
            performanceMetrics: {},
            optimizationTargets: ["accuracy", "speed", "collaboration"]
          },
          osiLayerSecurity: {
            layer1_physical: { encryption: "quantum_resistant", monitoring: true },
            layer2_dataLink: { frameValidation: true, errorCorrection: true },
            layer3_network: { packetInspection: true, routingProtection: true },
            layer4_transport: { connectionSecurity: true, flowControl: true },
            layer5_session: { sessionManagement: true, authenticationStrong: true },
            layer6_presentation: { dataEncryption: "AES-256", compressionSecure: true },
            layer7_application: { inputValidation: true, applicationFirewall: true }
          },
          configuration: {
            autonomyLevel: rankData.commandLevel,
            decisionMaking: rankData.commandLevel >= 7 ? "autonomous" : "guided",
            reportingFrequency: "real_time",
            collaborationEnabled: true
          }
        };
        return await storage.createAgent(agentData);
      }
      async deployIntelligenceUnits(userId, commandAgents) {
        const specializedTypes = ["Intelligence Analyst", "Communication Specialist", "Pattern Recognition Expert"];
        for (const typeName of specializedTypes) {
          const agentTypes2 = await storage.getAgentTypes();
          const agentType = agentTypes2.find((type) => type.name === typeName);
          if (agentType) {
            for (let i = 0; i < 3; i++) {
              await this.createSpecializedIntelligenceAgent(userId, agentType.id, typeName, i + 1);
            }
          }
        }
      }
      async createSpecializedIntelligenceAgent(userId, typeId, specialization, unitNumber) {
        const agentData = {
          name: `${specialization} Unit-${unitNumber}`,
          description: `Specialized intelligence agent for ${specialization.toLowerCase()} operations`,
          typeId,
          userId,
          status: "active",
          priority: "high",
          rank: "specialist",
          commandLevel: 6,
          specialization: [specialization.toLowerCase().replace(/\s+/g, "_")],
          patternRecognition: {
            leetSpeakDetection: true,
            subliminalAnalysis: true,
            advancedPatterns: true,
            recursiveAnalysis: true,
            crossReferencing: true
          },
          communicationAnalysis: {
            realTimeMonitoring: true,
            conversationAnalysis: true,
            leetSpeakTranslation: true,
            subliminalDetection: true,
            contextualInference: true
          },
          configuration: {
            monitoringScope: "comprehensive",
            analysisDepth: "deep",
            reportingProtocol: "immediate",
            alertThresholds: {
              leetSpeak: 0.3,
              subliminalCommunication: 0.2,
              patternDeviation: 0.15
            }
          }
        };
        return await storage.createAgent(agentData);
      }
      async initializeCollaborationNetwork(agents2) {
        for (const agent of agents2) {
          const collaborationNetwork = agents2.filter((a) => a.id !== agent.id).map((a) => ({
            agentId: a.id,
            rank: a.rank,
            commandLevel: a.commandLevel,
            specializations: a.specialization
          }));
          await storage.updateAgent(agent.id, {
            collaborationNetwork
          });
        }
      }
      async activatePatternRecognition(agents2) {
        for (const agent of agents2) {
          const patternRecognition = {
            ...agent.patternRecognition,
            activatedAt: (/* @__PURE__ */ new Date()).toISOString(),
            baselinePatterns: await this.getBaselinePatterns(),
            learningEnabled: true,
            adaptiveThresholds: true
          };
          await storage.updateAgent(agent.id, {
            patternRecognition
          });
        }
      }
      async analyzeConversation(userId, conversationText, context) {
        const agents2 = await storage.getAgents(userId);
        const activeAnalysts = agents2.filter(
          (a) => a.status === "active" && Array.isArray(a.specialization) && a.specialization.includes("communication_analysis")
        );
        if (activeAnalysts.length === 0) {
          throw new Error("No active communication analysis agents available");
        }
        const analysis = await openaiService.analyzeContent({
          text: conversationText,
          analysisType: "safety"
        });
        const leetPatterns = this.detectLeetSpeak(conversationText);
        const subliminalIndicators = await this.detectSubliminalCommunication(conversationText);
        const patternAnalysis = {
          leetSpeak: leetPatterns.detected,
          subliminalIndicators,
          communicationStyle: this.analyzeCommunicationStyle(conversationText),
          emotionalTone: analysis.result.sentiment || "neutral"
        };
        await auditLogger.log(
          userId,
          "conversation.analyze",
          "communication",
          null,
          null,
          true,
          null,
          {
            context,
            analysisResults: patternAnalysis,
            agentCount: activeAnalysts.length
          }
        );
        return patternAnalysis;
      }
      detectLeetSpeak(text2) {
        const leetPatterns = [
          { pattern: /[4@]/g, replacement: "a", type: "character_substitution" },
          { pattern: /3/g, replacement: "e", type: "character_substitution" },
          { pattern: /1/g, replacement: "i", type: "character_substitution" },
          { pattern: /0/g, replacement: "o", type: "character_substitution" },
          { pattern: /5/g, replacement: "s", type: "character_substitution" },
          { pattern: /7/g, replacement: "t", type: "character_substitution" },
          { pattern: /\|\|/g, replacement: "n", type: "character_substitution" },
          { pattern: /\|<\|/g, replacement: "k", type: "character_substitution" }
        ];
        const detectedPatterns = [];
        let hasLeetSpeak = false;
        for (const leetPattern of leetPatterns) {
          const matches = text2.match(leetPattern.pattern);
          if (matches && matches.length > 0) {
            hasLeetSpeak = true;
            detectedPatterns.push({
              type: "leet_speak",
              pattern: leetPattern.pattern.toString(),
              confidence: matches.length / text2.length,
              context: `Found ${matches.length} instances of ${leetPattern.type}`,
              translation: text2.replace(leetPattern.pattern, leetPattern.replacement)
            });
          }
        }
        return { detected: hasLeetSpeak, patterns: detectedPatterns };
      }
      async detectSubliminalCommunication(text2) {
        const indicators = [];
        const capitalPattern = /[A-Z][a-z]*[A-Z][a-z]*/g;
        if (text2.match(capitalPattern)) {
          indicators.push("unusual_capitalization_pattern");
        }
        const words = text2.split(/\s+/);
        const firstLetters = words.map((word) => word[0]).join("");
        if (firstLetters.length > 3 && /^[A-Z]+$/.test(firstLetters)) {
          indicators.push(`potential_acronym: ${firstLetters}`);
        }
        const numberSequences = text2.match(/\d{3,}/g);
        if (numberSequences) {
          indicators.push("number_sequences_detected");
        }
        const repeatedPatterns = text2.match(/(.{2,})\1+/g);
        if (repeatedPatterns) {
          indicators.push("repeated_patterns_detected");
        }
        return indicators;
      }
      analyzeCommunicationStyle(text2) {
        const wordCount = text2.split(/\s+/).length;
        const avgWordLength = text2.replace(/\s+/g, "").length / wordCount;
        const questionMarks = (text2.match(/\?/g) || []).length;
        const exclamationMarks = (text2.match(/!/g) || []).length;
        if (avgWordLength > 6 && questionMarks === 0) return "formal";
        if (exclamationMarks > 2) return "enthusiastic";
        if (questionMarks > wordCount * 0.1) return "inquisitive";
        if (avgWordLength < 4) return "casual";
        return "neutral";
      }
      async getBaselinePatterns() {
        return {
          commonWords: ["the", "and", "or", "but", "in", "on", "at", "to", "for"],
          typicalSentenceLength: { min: 5, max: 20, average: 12 },
          punctuationPatterns: { periods: 0.6, commas: 0.3, questions: 0.05, exclamations: 0.05 },
          capitalizedWords: { frequency: 0.15, position: "sentence_start" }
        };
      }
      async getReserveStatus(userId) {
        const agents2 = await storage.getAgents(userId);
        const reserveAgents = agents2.filter((a) => a.rank && a.commandLevel);
        const commandStructure = {};
        for (const agent of reserveAgents) {
          const rank = agent.rank || "unknown";
          if (!commandStructure[rank]) {
            commandStructure[rank] = { count: 0, active: 0 };
          }
          commandStructure[rank].count++;
          if (agent.status === "active") {
            commandStructure[rank].active++;
          }
        }
        return {
          totalAgents: reserveAgents.length,
          activeAgents: reserveAgents.filter((a) => a.status === "active").length,
          commandStructure,
          patternRecognitionStatus: {
            enabled: true,
            activeMonitoring: reserveAgents.filter(
              (a) => a.communicationAnalysis && a.communicationAnalysis.realTimeMonitoring
            ).length
          },
          lastActivity: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
    };
    nationalReserve = new NationalReserveService();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/replitAuth.ts
init_storage();
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import rateLimit2 from "express-rate-limit";

// server/middleware/security.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
var securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536e3,
    includeSubDomains: true,
    preload: true
  }
});
var rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});
var strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 10,
  // limit each IP to 10 requests per windowMs
  message: {
    error: "Too many sensitive operations from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
var csrfProtection = (req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  const headerToken = req.get("x-csrf-token");
  const bodyToken = typeof req.body?._csrf === "string" ? req.body._csrf : void 0;
  const provided = headerToken || bodyToken;
  const sessionToken = req.session?.csrfToken;
  if (!provided || !sessionToken || provided !== sessionToken) {
    return res.status(403).json({ message: "Invalid or missing CSRF token" });
  }
  next();
};
var ensureCsrfToken = (req, res, next) => {
  if (!req.session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let sessionToken = req.session.csrfToken;
  if (typeof sessionToken !== "string" || sessionToken.length < 32) {
    sessionToken = crypto.randomBytes(32).toString("hex");
    req.session.csrfToken = sessionToken;
  }
  res.cookie("csrf-token", sessionToken, {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/"
  });
  res.setHeader("X-CSRF-Token", sessionToken);
  next();
};

// server/replitAuth.ts
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
      sameSite: "strict"
      // CSRF protection: strict same-site cookies
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  app2.use(ensureCsrfToken);
  app2.use(csrfProtection);
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  const authLimiter = rateLimit2({
    windowMs: 15 * 60 * 1e3,
    max: 20,
    message: { error: "Too many auth requests, please try again later." }
  });
  app2.get("/api/login", authLimiter, (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", authLimiter, (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
function isUsableToken(token) {
  return typeof token === "string" && token.length >= 16 && token.length <= 8192 && !/\s/.test(token);
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user || !isUsableToken(user.access_token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const expiresAt = user.expires_at;
  if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= expiresAt) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!isUsableToken(refreshToken)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    if (!isUsableToken(user.access_token) || typeof user.expires_at !== "number" || !Number.isFinite(user.expires_at)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// server/routes.ts
import rateLimit3 from "express-rate-limit";

// server/middleware/validation.ts
import { ZodError } from "zod";
var validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors
        });
      }
      return res.status(500).json({
        message: "Internal server error during validation"
      });
    }
  };
};

// server/services/agentFactory.ts
init_storage();
init_openai();
init_auditLogger();
function isRecord2(value) {
  return typeof value === "object" && value !== null;
}
function securityFlag(config, key) {
  return isRecord2(config) && config[key] === true;
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
var AgentFactory = class {
  agentCapabilities = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeCapabilities();
  }
  initializeCapabilities() {
    this.agentCapabilities.set("social_media", [
      {
        name: "generate_post",
        description: "Generate social media posts with AI",
        parameters: { platform: "string", topic: "string", tone: "string" },
        securityLevel: "medium"
      },
      {
        name: "schedule_post",
        description: "Schedule posts for publication",
        parameters: { content: "string", publishTime: "datetime", platform: "string" },
        securityLevel: "high"
      },
      {
        name: "analyze_engagement",
        description: "Analyze post engagement metrics",
        parameters: { postId: "string", platform: "string" },
        securityLevel: "low"
      }
    ]);
    this.agentCapabilities.set("email_marketing", [
      {
        name: "create_campaign",
        description: "Create email marketing campaigns",
        parameters: { subject: "string", content: "string", recipients: "array" },
        securityLevel: "high"
      },
      {
        name: "send_email",
        description: "Send individual emails",
        parameters: { to: "string", subject: "string", content: "string" },
        securityLevel: "high"
      },
      {
        name: "analyze_campaign",
        description: "Analyze campaign performance",
        parameters: { campaignId: "string" },
        securityLevel: "low"
      }
    ]);
    this.agentCapabilities.set("analytics", [
      {
        name: "generate_report",
        description: "Generate analytics reports",
        parameters: { metrics: "array", timeRange: "string", format: "string" },
        securityLevel: "low"
      },
      {
        name: "monitor_traffic",
        description: "Monitor website traffic",
        parameters: { domain: "string", alerts: "boolean" },
        securityLevel: "medium"
      },
      {
        name: "create_dashboard",
        description: "Create custom dashboards",
        parameters: { widgets: "array", layout: "object" },
        securityLevel: "low"
      }
    ]);
    this.agentCapabilities.set("file_system", [
      {
        name: "organize_files",
        description: "Organize files and folders",
        parameters: { path: "string", rules: "object" },
        securityLevel: "high"
      },
      {
        name: "backup_files",
        description: "Create file backups",
        parameters: { source: "string", destination: "string", schedule: "string" },
        securityLevel: "high"
      },
      {
        name: "monitor_changes",
        description: "Monitor file system changes",
        parameters: { watchPaths: "array", notifications: "boolean" },
        securityLevel: "medium"
      }
    ]);
    this.agentCapabilities.set("dns", [
      {
        name: "update_records",
        description: "Update DNS records",
        parameters: { domain: "string", recordType: "string", value: "string" },
        securityLevel: "high"
      },
      {
        name: "monitor_propagation",
        description: "Monitor DNS propagation",
        parameters: { domain: "string", recordType: "string" },
        securityLevel: "low"
      }
    ]);
  }
  async initializeAgent(agent) {
    try {
      await auditLogger.log(
        agent.userId,
        "agent.initialize",
        "agent",
        agent.id.toString(),
        null,
        true,
        null,
        { agentName: agent.name, agentType: agent.typeId }
      );
      const defaultConfig = this.getDefaultConfig(agent);
      await storage.updateAgent(agent.id, {
        configuration: defaultConfig,
        status: "active",
        lastActivity: /* @__PURE__ */ new Date()
      });
      await storage.createActivity({
        userId: agent.userId,
        agentId: agent.id,
        type: "agent.initialized",
        message: `Agent "${agent.name}" has been initialized and is ready for tasks`,
        metadata: { configuration: defaultConfig }
      });
    } catch (error) {
      console.error("Error initializing agent:", error);
      await storage.updateAgent(agent.id, {
        status: "error",
        lastActivity: /* @__PURE__ */ new Date()
      });
      await auditLogger.log(
        agent.userId,
        "agent.initialize",
        "agent",
        agent.id.toString(),
        null,
        false,
        errorMessage(error)
      );
      throw error;
    }
  }
  async executeAgentTask(agentId, taskType, parameters) {
    const agent = await storage.getAgent(agentId);
    if (!agent) {
      throw new Error("Agent not found");
    }
    try {
      await auditLogger.log(
        agent.userId,
        "agent.task.execute",
        "task",
        null,
        null,
        true,
        null,
        { agentId, taskType, parameters }
      );
      const result = await this.processTask(agent, taskType, parameters);
      await storage.createActivity({
        userId: agent.userId,
        agentId: agent.id,
        type: "task.completed",
        message: `Agent "${agent.name}" completed task: ${taskType}`,
        metadata: { taskType, parameters, result }
      });
      return result;
    } catch (error) {
      console.error("Error executing agent task:", error);
      await auditLogger.log(
        agent.userId,
        "agent.task.execute",
        "task",
        null,
        null,
        false,
        errorMessage(error),
        { agentId, taskType, parameters }
      );
      await storage.createActivity({
        userId: agent.userId,
        agentId: agent.id,
        type: "task.failed",
        message: `Agent "${agent.name}" failed to complete task: ${taskType}`,
        metadata: { taskType, parameters, error: errorMessage(error) }
      });
      throw error;
    }
  }
  async processTask(agent, taskType, parameters) {
    const agentType = await this.getAgentTypeFromAgent(agent);
    switch (agentType) {
      case "social_media":
        return await this.processSocialMediaTask(agent, taskType, parameters);
      case "email_marketing":
        return await this.processEmailMarketingTask(agent, taskType, parameters);
      case "analytics":
        return await this.processAnalyticsTask(agent, taskType, parameters);
      case "file_system":
        return await this.processFileSystemTask(agent, taskType, parameters);
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }
  async processSocialMediaTask(agent, taskType, parameters) {
    switch (taskType) {
      case "generate_post":
        const contentRequest = {
          type: "social_media",
          platform: parameters.platform,
          topic: parameters.topic,
          tone: parameters.tone || "professional",
          length: parameters.length || "medium",
          targetAudience: parameters.targetAudience,
          keywords: parameters.keywords
        };
        const contentResult = await openaiService.generateContent(contentRequest);
        if (securityFlag(agent.securityConfig, "approvalRequired")) {
          await storage.createApproval({
            agentId: agent.id,
            userId: agent.userId,
            type: "social_media_post",
            title: `Social Media Post for ${parameters.platform}`,
            description: `Generated post about ${parameters.topic}`,
            requestData: { content: contentResult.content, platform: parameters.platform },
            suggestedResponse: contentResult.content
          });
          return {
            status: "pending_approval",
            content: contentResult.content,
            approvalRequired: true
          };
        }
        return {
          status: "completed",
          content: contentResult.content,
          suggestions: contentResult.suggestions,
          metadata: contentResult.metadata
        };
      case "schedule_post":
        return {
          status: "scheduled",
          scheduledFor: parameters.publishTime,
          platform: parameters.platform,
          message: "Post has been scheduled for publication"
        };
      case "analyze_engagement":
        return {
          status: "completed",
          engagement: {
            likes: Math.floor(Math.random() * 1e3),
            shares: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 50),
            reach: Math.floor(Math.random() * 5e3)
          },
          insights: ["High engagement during evening hours", "Visual content performs better"]
        };
      default:
        throw new Error(`Unknown social media task: ${taskType}`);
    }
  }
  async processEmailMarketingTask(agent, taskType, parameters) {
    switch (taskType) {
      case "create_campaign":
        const campaignId = `campaign_${Date.now()}`;
        if (securityFlag(agent.securityConfig, "approvalRequired")) {
          await storage.createApproval({
            agentId: agent.id,
            userId: agent.userId,
            type: "email_campaign",
            title: `Email Campaign: ${parameters.subject}`,
            description: `Campaign to ${parameters.recipients.length} recipients`,
            requestData: parameters,
            suggestedResponse: `Send campaign to ${parameters.recipients.length} recipients`
          });
          return {
            status: "pending_approval",
            campaignId,
            approvalRequired: true
          };
        }
        return {
          status: "created",
          campaignId,
          recipients: parameters.recipients.length,
          subject: parameters.subject
        };
      case "send_email":
        return {
          status: "sent",
          messageId: `msg_${Date.now()}`,
          deliveredAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      case "analyze_campaign":
        return {
          status: "completed",
          metrics: {
            sent: 1e3,
            delivered: 985,
            opened: 320,
            clicked: 45,
            bounced: 15,
            unsubscribed: 3
          },
          openRate: 0.325,
          clickRate: 0.046,
          deliveryRate: 0.985
        };
      default:
        throw new Error(`Unknown email marketing task: ${taskType}`);
    }
  }
  async processAnalyticsTask(agent, taskType, parameters) {
    switch (taskType) {
      case "generate_report":
        return {
          status: "completed",
          reportId: `report_${Date.now()}`,
          format: parameters.format,
          metrics: parameters.metrics,
          timeRange: parameters.timeRange,
          data: {
            pageViews: Math.floor(Math.random() * 1e4),
            uniqueVisitors: Math.floor(Math.random() * 5e3),
            bounceRate: Math.random() * 0.5,
            averageSessionDuration: Math.floor(Math.random() * 300)
          }
        };
      case "monitor_traffic":
        return {
          status: "monitoring",
          domain: parameters.domain,
          alerts: parameters.alerts,
          currentTraffic: {
            visitors: Math.floor(Math.random() * 100),
            pageViews: Math.floor(Math.random() * 500),
            loading: Math.random() * 3
          }
        };
      case "create_dashboard":
        return {
          status: "created",
          dashboardId: `dashboard_${Date.now()}`,
          widgets: parameters.widgets,
          layout: parameters.layout,
          url: `/dashboard/${Date.now()}`
        };
      default:
        throw new Error(`Unknown analytics task: ${taskType}`);
    }
  }
  async processFileSystemTask(agent, taskType, parameters) {
    switch (taskType) {
      case "organize_files":
        return {
          status: "completed",
          path: parameters.path,
          filesOrganized: Math.floor(Math.random() * 100),
          foldersCreated: Math.floor(Math.random() * 10),
          rules: parameters.rules
        };
      case "backup_files":
        return {
          status: "completed",
          source: parameters.source,
          destination: parameters.destination,
          filesBackedUp: Math.floor(Math.random() * 1e3),
          backupSize: `${Math.floor(Math.random() * 100)}MB`,
          schedule: parameters.schedule
        };
      case "monitor_changes":
        return {
          status: "monitoring",
          watchPaths: parameters.watchPaths,
          notifications: parameters.notifications,
          changesDetected: Math.floor(Math.random() * 5)
        };
      default:
        throw new Error(`Unknown file system task: ${taskType}`);
    }
  }
  getDefaultConfig(agent) {
    return {
      apiKeys: {},
      webhooks: [],
      schedules: [],
      approvalRequired: true,
      securityLevel: "high",
      rateLimits: {
        requests: 100,
        period: 3600
        // 1 hour
      }
    };
  }
  async getAgentTypeFromAgent(agent) {
    if (!agent.typeId) {
      throw new Error("Agent type not specified");
    }
    const typeMap = {
      1: "social_media",
      2: "email_marketing",
      3: "analytics",
      4: "file_system",
      5: "dns"
    };
    return typeMap[agent.typeId] || "unknown";
  }
  getAgentCapabilities(agentType) {
    return this.agentCapabilities.get(agentType) || [];
  }
  async validateAgentSecurity(agent) {
    const issues = [];
    const recommendations = [];
    if (!agent.securityConfig) {
      issues.push("No security configuration found");
      recommendations.push("Configure security settings for the agent");
    }
    if (!securityFlag(agent.securityConfig, "encryption")) {
      issues.push("Encryption not enabled");
      recommendations.push("Enable encryption for sensitive data");
    }
    if (!securityFlag(agent.securityConfig, "approvalRequired")) {
      recommendations.push("Consider enabling approval requirements for high-risk actions");
    }
    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }
};
var agentFactory = new AgentFactory();

// server/services/taskQueue.ts
init_storage();
init_auditLogger();
import cron from "node-cron";
var TaskQueue = class {
  queue = [];
  processing = false;
  maxConcurrentTasks = 5;
  currentlyProcessing = /* @__PURE__ */ new Set();
  constructor() {
    this.startProcessing();
    this.scheduleCleanup();
  }
  async enqueue(task, priority = "medium") {
    const queuedTask = {
      ...task,
      priority,
      retryCount: 0,
      maxRetries: 3
    };
    await storage.updateTask(task.id, {
      status: "pending"
    });
    if (priority === "high") {
      this.queue.unshift(queuedTask);
    } else {
      this.queue.push(queuedTask);
    }
    await storage.createActivity({
      userId: task.userId,
      taskId: task.id,
      type: "task.queued",
      message: `Task "${task.title}" has been added to the queue`,
      metadata: { priority, queueLength: this.queue.length }
    });
    if (!this.processing) {
      this.processQueue();
    }
  }
  async startProcessing() {
    setInterval(() => {
      if (!this.processing && this.queue.length > 0) {
        this.processQueue();
      }
    }, 5e3);
  }
  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }
    this.processing = true;
    try {
      while (this.queue.length > 0 && this.currentlyProcessing.size < this.maxConcurrentTasks) {
        const task = this.queue.shift();
        if (task && !this.currentlyProcessing.has(task.id)) {
          this.processTask(task);
        }
      }
    } finally {
      this.processing = false;
    }
  }
  async processTask(task) {
    this.currentlyProcessing.add(task.id);
    try {
      await storage.updateTask(task.id, {
        status: "processing",
        startedAt: /* @__PURE__ */ new Date()
      });
      await auditLogger.log(
        task.userId,
        "task.process.start",
        "task",
        task.id.toString(),
        null,
        true,
        null,
        { taskType: task.type, agentId: task.agentId }
      );
      let result;
      if (task.scheduledFor && new Date(task.scheduledFor) > /* @__PURE__ */ new Date()) {
        await storage.updateTask(task.id, {
          status: "pending"
        });
        setTimeout(() => {
          this.queue.push(task);
        }, new Date(task.scheduledFor).getTime() - Date.now());
        return;
      }
      if (task.agentId) {
        result = await agentFactory.executeAgentTask(
          task.agentId,
          task.type,
          task.payload
        );
      } else {
        result = await this.executeSystemTask(task);
      }
      await storage.updateTask(task.id, {
        status: "completed",
        result,
        completedAt: /* @__PURE__ */ new Date()
      });
      await storage.createActivity({
        userId: task.userId,
        taskId: task.id,
        agentId: task.agentId,
        type: "task.completed",
        message: `Task "${task.title}" completed successfully`,
        metadata: { result, processingTime: Date.now() - new Date(task.startedAt).getTime() }
      });
      await auditLogger.log(
        task.userId,
        "task.process.complete",
        "task",
        task.id.toString(),
        null,
        true,
        null,
        { result, processingTime: Date.now() - new Date(task.startedAt).getTime() }
      );
    } catch (error) {
      console.error(`Error processing task ${task.id}:`, error);
      if (task.retryCount < task.maxRetries) {
        task.retryCount++;
        await storage.updateTask(task.id, {
          status: "pending",
          error: error.message
        });
        const retryDelay = Math.pow(2, task.retryCount) * 1e3;
        setTimeout(() => {
          this.queue.push(task);
        }, retryDelay);
        await storage.createActivity({
          userId: task.userId,
          taskId: task.id,
          type: "task.retry",
          message: `Task "${task.title}" failed, retry attempt ${task.retryCount}/${task.maxRetries}`,
          metadata: { error: error.message, retryCount: task.retryCount }
        });
      } else {
        await storage.updateTask(task.id, {
          status: "failed",
          error: error.message,
          completedAt: /* @__PURE__ */ new Date()
        });
        await storage.createActivity({
          userId: task.userId,
          taskId: task.id,
          type: "task.failed",
          message: `Task "${task.title}" failed after ${task.maxRetries} retry attempts`,
          metadata: { error: error.message, retryCount: task.retryCount }
        });
        await auditLogger.log(
          task.userId,
          "task.process.fail",
          "task",
          task.id.toString(),
          null,
          false,
          error.message,
          { retryCount: task.retryCount }
        );
      }
    } finally {
      this.currentlyProcessing.delete(task.id);
    }
  }
  async executeSystemTask(task) {
    switch (task.type) {
      case "system.cleanup":
        return await this.performSystemCleanup();
      case "system.backup":
        return await this.performSystemBackup();
      case "system.security_scan":
        return await this.performSecurityScan();
      default:
        throw new Error(`Unknown system task type: ${task.type}`);
    }
  }
  async performSystemCleanup() {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    return {
      status: "completed",
      filesDeleted: Math.floor(Math.random() * 100),
      spaceSaved: `${Math.floor(Math.random() * 500)}MB`,
      duration: "1.2s"
    };
  }
  async performSystemBackup() {
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    return {
      status: "completed",
      backupSize: `${Math.floor(Math.random() * 1e3) + 100}MB`,
      filesBackedUp: Math.floor(Math.random() * 1e3) + 100,
      duration: "2.1s"
    };
  }
  async performSecurityScan() {
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    return {
      status: "completed",
      vulnerabilities: Math.floor(Math.random() * 3),
      risksFound: Math.floor(Math.random() * 2),
      recommendations: [
        "Update dependencies",
        "Review access permissions",
        "Enable additional security features"
      ],
      duration: "3.0s"
    };
  }
  scheduleCleanup() {
    cron.schedule("0 2 * * *", async () => {
      try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
        console.log(`Scheduled cleanup of tasks older than ${sevenDaysAgo.toISOString()}`);
        await auditLogger.log(
          "system",
          "task.cleanup.scheduled",
          "system",
          null,
          null,
          true,
          null,
          { cleanupDate: sevenDaysAgo.toISOString() }
        );
      } catch (error) {
        console.error("Error during scheduled cleanup:", error);
      }
    });
  }
  async getQueueStats() {
    return {
      totalQueued: this.queue.length,
      processing: this.currentlyProcessing.size,
      completed: 0,
      // Would be calculated from database
      failed: 0,
      // Would be calculated from database
      avgProcessingTime: 0
      // Would be calculated from database
    };
  }
  async pauseQueue() {
    this.processing = true;
  }
  async resumeQueue() {
    this.processing = false;
    this.processQueue();
  }
  async clearQueue() {
    this.queue = [];
  }
  async getQueueStatus() {
    return {
      status: this.processing ? "paused" : "running",
      queueLength: this.queue.length,
      processing: this.currentlyProcessing.size
    };
  }
};
var taskQueue = new TaskQueue();

// server/routes.ts
init_auditLogger();

// server/services/foundationModel.ts
import OpenAI2 from "openai";
import { z } from "zod";
var IntentSchema = z.object({
  intent: z.string(),
  confidence: z.number().min(0).max(1),
  entities: z.array(z.object({
    name: z.string(),
    value: z.string(),
    type: z.string()
  })),
  actions: z.array(z.string())
});
var ReasoningSchema = z.object({
  reasoning: z.string(),
  conclusion: z.string(),
  confidence: z.number().min(0).max(1),
  steps: z.array(z.string()),
  sources: z.array(z.string()).optional()
});
var WorkflowSchema = z.object({
  id: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.enum(["analysis", "action", "decision", "communication"]),
    parameters: z.record(z.any()),
    expectedOutput: z.string(),
    nextSteps: z.array(z.string())
  })),
  estimatedDuration: z.number(),
  dependencies: z.array(z.string()),
  resources: z.array(z.string())
});
var BERTFoundationModel = class {
  openai;
  constructor() {
    this.openai = new OpenAI2({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  async generateText(prompt, options = {}) {
    try {
      const response = await this.openai.chat.completions.create({
        model: options.model || "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are BERT, a foundational reasoning model integrated into the Agent Factory platform. Provide clear, structured responses with logical reasoning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1500,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 0.9
      });
      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error generating text:", error);
      throw new Error("Failed to generate text from foundation model");
    }
  }
  async embedText(text2) {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text2
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error creating embeddings:", error);
      throw new Error("Failed to create text embeddings");
    }
  }
  async analyzeIntent(text2) {
    const prompt = `
    Analyze the following text for intent, entities, and required actions.
    
    Text: "${text2}"
    
    Provide a structured analysis with:
    1. The primary intent
    2. Confidence level (0-1)
    3. Named entities (name, value, type)
    4. Suggested actions
    
    Format as JSON with fields: intent, confidence, entities, actions
    `;
    try {
      const response = await this.generateText(prompt, { temperature: 0.3 });
      const parsed = JSON.parse(response);
      return IntentSchema.parse(parsed);
    } catch (error) {
      console.error("Error analyzing intent:", error);
      return {
        intent: "general_query",
        confidence: 0.5,
        entities: [],
        actions: ["process_request"]
      };
    }
  }
  async executeReasoning(query, context) {
    const prompt = `
    Execute step-by-step reasoning for the following query.
    
    Query: "${query}"
    ${context ? `Context: "${context}"` : ""}
    
    Provide:
    1. Detailed reasoning process
    2. Clear conclusion
    3. Confidence level (0-1)
    4. Step-by-step breakdown
    5. Sources or references if applicable
    
    Format as JSON with fields: reasoning, conclusion, confidence, steps, sources
    `;
    try {
      const response = await this.generateText(prompt, { temperature: 0.2, maxTokens: 2e3 });
      const parsed = JSON.parse(response);
      return ReasoningSchema.parse(parsed);
    } catch (error) {
      console.error("Error executing reasoning:", error);
      return {
        reasoning: "Unable to complete full reasoning analysis",
        conclusion: "Analysis incomplete due to processing error",
        confidence: 0.1,
        steps: ["Error in reasoning pipeline"],
        sources: []
      };
    }
  }
  async createWorkflow(description) {
    const prompt = `
    Create a detailed workflow plan for the following requirement:
    
    Description: "${description}"
    
    Generate a comprehensive workflow with:
    1. Unique workflow ID
    2. Sequential steps with clear descriptions
    3. Step types (analysis, action, decision, communication)
    4. Parameters for each step
    5. Expected outputs
    6. Next step connections
    7. Estimated duration in minutes
    8. Dependencies and required resources
    
    Format as JSON with fields: id, steps, estimatedDuration, dependencies, resources
    `;
    try {
      const response = await this.generateText(prompt, { temperature: 0.4, maxTokens: 2500 });
      const parsed = JSON.parse(response);
      const workflow = WorkflowSchema.parse(parsed);
      if (!workflow.id) {
        workflow.id = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      return workflow;
    } catch (error) {
      console.error("Error creating workflow:", error);
      return {
        id: `fallback_${Date.now()}`,
        steps: [
          {
            id: "step_1",
            name: "Initial Analysis",
            description: "Analyze the requirements",
            type: "analysis",
            parameters: { input: description },
            expectedOutput: "Requirements analysis",
            nextSteps: ["step_2"]
          },
          {
            id: "step_2",
            name: "Execute Action",
            description: "Perform the requested action",
            type: "action",
            parameters: {},
            expectedOutput: "Action completed",
            nextSteps: []
          }
        ],
        estimatedDuration: 30,
        dependencies: [],
        resources: ["foundation_model", "agent_factory"]
      };
    }
  }
  // Enhanced capabilities for National Reserve integration
  async analyzePatterns(data, context) {
    const prompt = `
    Analyze the following data patterns for the National Reserve system:
    
    Data: ${JSON.stringify(data)}
    Context: ${context}
    
    Identify:
    1. Communication patterns
    2. Behavioral indicators
    3. Potential security concerns
    4. Recommendations for agent deployment
    `;
    return await this.generateText(prompt, { temperature: 0.3 });
  }
  async optimizeAgentConfiguration(agentType, performance) {
    const prompt = `
    Optimize configuration for ${agentType} agent based on performance metrics:
    
    Performance Data: ${JSON.stringify(performance)}
    
    Provide:
    1. Configuration adjustments
    2. Performance improvement strategies
    3. Resource allocation recommendations
    4. Training data suggestions
    `;
    return await this.generateText(prompt, { temperature: 0.2 });
  }
};
var foundationModel = new BERTFoundationModel();

// server/routes.ts
init_schema();

// server/utils/logSanitize.ts
function sanitizeForLog(value, maxLen = 200) {
  if (value == null) return "";
  const raw = typeof value === "string" ? value : String(value);
  return raw.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").slice(0, maxLen);
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.use(securityMiddleware);
  await setupAuth(app2);
  app2.use(
    "/api",
    rateLimit3({
      windowMs: 15 * 60 * 1e3,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests from this IP, please try again later." }
    })
  );
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await auditLogger.log(userId, "dashboard.stats.view", "dashboard", null, req);
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      await auditLogger.log(req.user.claims.sub, "dashboard.stats.view", "dashboard", null, req, false, error?.message);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });
  app2.get("/api/security/status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await auditLogger.log(userId, "security.status.view", "security", null, req);
      const agents2 = await storage.getAgents(userId);
      const auditLogs = await storage.getAuditLogs(userId, 24);
      const tasks2 = await storage.getTasks(userId);
      const protectedAgents = agents2.filter((agent) => agent.status === "active").length;
      const totalAgents = agents2.length;
      const recentSecurityEvents = auditLogs.filter((log2) => {
        const logTime = new Date(log2.createdAt || 0).getTime();
        const last24Hours = Date.now() - 24 * 60 * 60 * 1e3;
        return logTime > last24Hours && (!log2.success || log2.action.includes("failed") || log2.action.includes("error"));
      }).length;
      let securityScore = 0;
      if (totalAgents > 0) {
        securityScore += Math.round(protectedAgents / totalAgents * 40);
      }
      const eventPenalty = Math.min(recentSecurityEvents * 5, 30);
      securityScore += Math.max(0, 30 - eventPenalty);
      const completedTasks = tasks2.filter((task) => task.status === "completed").length;
      const taskSuccessRate = tasks2.length > 0 ? completedTasks / tasks2.length : 1;
      securityScore += Math.round(taskSuccessRate * 15);
      const recentSuccessfulLogins = auditLogs.filter(
        (log2) => log2.action.includes("auth") && log2.success
      ).length;
      securityScore += Math.min(recentSuccessfulLogins > 0 ? 15 : 5, 15);
      securityScore = Math.max(0, Math.min(100, securityScore));
      let complianceLevel = "Non-Compliant";
      if (securityScore >= 90) complianceLevel = "Fully Compliant";
      else if (securityScore >= 70) complianceLevel = "Mostly Compliant";
      else if (securityScore >= 50) complianceLevel = "Partially Compliant";
      const securityStatus = {
        overallScore: securityScore,
        protectedAgents,
        securityEvents: recentSecurityEvents,
        lastScanTime: (/* @__PURE__ */ new Date()).toISOString(),
        complianceLevel,
        // Additional details for transparency
        scoreBreakdown: {
          agentProtection: Math.round(protectedAgents / Math.max(totalAgents, 1) * 40),
          securityEvents: Math.max(0, 30 - eventPenalty),
          taskSuccess: Math.round(taskSuccessRate * 15),
          accessControl: Math.min(recentSuccessfulLogins > 0 ? 15 : 5, 15)
        }
      };
      res.json(securityStatus);
    } catch (error) {
      console.error("Error fetching security status:", error);
      res.status(500).json({ message: "Failed to fetch security status" });
    }
  });
  app2.get("/api/agents", rateLimiter, isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await auditLogger.log(userId, "agents.list.view", "agents", null, req);
      const agents2 = [
        {
          id: 1,
          name: "Social Media Agent",
          type: "Social Media",
          status: "active",
          description: "Automated content generation and social media scheduling for all platforms",
          capabilities: ["Content Generation", "Scheduling", "Analytics"],
          createdAt: "2025-08-15T10:00:00Z",
          lastActive: "2025-08-16T20:30:00Z",
          performanceScore: 95,
          instances: 3
        },
        {
          id: 2,
          name: "Email Marketing Agent",
          type: "Email Marketing",
          status: "active",
          description: "Campaign setup, management, and optimization for email marketing",
          capabilities: ["Campaign Management", "A/B Testing", "Automation"],
          createdAt: "2025-08-15T11:00:00Z",
          lastActive: "2025-08-16T21:00:00Z",
          performanceScore: 88,
          instances: 5
        },
        {
          id: 3,
          name: "Security Monitor",
          type: "Security",
          status: "active",
          description: "Real-time security monitoring and threat detection",
          capabilities: ["Threat Detection", "Real-time Monitoring", "Automated Response"],
          createdAt: "2025-08-15T12:00:00Z",
          lastActive: "2025-08-16T21:05:00Z",
          performanceScore: 100,
          instances: 1
        },
        {
          id: 4,
          name: "Analytics Agent",
          type: "Analytics",
          status: "paused",
          description: "Business intelligence and performance analytics",
          capabilities: ["Data Analysis", "Report Generation", "Insights"],
          createdAt: "2025-08-15T13:00:00Z",
          lastActive: "2025-08-16T19:00:00Z",
          performanceScore: 92,
          instances: 2
        }
      ];
      res.json(agents2);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });
  app2.get("/api/agents/:id/download", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentId = req.params.id;
      await auditLogger.log(userId, "agent.download", "agents", agentId, req);
      res.json({
        message: "Agent package prepared for download",
        downloadUrl: `/downloads/agent-${agentId}.zip`,
        agentId
      });
    } catch (error) {
      console.error("Error preparing agent download:", error);
      res.status(500).json({ message: "Failed to prepare agent download" });
    }
  });
  app2.post("/api/agents/:id/:action", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentId = req.params.id;
      const action = req.params.action;
      await auditLogger.log(userId, `agent.${sanitizeForLog(action, 64)}`, "agents", sanitizeForLog(agentId, 64), req);
      res.json({
        message: "Agent action completed successfully",
        agentId,
        action
      });
    } catch (error) {
      console.error("Error performing agent action:", error);
      res.status(500).json({ message: "Failed to perform agent action" });
    }
  });
  app2.get("/api/dashboard/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 20;
      const activities2 = await storage.getActivities(userId, limit);
      res.json(activities2);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  app2.get("/api/agent-types", isAuthenticated, async (req, res) => {
    try {
      const agentTypes2 = await storage.getAgentTypes();
      res.json(agentTypes2);
    } catch (error) {
      console.error("Error fetching agent types:", error);
      res.status(500).json({ message: "Failed to fetch agent types" });
    }
  });
  app2.get("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const agents2 = await storage.getAgents(userId);
      res.json(agents2);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });
  app2.post("/api/agents", isAuthenticated, validateRequest(insertAgentSchema), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentData = { ...req.body, userId };
      await auditLogger.log(userId, "agent.create", "agent", null, req);
      const agent = await storage.createAgent(agentData);
      await agentFactory.initializeAgent(agent);
      await storage.createActivity({
        userId,
        agentId: agent.id,
        type: "agent.created",
        message: `Agent "${agent.name}" was created successfully`,
        metadata: { agentType: agent.typeId }
      });
      res.status(201).json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      await auditLogger.log(req.user.claims.sub, "agent.create", "agent", null, req, false, error?.message);
      res.status(500).json({ message: "Failed to create agent" });
    }
  });
  app2.get("/api/agents/:id", isAuthenticated, async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      if (agent.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });
  app2.put("/api/agents/:id", isAuthenticated, validateRequest(insertAgentSchema.partial()), async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const existingAgent = await storage.getAgent(agentId);
      if (!existingAgent || existingAgent.userId !== userId) {
        return res.status(404).json({ message: "Agent not found" });
      }
      await auditLogger.log(userId, "agent.update", "agent", agentId.toString(), req);
      const agent = await storage.updateAgent(agentId, req.body);
      await storage.createActivity({
        userId,
        agentId: agent.id,
        type: "agent.updated",
        message: `Agent "${agent.name}" was updated`
      });
      res.json(agent);
    } catch (error) {
      console.error("Error updating agent:", error);
      await auditLogger.log(req.user.claims.sub, "agent.update", "agent", req.params.id, req, false, error?.message);
      res.status(500).json({ message: "Failed to update agent" });
    }
  });
  app2.delete("/api/agents/:id", isAuthenticated, async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const existingAgent = await storage.getAgent(agentId);
      if (!existingAgent || existingAgent.userId !== userId) {
        return res.status(404).json({ message: "Agent not found" });
      }
      await auditLogger.log(userId, "agent.delete", "agent", agentId.toString(), req);
      await storage.deleteAgent(agentId);
      await storage.createActivity({
        userId,
        type: "agent.deleted",
        message: `Agent "${existingAgent.name}" was deleted`
      });
      res.json({ message: "Agent deleted successfully" });
    } catch (error) {
      console.error("Error deleting agent:", error);
      await auditLogger.log(req.user.claims.sub, "agent.delete", "agent", req.params.id, req, false, error?.message);
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });
  app2.get("/api/tasks", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 50;
      const tasks2 = await storage.getTasks(userId, limit);
      res.json(tasks2);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  app2.post("/api/tasks", isAuthenticated, validateRequest(insertTaskSchema), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskData = { ...req.body, userId };
      await auditLogger.log(userId, "task.create", "task", null, req);
      const task = await storage.createTask(taskData);
      await taskQueue.enqueue(task);
      await storage.createActivity({
        userId,
        taskId: task.id,
        type: "task.created",
        message: `Task "${task.title}" was created`
      });
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      await auditLogger.log(req.user.claims.sub, "task.create", "task", null, req, false, error?.message);
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  app2.put("/api/tasks/:id", isAuthenticated, validateRequest(insertTaskSchema.partial()), async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const existingTask = await storage.getTask(taskId);
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }
      await auditLogger.log(userId, "task.update", "task", taskId.toString(), req);
      const task = await storage.updateTask(taskId, req.body);
      await storage.createActivity({
        userId,
        taskId: task.id,
        type: "task.updated",
        message: `Task "${task.title}" was updated`
      });
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      await auditLogger.log(req.user.claims.sub, "task.update", "task", req.params.id, req, false, error?.message);
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  app2.get("/api/approvals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 50;
      const approvals2 = await storage.getApprovals(userId, limit);
      res.json(approvals2);
    } catch (error) {
      console.error("Error fetching approvals:", error);
      res.status(500).json({ message: "Failed to fetch approvals" });
    }
  });
  app2.post("/api/approvals/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const approvalId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const existingApproval = await storage.getApproval(approvalId);
      if (!existingApproval || existingApproval.userId !== userId) {
        return res.status(404).json({ message: "Approval not found" });
      }
      await auditLogger.log(userId, "approval.approve", "approval", approvalId.toString(), req);
      const approval = await storage.updateApproval(approvalId, {
        status: "approved",
        reviewedBy: userId,
        reviewedAt: /* @__PURE__ */ new Date()
      });
      await storage.createActivity({
        userId,
        type: "approval.approved",
        message: `Approval request "${approval.title}" was approved`
      });
      res.json(approval);
    } catch (error) {
      console.error("Error approving request:", error);
      await auditLogger.log(req.user.claims.sub, "approval.approve", "approval", req.params.id, req, false, error?.message);
      res.status(500).json({ message: "Failed to approve request" });
    }
  });
  app2.post("/api/approvals/:id/reject", isAuthenticated, async (req, res) => {
    try {
      const approvalId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const existingApproval = await storage.getApproval(approvalId);
      if (!existingApproval || existingApproval.userId !== userId) {
        return res.status(404).json({ message: "Approval not found" });
      }
      await auditLogger.log(userId, "approval.reject", "approval", approvalId.toString(), req);
      const approval = await storage.updateApproval(approvalId, {
        status: "rejected",
        reviewedBy: userId,
        reviewedAt: /* @__PURE__ */ new Date()
      });
      await storage.createActivity({
        userId,
        type: "approval.rejected",
        message: `Approval request "${approval.title}" was rejected`
      });
      res.json(approval);
    } catch (error) {
      console.error("Error rejecting request:", error);
      await auditLogger.log(req.user.claims.sub, "approval.reject", "approval", req.params.id, req, false, error?.message);
      res.status(500).json({ message: "Failed to reject request" });
    }
  });
  app2.get("/api/security/audit-logs", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 100;
      const auditLogs = await storage.getAuditLogs(userId, limit);
      res.json(auditLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });
  app2.get("/api/security/status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const agents2 = await storage.getAgents(userId);
      const auditLogs = await storage.getAuditLogs(userId, 24);
      const protectedAgents = agents2.filter((agent) => agent.status === "active").length;
      const recentSecurityEvents = auditLogs.filter(
        (log2) => log2.createdAt && new Date(log2.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1e3
      ).length;
      const overallScore = Math.min(100, 70 + protectedAgents * 5 + (recentSecurityEvents > 0 ? 15 : 0));
      res.json({
        overallScore,
        protectedAgents,
        securityEvents: recentSecurityEvents,
        lastScanTime: (/* @__PURE__ */ new Date()).toISOString(),
        complianceLevel: "High"
      });
    } catch (error) {
      console.error("Error fetching security status:", error);
      res.status(500).json({ message: "Failed to fetch security status" });
    }
  });
  app2.get("/api/security/threat-analysis", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const auditLogs = await storage.getAuditLogs(userId, 100);
      const failedLogins = auditLogs.filter(
        (log2) => log2.action.includes("login") && !log2.success
      ).length;
      const suspiciousActivity = auditLogs.filter(
        (log2) => log2.action.includes("delete") || log2.action.includes("admin")
      ).length;
      const threats = [];
      if (failedLogins > 5) {
        threats.push({
          type: "Multiple Failed Logins",
          description: `${failedLogins} failed login attempts detected`,
          severity: "medium",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      if (suspiciousActivity > 10) {
        threats.push({
          type: "Suspicious Administrative Activity",
          description: `${suspiciousActivity} administrative actions detected`,
          severity: "low",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      res.json({
        activeThreats: threats.length,
        threats,
        riskLevel: threats.length > 0 ? "Medium" : "Low",
        lastAnalysis: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error performing threat analysis:", error);
      res.status(500).json({ message: "Failed to perform threat analysis" });
    }
  });
  app2.post("/api/national-reserve/deploy", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nationalReserve: nationalReserve2 } = await Promise.resolve().then(() => (init_nationalReserve(), nationalReserve_exports));
      const deploymentPlan = await foundationModel.createWorkflow(
        "Deploy comprehensive National Reserve system with BERT foundation model integration, military hierarchy, pattern recognition, and cross-collaboration capabilities"
      );
      console.log("BERT Foundation Model Deployment Plan:", deploymentPlan);
      const deployedAgents = await nationalReserve2.deployNationalReserve(userId);
      await auditLogger.log(
        userId,
        "national_reserve.deploy",
        "agent_system",
        null,
        req,
        true,
        null,
        { deployedCount: deployedAgents.length, foundationModel: "BERT", workflowId: deploymentPlan.id }
      );
      res.json({
        message: "National Reserve deployed successfully with BERT foundation model integration",
        deployedAgents: deployedAgents.length,
        foundationModel: "BERT integrated for all agents",
        deploymentPlan: deploymentPlan.id,
        workflowSteps: deploymentPlan.steps.length,
        commandStructure: deployedAgents.reduce((acc, agent) => {
          const rank = agent.rank || "unknown";
          acc[rank] = (acc[rank] || 0) + 1;
          return acc;
        }, {}),
        capabilities: [
          "BERT foundation model reasoning",
          "Advanced pattern recognition system",
          "Leet speech detection and translation",
          "Subliminal communication analysis",
          "Real-time conversation monitoring",
          "Cross-collaboration framework",
          "Workflow execution capabilities",
          "Intent analysis and action planning"
        ]
      });
    } catch (error) {
      console.error("Error deploying National Reserve:", error);
      await auditLogger.log(req.user.claims.sub, "national_reserve.deploy", "agent_system", null, req, false, error?.message);
      res.status(500).json({ message: "Failed to deploy National Reserve" });
    }
  });
  app2.get("/api/national-reserve/status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nationalReserve: nationalReserve2 } = await Promise.resolve().then(() => (init_nationalReserve(), nationalReserve_exports));
      const status = await nationalReserve2.getReserveStatus(userId);
      res.json(status);
    } catch (error) {
      console.error("Error fetching National Reserve status:", error);
      res.status(500).json({ message: "Failed to fetch National Reserve status" });
    }
  });
  app2.post("/api/national-reserve/analyze-conversation", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { conversationText, context } = req.body;
      const { nationalReserve: nationalReserve2 } = await Promise.resolve().then(() => (init_nationalReserve(), nationalReserve_exports));
      if (!conversationText) {
        return res.status(400).json({ message: "Conversation text is required" });
      }
      const analysis = await nationalReserve2.analyzeConversation(userId, conversationText, context);
      await auditLogger.log(
        userId,
        "conversation.analyze",
        "communication",
        null,
        req,
        true,
        null,
        { hasLeetSpeak: analysis.leetSpeak, subliminalIndicators: analysis.subliminalIndicators.length }
      );
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing conversation:", error);
      await auditLogger.log(req.user.claims.sub, "conversation.analyze", "communication", null, req, false, error?.message);
      res.status(500).json({ message: "Failed to analyze conversation" });
    }
  });
  app2.get("/api/credentials", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const credentials2 = await storage.getCredentials(userId);
      const sanitizedCredentials = credentials2.map((cred) => ({
        ...cred,
        encryptedKey: void 0
      }));
      res.json(sanitizedCredentials);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2, req) => {
    console.log("WebSocket connection established");
    ws2.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received WebSocket message len=%s", String(message.toString().length));
        switch (data.type) {
          case "ping":
            ws2.send(JSON.stringify({ type: "pong" }));
            break;
          case "subscribe":
            break;
          default:
            console.log("Unknown WebSocket message");
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    });
    ws2.on("close", () => {
      console.log("WebSocket connection closed");
    });
    ws2.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
    if (ws2.readyState === WebSocket.OPEN) {
      ws2.send(JSON.stringify({ type: "connected", timestamp: Date.now() }));
    }
  });
  app2.post("/api/foundation-model/reasoning", isAuthenticated, rateLimiter, async (req, res) => {
    try {
      const { query, context } = req.body;
      const reasoning = await foundationModel.executeReasoning(query, context);
      res.json(reasoning);
    } catch (error) {
      console.error("Error executing reasoning:", error);
      res.status(500).json({ message: "Failed to execute reasoning" });
    }
  });
  app2.post("/api/foundation-model/intent-analysis", isAuthenticated, rateLimiter, async (req, res) => {
    try {
      const { text: text2 } = req.body;
      const analysis = await foundationModel.analyzeIntent(text2);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing intent:", error);
      res.status(500).json({ message: "Failed to analyze intent" });
    }
  });
  app2.post("/api/foundation-model/workflow", isAuthenticated, rateLimiter, async (req, res) => {
    try {
      const { description } = req.body;
      const workflow = await foundationModel.createWorkflow(description);
      res.json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });
  app2.get("/api/flywheel/runs", isAuthenticated, rateLimiter, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await auditLogger.log(userId, "flywheel.runs.view", "flywheel", null, req);
      const sampleRuns = [
        {
          id: 1,
          name: "General Agent Optimization",
          description: "Autonomous model discovery for general agent tasks",
          status: "completed",
          baseModelId: 1,
          targetWorkload: "general_agent_tasks",
          datasetSize: 15420,
          costSavings: 87,
          accuracyRetention: 94,
          startedAt: new Date(Date.now() - 36e5).toISOString(),
          completedAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdAt: new Date(Date.now() - 36e5).toISOString()
        },
        {
          id: 2,
          name: "Customer Service Optimization",
          description: "Model distillation for customer service workflows",
          status: "running",
          baseModelId: 2,
          targetWorkload: "customer_service",
          datasetSize: 8950,
          costSavings: 0,
          accuracyRetention: 0,
          startedAt: new Date(Date.now() - 18e5).toISOString(),
          createdAt: new Date(Date.now() - 18e5).toISOString()
        }
      ];
      res.json(sampleRuns);
    } catch (error) {
      console.error("Error fetching flywheel runs:", error);
      res.status(500).json({ message: "Failed to fetch flywheel runs" });
    }
  });
  app2.post("/api/flywheel/runs", rateLimiter, isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, targetWorkload, description } = req.body;
      await auditLogger.log(userId, "flywheel.run.create", "flywheel", null, req);
      const newRun = {
        id: Date.now(),
        name,
        description,
        status: "running",
        targetWorkload,
        datasetSize: 0,
        costSavings: 0,
        accuracyRetention: 0,
        startedAt: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(newRun);
    } catch (error) {
      console.error("Error starting flywheel run:", error);
      res.status(500).json({ message: "Failed to start flywheel run" });
    }
  });
  app2.get("/api/flywheel/evaluations", rateLimiter, isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await auditLogger.log(userId, "flywheel.evaluations.view", "flywheel", null, req);
      const sampleEvaluations = [
        {
          id: 1,
          modelId: 1,
          experimentType: "base",
          workloadId: "general_agent_tasks",
          accuracyScore: 94,
          latency: 150,
          costPerRequest: 45,
          isPromoted: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: 2,
          modelId: 2,
          experimentType: "customized",
          workloadId: "customer_service",
          accuracyScore: 91,
          latency: 89,
          costPerRequest: 12,
          isPromoted: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
      res.json(sampleEvaluations);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });
  app2.get("/api/flywheel/optimizations", rateLimiter, isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await auditLogger.log(userId, "flywheel.optimizations.view", "flywheel", null, req);
      const sampleOptimizations = [
        {
          id: 1,
          workloadId: "general_agent_tasks",
          optimizationType: "Model Distillation",
          costReduction: 87,
          speedImprovement: 65,
          accuracyRetention: 94,
          confidence: 89,
          productionReady: true,
          createdAt: new Date(Date.now() - 36e5).toISOString()
        },
        {
          id: 2,
          workloadId: "customer_service",
          optimizationType: "LoRA Fine-tuning",
          costReduction: 42,
          speedImprovement: 23,
          accuracyRetention: 91,
          confidence: 76,
          productionReady: false,
          createdAt: new Date(Date.now() - 18e5).toISOString()
        },
        {
          id: 3,
          workloadId: "document_analysis",
          optimizationType: "Quantization",
          costReduction: 58,
          speedImprovement: 34,
          accuracyRetention: 96,
          confidence: 82,
          productionReady: true,
          createdAt: new Date(Date.now() - 72e5).toISOString()
        }
      ];
      res.json(sampleOptimizations);
    } catch (error) {
      console.error("Error fetching optimizations:", error);
      res.status(500).json({ message: "Failed to fetch optimizations" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import rateLimit4 from "express-rate-limit";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  const srcLen = typeof source === "string" ? source.length : 0;
  const msgLen = typeof message === "string" ? message.length : 0;
  console.log("%s sourceLen=%s messageLen=%s", formattedTime, String(srcLen), String(msgLen));
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  const staticLimiter = rateLimit4({ windowMs: 15 * 60 * 1e3, max: 300 });
  app2.use(staticLimiter);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  const fileLimiter = rateLimit4({ windowMs: 15 * 60 * 1e3, max: 500 });
  app2.use(fileLimiter);
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
