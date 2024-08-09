const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
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
    this.#app.use(cors());
    this.#app.use(morgan("dev"));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    this.#app.use(
      "/api-doc",
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJsDoc({
          swaggerDefinition: {
            info: {
              title: "Store",
              version: "2.0.0",
              description: "نمونه فروشگاه",
            },
            servers: [
              {
                url: "http://localhost:3000",
              },
            ],
          },
          apis: ["./app/router/**/*.js"],
        })
      )
    );
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
      mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
      });
    } catch (error) {
      console.log("Failed to connect to MongoDB =>", error);
    }
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  }

  createRoutes() {
    this.#app.use(AllRoutes);
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("آدرس مورد نظر یافت نشد"));
    });
    this.#app.use((err, req, res, next) => {
      const serverError = createError.InternalServerError();

      const statusCode = err.status || serverError.statusCode;
      const message = err.message || serverError.message;

      return res.status(statusCode).json({
        errors: {
          statusCode,
          message,
        },
      });
    });
  }
};
