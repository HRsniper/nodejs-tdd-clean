const express = require("express");

module.exports = (app) => {
  app.disable("x-powered-by");

  app.use(express.json());

  app.use((request, response, next) => {
    // CORS
    response.set("access-control-allow-origin", "*");
    response.set("access-control-allow-methods", "*");
    response.set("access-control-allow-headers", "*");

    next();
  });
};
