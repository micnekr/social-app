import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

const handlers = {
  GET: async (req, res) => {
    throw new Error("test 500 error");
    // res.status(500).json({ done: true });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
