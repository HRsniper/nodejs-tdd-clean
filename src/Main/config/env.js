module.exports = {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/nodejs-tdd-clean",
  tokenSecret: process.env.TOKEN_SECRET || "secret",
  port: process.env.PORT || 3333
};
