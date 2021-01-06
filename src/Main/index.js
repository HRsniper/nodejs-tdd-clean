const MongoHelper = require("../infrastructure/helpers/mongo-helper");
const env = require("./config/env");

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const app = require("./config/app");
    app.listen(env.port, () => console.log(`server running on http://localhost:${env.port}`));
  })
  .catch(console.error);
