/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const { MongoClient } = require("mongodb");
const CoinAPI = require("../CoinAPI");

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.monogoUrl = "mongodb://localhost:37017/bitcoinpriceindex";
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

  async disconnect() {
    if (this.client) {
      return this.client.close();
    }
    return false;
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];
    Object.entries(data.bpi).forEach((entry) => {
      documents.push({
        date: entry[0],
        value: entry[1],
      });
    });
    return this.collection.insertMany(documents);
  }

  async getMax() {
    return this.collection.findOne({}, { sort: { value: -1 } });
  }

  async max() {
    console.log("Connecting to MongoDB...");
    console.time("mongoDB-connect");
    const client = await this.connect();
    // if (client.isConnected()) {
    //   console.info("MongoDB connected...");
    // } else {
    //   throw new Error("MongoDB connect failed");
    // }
    console.timeEnd("mongoDB-connect");
    console.info("Inserting into MongoDB");
    const insertResult = await this.insert();
    const doc = await this.getMax();

    console.log("Disconnecting to MongoDB...");
    console.time("mongoDB-disconnect");
    await this.client.close();
    console.timeEnd("mongoDB-disconnect");

    return {
      date: doc.date,
      value: doc.value,
    };
  }
}

module.exports = MongoBackend;
