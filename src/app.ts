import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import healthRouter from "./routes/health.js";
import meRouter from "./routes/me.js";
import debugRouter from "./routes/debug.js";

const app = express();

// Trust proxy headers (required for Vercel / reverse proxy deployments)
// Without this, Express sees http:// instead of https://, which breaks
// OAuth callback URL generation in better-auth
app.set("trust proxy", 1);

app.use(
  cors({
    origin: true, // Reflects the request origin — fixes invalid "*" + credentials combo
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Root route — prevents "Cannot GET /" when OAuth redirect falls through
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Mount better-auth handler BEFORE express.json()
// better-auth handles its own body parsing
// Handle both /api/auth/* sub-paths AND the base /api/auth path
const authHandler = toNodeHandler(auth);
app.all("/api/auth/*", authHandler);
app.all("/api/auth", authHandler);

app.use(express.json());

app.use("/health", healthRouter);
app.use("/me", meRouter);
app.use("/debug", debugRouter);

export default app;
