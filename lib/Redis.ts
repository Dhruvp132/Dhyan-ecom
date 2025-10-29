import { Redis } from "ioredis";

// Redis temporarily disabled
export const client = null as any;

/*
export const client = new Redis(process.env.REDIS || "redis://localhost:6379", {
  tls: {
    rejectUnauthorized: false,
  },
});
if (process.env.REDIS) {
  client.on("connect", () => {
    console.log("Redis client successfully connected");
  });

  client.on("error", (error) => {
    console.error("Redis client encountered an error:", error);
  });
}
*/
