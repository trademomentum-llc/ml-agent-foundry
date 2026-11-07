import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    csrfToken?: string;
  }
}


// Security headers middleware
export const securityMiddleware = helmet({
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
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Stricter rate limiting for sensitive operations
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: "Too many sensitive operations from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CSRF protection for cookie-authenticated state-changing requests.
// Safe methods skip the check. Missing or mismatched tokens are rejected.
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  const headerToken = req.get("x-csrf-token");
  const bodyToken = typeof req.body?._csrf === "string" ? req.body._csrf : undefined;
  const provided = headerToken || bodyToken;
  const sessionToken = req.session?.csrfToken;

  if (!provided || !sessionToken || provided !== sessionToken) {
    return res.status(403).json({ message: "Invalid or missing CSRF token" });
  }

  next();
};

// Issue a per-session CSRF token and mirror it to a non-HttpOnly cookie so
// first-party scripts can echo it back. The session cookie stays HttpOnly.
export const ensureCsrfToken = (req: Request, res: Response, next: NextFunction) => {
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
    path: "/",
  });
  res.setHeader("X-CSRF-Token", sessionToken);
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Recursively sanitize object properties
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
            // Safely encode HTML special characters to prevent XSS injection
            // Using character encoding rather than regex stripping (avoids incomplete sanitization)
            return obj
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#x27;")
              .replace(/\//g, "&#x2F;")
              .trim();
    }
      
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// IP whitelisting middleware (for development/testing)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"];
    
    if (process.env.NODE_ENV === "development") {
      return next(); // Skip in development
    }
    
    if (allowedIPs.includes(clientIP as string)) {
      return next();
    }
    
    res.status(403).json({ message: "Access denied from this IP address" });
  };
};

// Request size limiting
export const requestSizeLimit = (limit: string = "10mb") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers["content-length"];
    const maxSize = parseSize(limit);
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return res.status(413).json({ message: "Request entity too large" });
    }
    
    next();
  };
};

function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024,
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return Math.floor(value * (units[unit] || 1));
}
