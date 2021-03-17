import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, User } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    if (req?.query?.username === undefined)
      return res.status(400).json({ message: "Username needed" });

    await connectToDatabase();

    const username = req.query.username;

    const result = await User.find({ username });

    res.status(200).json({ result: result.length !== 0 });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
