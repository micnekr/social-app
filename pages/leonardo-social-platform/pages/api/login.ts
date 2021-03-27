import { magic } from "../../lib/magic";
import { createSession, getSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";

import { connectToDatabase, User } from "../../lib/mongodbUtils";

import type { NextApiRequest, NextApiResponse } from "next";

import { randomBytes } from "crypto";

async function createUser({ email, username }) {
  const user = new User({ email, username, topics: [] });
  return await user.save();
}

async function getUser(email) {
  const user = await User.find({ email });
  return user.length === 0 ? null : user[0];
}

const handlers = {
  POST: async (req, res) => {
    if (!req.headers.authorization)
      return res.status(400).json({ message: "Invalid login headers" });
    if ((await getSession(req)) !== undefined)
      return res.status(400).json({ message: "Already signed in" });
    const didToken = magic.utils.parseAuthorizationHeader(
      req.headers.authorization
    );

    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);

    await connectToDatabase();
    // We auto-detect signups if `getUserByEmail` resolves to `undefined`

    let user = await getUser(email);
    // signup
    if (!user) {
      // require a username
      if (!req.body?.username)
        return res
          .status(400)
          .json({ message: "A username is required for sign up" });
      user = await createUser({ email, username: req.body.username });
    }

    // random token
    const token = randomBytes(48).toString("base64");

    await createSession(res, {
      token,
      email,
      issuer,
      id: user._id,
    });

    res.status(200).json({ done: true });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
