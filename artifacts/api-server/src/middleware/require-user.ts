import type { RequestHandler } from "express";

export const requireUser: RequestHandler = (req, res, next) => {
  const raw = req.session as { userId?: number } | null | undefined;
  const uid = raw?.userId;
  if (typeof uid !== "number") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = uid;
  next();
};

