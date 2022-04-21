/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const { MongoClient } = require("mongodb");
const CoinAPI = require("../CoinAPI");

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.monogoUrl = "mongodb://localhost:37017";
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(this.monogoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.client = await mongoClient.connect();
    this.collection = this.client.db("bitcoinpriceindex").collection("values");
    return this.client;
  }

  async disconnect() {}

  async insert() {}

  async getMax() {}

  async max() {
    console.log("Connecting to MongoDB...");
    console.time("mongoDB-connect");
    const client = await this.connect();
    if (client.isConnected()) {
      console.info("MongoDB connected...");
    } else {
      throw new Error("MongoDB connect failed");
    }
    console.timeEnd("mongoDB-connect");
  }
}

module.exports = MongoBackend;
