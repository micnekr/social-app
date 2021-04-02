import { Schema, model } from "mongoose";

let cached = global.commentModel;

if (!cached)
  cached = global.commentModel = model(
    "comments",
    new Schema({
      pubId: String,
      post: { type: Schema.Types.ObjectId, ref: "posts" },
      contents: String,
    })
  );

export default cached;
