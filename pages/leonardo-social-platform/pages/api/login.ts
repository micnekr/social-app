import { magic } from "../../lib/magic";
import { createSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";

import { connectToDatabase, User } from "../../lib/mongodbUtils";

import type { NextApiRequest, NextApiResponse } from "next";

import { randomBytes } from "crypto";

async function createUser(email) {
  const user = new User({ email });
  return await user.save();
}

async function getUser(email) {
  const user = await User.find({ email });
  return user.length === 0 ? null : user;
}

const handlers = {
  POST: async (req, res) => {
    if (!req.headers.authorization)
      return res.status(400).json({ message: "Invalid login headers" });
    const didToken = magic.utils.parseAuthorizationHeader(
      req.headers.authorization
    );

    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);

    await connectToDatabase();
    // We auto-detect signups if `getUserByEmail` resolves to `undefined`
    const user = (await getUser(email)) || (await createUser(email));

    // random token
    const token = randomBytes(48).toString("base64");

    await createSession(res, { token, email, issuer });

    res.status(200).json({ done: true });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
