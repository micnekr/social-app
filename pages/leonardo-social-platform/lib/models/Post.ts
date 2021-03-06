import { Schema, model } from "mongoose";

let cached = global.postModel;

if (!cached)
  cached = global.postModel = model(
    "posts",
    new Schema({
      pubId: String,
      user: { type: Schema.Types.ObjectId, ref: "users" },
      title: String,
      description: String,
      topics: [Number],
      score: Number,
    })
  );

export default cached;
