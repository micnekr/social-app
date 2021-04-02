/// <reference types="node" />
/// <reference types="mongoose" />

// Extend the NodeJS namespace with oir properties
declare namespace NodeJS {
  interface Global {
    commentModel: Model;
    postModel: Model;
    userModel: Model;
    voteModel: Model;
  }
}
