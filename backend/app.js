const express = require("express");
const app = express();
const dotenv = require("dotenv");
const loader = require("./loader");

dotenv.config();
loader(app);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app listening on port ${process.env.PORT || 3000}!`);
});
