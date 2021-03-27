import { createHandlers } from "../../lib/rest-utils";

import { getSession } from "../../lib/auth-cookies";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase, Post, Vote } from "../../lib/mongodbUtils";

const handlers = {
  POST: async (req, res) => {
    const session = await getSession(req);
    if (session === undefined)
      return res.status(400).json({ message: "Not signed in" });

    await connectToDatabase();

    const score = req?.body?.score === 1 ? 1 : -1;
    const postPubId = req?.body?.postId;

    if (!postPubId) return res.status(400).json({ message: "No post chosen" });
    const postId = (await Post.find({ pubId: postPubId }))?.[0];
    if (!postId) return res.status(400).json({ message: "No post chosen" });

    const uid = session.id;

    const query = Vote.find({ user: uid, score })
      .populate("post")
      .find({ post: postId });

    const previousVote = (await query.exec())?.[0];
    // if post does not exist, add the vote
    if (!previousVote) {
      const vote = new Vote({ user: uid, post: postId, score });
      await vote.save();
    } else {
      await Vote.deleteOne({ _id: previousVote._id });
    }

    const changeByScore = score * (previousVote ? -1 : 1);

    // increment the post score
    const newPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { score: changeByScore } }
    );

    return res.status(200).json({
      newScore: newPost.score + changeByScore,
      wasVoteAdded: !previousVote,
    });
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
