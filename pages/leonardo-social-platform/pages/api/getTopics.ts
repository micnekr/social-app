import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    // await connectToDatabase();

    res.status(200).json([
      { id: 1, name: "e" },
      { id: 2, name: "ee" },
      {
        id: 3,
        name:
          "something super long in order to do stuff, idk just for testing i suppose",
      },
    ]);
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
