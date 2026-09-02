import type { Response } from "express";
export const ok = (
  res: Response,
  data: unknown,
  message = "Success",
  meta?: unknown,
) => res.json({ success: true, message, data, ...(meta ? { meta } : {}) });
