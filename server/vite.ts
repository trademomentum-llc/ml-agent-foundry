import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger, type ServerOptions } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import rateLimit from "express-rate-limit";
import { sanitizeForLog } from "./utils/logSanitize";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Constant format string; sanitize external/path-derived content (CodeQL js/log-injection).
  console.log("%s [%s] %s", formattedTime, sanitizeForLog(source, 40), sanitizeForLog(message, 500));
}

export async function setupVite(app: Express, server: Server) {
  // Annotate so `allowedHosts: true` stays the literal `true` (boolean is not
  // assignable to Vite's `string[] | true`) and the object is checked as
  // ServerOptions rather than the resolved-options union member.
  const serverOptions: ServerOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
    // Rate limit to prevent DoS (fixes CodeQL js/missing-rate-limiting)
    const staticLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
    app.use(staticLimiter);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

    // Rate limit static file serving (fixes CodeQL js/missing-rate-limiting)
    const fileLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
    app.use(fileLimiter);

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
