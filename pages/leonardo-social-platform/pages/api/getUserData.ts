import { getSession } from "../../lib/auth-cookies";

export default async function user(req, res) {
  const session = await getSession(req);

  if (session?.id) delete session.id;

  // can fetch the data here if needed
  res.status(200).json({ user: session || null });
}
