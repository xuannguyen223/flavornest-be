import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL as string,
  socket: {
    // setting a 10-second timeout
    connectTimeout: 10000, // in milliseconds
  },
});
console.log("Connecting Redis at: " + process.env.REDIS_URL);
redisClient.on("error", (err) => console.error("Redis Client Error", err));
await redisClient.connect();

export default redisClient;
