import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, User } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    if (req?.query?.email === undefined)
      return res.status(400).json({ message: "Email needed" });

    await connectToDatabase();

    const email = req.query.email;

    const result = await User.find({ email });

    res.status(200).json({ result: result.length !== 0 });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
