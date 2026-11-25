import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Rebuilds cached pages right after the owner saves something in the dashboard, so the change is
 * live immediately instead of after the 60-second refresh. Called only by server.ts (same process),
 * with a random token created when the server starts.
 *
 * POST /api/revalidate?paths=<JSON array>   header x-revalidate-token: <token>
 * (No request body: the Express server in front has already read the body stream.)
 */
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const expected = process.env.REVALIDATE_TOKEN;
  if (req.method !== "POST" || !expected || req.headers["x-revalidate-token"] !== expected) {
    return res.status(401).json({ ok: false });
  }
  let paths: string[] = [];
  try {
    const parsed = JSON.parse(String(req.query.paths || "[]"));
    if (Array.isArray(parsed)) paths = parsed;
  } catch {
    paths = [];
  }
  const done: string[] = [];
  const failed: string[] = [];
  // One at a time: the hosting container has very few threads.
  for (const path of paths) {
    if (typeof path !== "string" || !path.startsWith("/")) continue;
    try {
      await res.revalidate(path);
      done.push(path);
    } catch {
      failed.push(path);
    }
  }
  return res.json({ ok: true, done, failed });
}
