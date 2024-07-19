const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const { AllRoutes } = require("./router/router");

module.exports = class Application {
  #app = express();
  #DB_URI;
  #PORT;

  constructor(DB_URI, PORT) {
    this.#DB_URI = DB_URI;
    this.#PORT = PORT;
    this.configApplication();
    this.connectToMongoDB();
    this.createServer();
    this.createRoutes();
    this.errorHandling();
  }

  configApplication() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
  }
  createServer() {
    const http = require("http");
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log("run > http://localhost:" + this.#PORT);
    });
  }
  async connectToMongoDB() {
    try {
      if (mongoose.connections[0].readyState) return;

      mongoose.set("strictQuery", true);
      await mongoose.connect(this.#DB_URI);
      console.log("Connected to DB");
    } catch (error) {
      console.log("Failed to connect to MongoDB =>", error);
    }
  }

  createRoutes() {
    this.#app.use(AllRoutes);
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        statusCode: 404,
        message: "آدرس مورد نظر یافت نشد",
      });
    });
    this.#app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      const message = err.message || "InternalServerError";
      return res.status(statusCode).json({
        statusCode,
        message,
      });
    });
  }
};
