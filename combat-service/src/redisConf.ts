import Redis from "ioredis";

const host = process.env.REDIS_HOST || "localhost";
const port = parseInt(process.env.REDIS_PORT || "6379", 10);
const redis = new Redis({ host, port });

export default redis;