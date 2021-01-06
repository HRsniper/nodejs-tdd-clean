const loginRouter = require("../composers/login-router-composer");
const ExpressRouterAdapter = require("../adapters/express-router-adapter");

module.exports = async (router) => {
  router.post("/login", ExpressRouterAdapter.adapter(loginRouter));
};
