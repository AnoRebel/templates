const path = require("path");
const fastifyEnv = require("fastify-env");
const helmet = require("fastify-helmet");

const options = {
  dotenv: true,
  // confKey: "config", // optional, default: 'config'
  schema: {
    type: "object",
    required: ["PORT"],
    properties: {
      PORT: {
        type: "string",
        default: 3000,
      },
    },
  },
  // data: data, // optional, default: process.env
};

module.exports = async function (fastify, opts, next) {
  fastify.register(fastifyEnv, options).ready(err => {
    if (err) console.error(err);

    console.log(fastify.config); // or fastify[options.confKey]
    // output: { PORT: 3000 }
  });
  fastify.register(
    helmet,
    // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
    { contentSecurityPolicy: false }
  );
  fastify
    .register(require("fastify-static"), {
      root: path.join(__dirname, "../public"),
    //   prefix: "/public/", // optional: default '/'
    })
    .after(err => {
      if (err) console.error(err);
    });
  fastify.register(require("fastify-rate-limit"), {
    max: 100,
    timeWindow: "1 minute",
  });
  fastify.register(require("fastify-formbody"));
  fastify.register(require("fastify-compress"));
  //   fastify.register(require("fastify-cors"), instance => (req, callback) => {
  //     let corsOptions;
  //     // do not include CORS headers for requests from localhost
  //     if (/localhost/.test(origin)) {
  //       corsOptions = { origin: false };
  //     } else {
  //       corsOptions = { origin: true };
  //     }
  //     callback(null, corsOptions); // callback expects two parameters: error and options
  //   });

  next();
};
