const redisDB = require("redis");

const redisClient = redisDB.createClient();

redisClient.connect();

redisClient.on("connect", () => console.log("Connect to redis"));
redisClient.on("error", (err) => console.log("RedisError: ", err.message));
redisClient.on("ready", () =>
  console.log("Connected to redis and ready to use...")
);
redisClient.on("end", () => console.log("Disconnected from redis!"));

module.exports = redisClient;
