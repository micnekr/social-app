import { Schema, model } from "mongoose";

let cached = global.postModel;

if (!cached)
  cached = global.postModel = model(
    "posts",
    new Schema({
      userId: String,
      title: String,
      description: String,
      topics: [Number],
    })
  );

export default cached;
