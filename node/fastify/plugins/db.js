const fp = require("fastify-plugin");
// const models = require("../models");

async function db(fastify, options, next) {
//   fastify.decorate("db", models);
}

module.exports = fp(db);
