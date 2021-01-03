module.exports = (request, response, next) => {
  // CORS
  response.set("access-control-allow-origin", "*");
  response.set("access-control-allow-methods", "*");
  response.set("access-control-allow-headers", "*");

  next();
};
