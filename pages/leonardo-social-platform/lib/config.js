const dev = process.env.NODE_ENV !== "production";

// export const server = dev ? "http://localhost:3000" : "https://name.com";
export const server = dev ? "http://localhost:3000" : "http://localhost:3000";
export const dbServer = dev ? "localhost:27017" : "db";
