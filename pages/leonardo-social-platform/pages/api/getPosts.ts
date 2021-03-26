import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, Post } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    const postsNum = parseInt(req?.query?.postsNum ?? 20); // either the set value or the default

    await connectToDatabase();

    let findObject;
    if (req?.query?.topic) findObject = { topics: req.query.topic };
    else findObject = {};

    const query = Post.find(findObject, { _id: 0, __v: 0 })
      .sort({ _id: -1 })
      .limit(postsNum)
      .populate("user", { _id: 0, username: 1 });

    try {
      const posts = await query.exec();
      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).json("Could not process that request");
    }
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
