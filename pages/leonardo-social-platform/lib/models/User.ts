import { Schema, model } from "mongoose";

let cached = global.userModel;

if (!cached)
  cached = global.userModel = model(
    "users",
    new Schema({
      email: String,
    })
  );

export default cached;
