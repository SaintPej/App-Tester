import { Router, Request, Response } from "express";
import { put } from "@vercel/blob";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

const router = Router();

// POST /upload-image
// Body: { base64: string, mimeType: string, filename?: string }
// Returns: { url: string }
router.post("/", async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { base64, mimeType, filename } = req.body as {
      base64: string;
      mimeType?: string;
      filename?: string;
    };

    if (!base64) {
      res.status(400).json({ error: "base64 is required" });
      return;
    }

    const resolvedMimeType = mimeType ?? "image/jpeg";
    const ext = resolvedMimeType.split("/")[1] ?? "jpg";
    const blobFilename = filename ?? `upload-${session.user.id}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(base64, "base64");

    const blob = await put(blobFilename, buffer, {
      access: "public",
      contentType: resolvedMimeType,
    });

    res.json({ url: blob.url });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
