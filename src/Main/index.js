const MongoHelper = require("../infrastructure/helpers/mongo-helper");
const env = require("./config/env");
// const bcrypt = require("bcrypt");

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const app = require("./config/app");

    // console.log(bcrypt.hashSync("hashed_password", 10));

    app.listen(env.port, () => console.log(`server running on http://localhost:${env.port}`));
  })
  .catch(console.error);
