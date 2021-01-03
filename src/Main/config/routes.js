const { Router } = require("express");
const fg = require("fast-glob");

const router = Router();

module.exports = (app) => {
  app.use("/api", router);
  fg.sync("**/src/Main/routes/**.routes.js").forEach((file) => require(`../../../${file}`)(router));
};
