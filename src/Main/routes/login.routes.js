const LoginRouterComposer = require("../composers/login-router-composer");
const { adapter } = require("../adapters/express-router-adapter");

module.exports = async (router) => {
  router.post("/login", adapter(LoginRouterComposer.composer()));
};
