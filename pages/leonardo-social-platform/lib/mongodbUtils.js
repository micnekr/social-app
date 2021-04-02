import mongoose from "mongoose";
import User from "./models/User.ts";
import Post from "./models/Post.ts";
import Vote from "./models/Vote.ts";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export { User, Post, Vote };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // socialApp database
    cached.promise = mongoose.connect("mongodb://db/socialApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
    });
  }
  await cached.promise;
  cached.conn = mongoose.connection;
  return cached.conn;
}
