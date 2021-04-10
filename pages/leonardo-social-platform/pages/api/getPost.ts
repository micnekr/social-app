import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, Post, Vote } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    await connectToDatabase();

    console.log(req.query);

    const pubId = req?.query?.id;
    const uid = req?.query?.uid;
    console.log(pubId);
    if (!pubId) res.status(400).json({ message: "no post id specified" });

    let findObject = { pubId: pubId };

    const query = Post.findOne(findObject, { __v: 0 })
      .populate("user", { _id: 0, username: 1 })
      .lean();

    let post = await query.exec();
    if (!post) return res.status(404).json({ message: "no post found" });
    const postId = post._id;

    delete post._id; // return without id

    console.log(post);

    if (uid) {
      const votes = await Vote.find(
        { user: uid, post: postId },
        { score: 1 }
      ).populate("post", { _id: 1 });
      for (let vote of votes) {
        const isPositive = vote.score > 0;
        if (isPositive) post.isUp = true;
        else post.isDown = true;
      }
    }
    return res.status(200).json(post);
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
