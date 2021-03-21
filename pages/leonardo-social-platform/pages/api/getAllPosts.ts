import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, Post } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    const postsNum = parseInt(req?.query?.postsNum ?? 20); // either the set value or the default
    console.log(postsNum);

    await connectToDatabase();

    const query = Post.find({}, { _id: 0, __v: 0 })
      .sort({ date: -1 })
      .limit(postsNum)
      .populate("user", { _id: 0, username: 1 });

    const posts = await query.exec();

    res.status(200).json({ posts });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
