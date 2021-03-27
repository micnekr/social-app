import { Schema, model } from "mongoose";

let cached = global.voteModel;

if (!cached)
  cached = global.voteModel = model(
    "votes",
    new Schema({
      user: { type: Schema.Types.ObjectId, ref: "users" },
      post: { type: Schema.Types.ObjectId, ref: "posts" },
      score: Number,
    })
  );

export default cached;
