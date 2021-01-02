const express = require("express");

module.exports = (app) => {
  app.use(express.json());

  app.disable("x-powered-by");
};
