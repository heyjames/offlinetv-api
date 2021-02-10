const Redis = require('ioredis');

// redis.on('connect', () => console.log('_______________connect'));
// redis.on('ready'       , () => console.log('_______________ready'));
// redis.on('reconnecting', () => console.log('_______________reconnecting'));
// redis.on('end'         , () => console.log('_______________end'));

const redis = new Redis();

redis.on("error", () => {
  console.error("Redis error occurred.");
  process.exit(1);
});

module.exports = {
  redis
};