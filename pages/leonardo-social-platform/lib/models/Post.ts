import { Schema, model } from "mongoose";

let cached = global.postModel;

if (!cached)
  cached = global.postModel = model(
    "posts",
    new Schema({
      title: String,
      description: String,
      topics: [{ id: Number }],
    })
  );

export default cached;
