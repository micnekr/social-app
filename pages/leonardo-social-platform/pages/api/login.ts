import { magic } from "../../lib/magic";
import { createSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

const handlers = {
  POST: async (req, res) => {
    console.log("login request");
    if (!req.headers.authorization)
      return res.status(400).json({ message: "Invalid login headers" });
    const didToken = magic.utils.parseAuthorizationHeader(
      req.headers.authorization
    );

    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);

    console.log({ email, issuer });

    // We auto-detect signups if `getUserByEmail` resolves to `undefined`
    // const user =
    //   (await userModel.getUserByEmail(email)) ??
    //   (await userModel.createUser(email));
    // const token = await userModel.obtainFaunaDBToken(user);

    await createSession(res, { token, email, issuer });

    res.status(200).json({ done: true });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
