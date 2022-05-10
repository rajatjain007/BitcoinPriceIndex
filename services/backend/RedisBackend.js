/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const CoinAPI = require("../CoinAPI");
const Redis = require("ioredis");

class RedisBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  async connect() {
    this.client = new Redis(7379);
    return this.client;
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];
    Object.entries(data.bpi).forEach((entries) => {
      values.push(entries[1]);
      values.push(entries[0]);
    });
    return this.client.zadd("bitcoin:values", values);
  }

  async getMax() {
    return this.client.zrange("bitcoin:values", -1, -1, "WITHSCORES");
  }

  async max() {
    console.log("Connecting to Redis...");
    console.time("redis-connect");
    const client = this.connect();
    // if (client.isConnected()) {
    //   console.info("MongoDB connected...");
    // } else {
    //   throw new Error("MongoDB connect failed");
    // }
    console.timeEnd("redis-connect");
    console.info("Inserting into Redis");
    const insertResult = await this.insert();
    const result = await this.getMax();

    console.log("Disconnecting to Redis...");
    console.time("redis-disconnect");
    await this.disconnect();
    console.timeEnd("redis-disconnect");
    return result;
  }
}

module.exports = RedisBackend;
