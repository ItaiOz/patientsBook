// const { MongoClient } = require("mongodb");

const express = require("express");
const router = express.Router();

router.route("/").get(async function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect.coll;
});

//Get all
// router.get("/", (req, res) => {
//   res.send("Hello World ");
// });

module.exports = router;
