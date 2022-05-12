const MongoBackend = require("./services/backend/MongoBackend");
const RedisBackend = require("./services/backend/RedisBackend");
const MySQLBackend = require("./services/backend/MySQLBackend");

async function runMongo() {
  const mongoBackend = new MongoBackend();

  return mongoBackend.max();
}

async function runRedis() {
  const redisBackend = new RedisBackend();

  return redisBackend.max();
}

async function runMySQL() {
  const mySQLBackend = new MySQLBackend();
  return mySQLBackend.max();
}

runRedis()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));

runMongo()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));

runMySQL()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));
