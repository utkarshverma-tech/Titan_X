import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/auth/register", async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "Valid email required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(usersTable)
      .values({ email, passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    await db.insert(settingsTable).values({ userId: user.id });

    (req.session as { userId?: number })!.userId = user.id;
    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    req.log.error({ err }, "register failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    (req.session as { userId?: number })!.userId = user.id;
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    req.log.error({ err }, "login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

router.get("/auth/me", async (req, res) => {
  try {
    const raw = req.session as { userId?: number } | null | undefined;
    const uid = raw?.userId;
    if (typeof uid !== "number") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const [user] = await db
      .select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, uid))
      .limit(1);

    if (!user) {
      req.session = null;
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.json({ user });
  } catch (err) {
    req.log.error({ err }, "me failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
