import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    res.json({ users });
  } catch (err) {
    console.error("Debug error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/accounts", async (_req: Request, res: Response) => {
  try {
    const accounts = await prisma.account.findMany({
      take: 10,
      select: {
        id: true,
        accountId: true,
        providerId: true,
        userId: true,
        scope: true,
        createdAt: true,
      },
    });
    res.json({ accounts });
  } catch (err: any) {
    console.error("Debug accounts error:", err);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

router.get("/sessions", async (_req: Request, res: Response) => {
  try {
    const sessions = await prisma.session.findMany({
      take: 10,
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        createdAt: true,
      },
    });
    res.json({ sessions });
  } catch (err: any) {
    console.error("Debug sessions error:", err);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

router.get("/schema-test", async (_req: Request, res: Response) => {
  try {
    // Test if we can write to each table
    const results: Record<string, string> = {};

    // Test user table columns
    const userColumns = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user' ORDER BY ordinal_position`;
    const accountColumns = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'account' ORDER BY ordinal_position`;
    const sessionColumns = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'session' ORDER BY ordinal_position`;

    res.json({
      userColumns,
      accountColumns,
      sessionColumns,
    });
  } catch (err: any) {
    console.error("Schema test error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
