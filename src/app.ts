import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import healthRouter from "./routes/health.js";
import meRouter from "./routes/me.js";
import debugRouter from "./routes/debug.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Mount better-auth handler BEFORE express.json()
// better-auth handles its own body parsing
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use("/health", healthRouter);
app.use("/me", meRouter);
app.use("/debug", debugRouter);

export default app;
