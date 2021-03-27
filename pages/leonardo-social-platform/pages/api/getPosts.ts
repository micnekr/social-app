import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, Post, Vote } from "../../lib/mongodbUtils";

async function getUserTopics(uid) {
  return [1, 2];
}

const handlers = {
  GET: async (req, res) => {
    const postsNum = parseInt(req?.query?.postsNum ?? 20); // either the set value or the default

    await connectToDatabase();

    const uid = req?.query?.uid;

    let findObject;
    if (req?.query?.topic) findObject = { topics: req.query.topic };
    else if (uid) findObject = { topics: { $in: await getUserTopics(uid) } };
    else findObject = {};

    const query = Post.find(findObject, { __v: 0 })
      .sort({ _id: -1 })
      .limit(postsNum)
      .populate("user", { _id: 0, username: 1 })
      .lean();

    let posts = await query.exec();
    const postIds = posts.map((post) => post._id);

    const postsById = {};
    for (let post of posts) {
      postsById[post._id] = post;
    }

    // delete the post ids
    posts.forEach((post) => {
      delete post._id;
    }); // return without ids

    if (uid) {
      const votes = await Vote.find(
        { user: uid, post: postIds },
        { score: 1 }
      ).populate("post", { _id: 1 });

      for (let vote of votes) {
        const postId = vote.post._id;
        const isPositive = vote.score > 0;
        const post = postsById[postId];
        if (isPositive) post.isUp = true;
        else post.isDown = true;
      }
    }

    const responseObj = {
      posts,
    };
    return res.status(200).json(responseObj);
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
