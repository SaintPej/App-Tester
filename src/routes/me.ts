import { Router, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // Support Bearer token from server-side callers (e.g. WordPress PHP).
    // better-auth reads session from cookies, so we inject a synthetic cookie
    // header when the token arrives via Authorization: Bearer <token>.
    const authHeader = req.headers.authorization;
    let headers = req.headers;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const existingCookies = req.headers.cookie || "";
      const sessionCookie = `better-auth.session_token=${encodeURIComponent(token)}`;
      headers = {
        ...req.headers,
        cookie: existingCookies
          ? `${existingCookies}; ${sessionCookie}`
          : sessionCookie,
      };
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (!session) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
        role: session.user.role,
      },
    });
  } catch (err) {
    console.error("Get session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
