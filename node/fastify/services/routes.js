module.exports = async function (fastify, opts, next) {
  fastify.get("/api", function (req, reply) {
    return reply.send({ marco: "polo" });
  });

  next();
};
