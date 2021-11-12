const fp = require("fastify-plugin");
const createError = require("fastify-error");

async function customError(fastify, options) {
  const CustomError = createError("ERROR_CODE", "Message: %s");
  // fastify.register("CustomError", CustomError);
  // console.log(new CustomError());
}

module.exports = fp(customError);
