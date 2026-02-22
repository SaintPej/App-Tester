import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      take: 5,
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

export default router;
