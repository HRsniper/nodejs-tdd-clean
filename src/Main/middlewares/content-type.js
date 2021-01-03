module.exports = (request, response, next) => {
  // CORS
  response.type("json");

  next();
};
