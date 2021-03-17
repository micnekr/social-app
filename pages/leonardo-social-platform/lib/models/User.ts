import { Schema, model } from "mongoose";

let cached = global.userModel;

if (!cached)
  cached = global.userModel = model(
    "users",
    new Schema({
      email: String,
      username: String,
      topics: [{ id: Number }],
    })
  );

export default cached;
