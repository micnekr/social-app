import { createHandlers } from "../../lib/rest-utils";
import { removeSession, getSession } from "../../lib/auth-cookies";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, User, Post } from "../../lib/mongodbUtils";

const handlers = {
  POST: async (req, res) => {
    const session = await getSession(req);

    const body = req?.body ?? {}; // either the body or an empty obj
    const { title, description, topicIds } = body;

    if (!title || !description || !topicIds)
      return res
        .status(400)
        .json({ message: "Not enough parameters in the body" });

    if (session === undefined)
      return res.status(400).json({ message: "Not signed in" });

    await connectToDatabase();

    const user = (await User.find({ email: session.email }))?.[0];

    // check that the user exists
    if (!user) return res.status(400).json({ message: "User not available" });
    console.log(await Post.find({}));
    console.log(await Post.deleteOne({}));
    console.log(await Post.deleteOne({}));

    const userId = user._id;
    const post = new Post({ userId, title, description, topics: topicIds });
    await post.save();

    res.status(200).json({ done: true });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
