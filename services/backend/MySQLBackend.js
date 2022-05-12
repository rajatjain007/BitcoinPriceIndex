/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const CoinAPI = require("../CoinAPI");
const mysql = require("mysql2/promise");

class MySQLBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null;
  }

  async connect() {
    this.connection = mysql.createConnection({
      host: "localhost",
      port: 3406,
      user: "root",
      password: "mypassword",
      database: "bitcoin",
    });
    return this.connection;
  }

  async disconnect() {
    (await this.connection).end();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const sql = "INSERT INTO bitcoinprices (valuedate, coinvalue) VALUES ?";
    const values = [];
    Object.entries(data.bpi).forEach((entry) => {
      values.push(entry[0], entry[1]);
    });
    (await this.connection).query(sql, [values]);
  }

  async getMax() {
    return (await this.connection).query(
      "SELECT * FROM bitcoinprice ORDER by coinvalue DESC LIMIT 0,1 "
    );
  }

  async max() {
    console.log("Connecting to MySQL...");
    console.time("mysql-connect");
    const connection = this.connect();
    // if (client.isConnected()) {
    //   console.info("MongoDB connected...");
    // } else {
    //   throw new Error("MongoDB connect failed");
    // }
    console.timeEnd("mysql-connect");
    console.info("Inserting into MySQL");
    const insertResult = await this.insert();
    const result = await this.getMax();
    const row = result[0][0];

    console.log("Disconnecting to MySQL...");
    console.time("mysql-disconnect");
    await this.disconnect();
    console.timeEnd("mysql-disconnect");
    return row;
  }
}

module.exports = MySQLBackend;
