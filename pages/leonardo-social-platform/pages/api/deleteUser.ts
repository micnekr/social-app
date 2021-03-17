import { createHandlers } from "../../lib/rest-utils";
import { removeSession, getSession } from "../../lib/auth-cookies";
import { magic } from "../../lib/magic";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, User } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    const session = await getSession(req);
    if (session === undefined)
      return res.status(400).json({ message: "Not signed in" });

    await connectToDatabase();
    await magic.users.logoutByIssuer(session.issuer);
    removeSession(res);

    const email = session.email;

    const result = await User.deleteOne({ email });

    res.status(200).json({ done: true });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
