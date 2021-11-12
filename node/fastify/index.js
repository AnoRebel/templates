/**
 * Author: Ano Rebel
 */
const throng = require("throng");
const Fastify = require("fastify");
const AutoLoad = require("fastify-autoload");
const { join } = require("path");

const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;

const app = Fastify({ logger: true });

// This will only be called once
const master = async () => {
  console.log("Initializing and synchronizing database!");

  // try {
  //   await db.sequelize.authenticate();
  //   console.log("Connection has been established successfully.");
  // } catch (error) {
  //   console.error("Unable to connect to the database:", error);
  // }

  // Only run once to initialize Database
  //db.sequelize.sync();

  process.once("beforeExit", () => {
    console.log("Exiting..");
  });
};

// This will be called WORKERS times
const worker = async () => {
  app.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
  });

  app.register(AutoLoad, {
    dir: join(__dirname, "services"),
  });

  const server = app.listen(PORT, "0.0.0.0", (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening on ${address}`);
  });
};

throng({ count: WORKERS, lifetime: Infinity, worker, master });
