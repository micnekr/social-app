const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3000"
  : "https://leonardo.ibdc.ru";
export const dbServer = dev ? "localhost:27017" : "db";
