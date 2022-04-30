const { response } = require("express");
const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/patients").get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("patients")
    .find({})
    .limit(0) //needs to be dynamic
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route("/patients/value").post(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("patients")
    .find({
      fullName: _req.body.name,
      loinc: _req.body.loincNum,
      transactionDate: { $lte: _req.body.requestedDate },
      transactionTime: { $lte: _req.body.requestedTime },
    })
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route("/patients/history").post(async function (_req, res) {
  const dbConnect = dbo.getDb();

  console.log(_req.body);

  dbConnect
    .collection("patients")
    .find({
      fullName: _req.body.name,
      transactionDate: { $gte: _req.body.fromDate },
      transactionDate: { $lte: _req.body.untilDate },
    })
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route("/patients/update").put(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect.collection("patients").updateOne(
    {
      fullName: _req.body.name,
      transactionDate: _req.body.date,
      loinc: _req.body.loinc,
    },
    {
      $set: { value: _req.body.newValue },
    },
    function (error, result) {
      if (error) res.status(400).send("Error updating listing!");
      res.json(result);
    }
  );
});

recordRoutes.route("/patients/delete").delete(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect.collection("patients").deleteOne(
    {
      fullName: _req.body.name,
      transactionDate: _req.body.date,
      loinc: _req.body.loinc,
    },
    function (error, result) {
      if (error) res.status(400).send("Error deleting listing!");

      res.json(result);
    }
  );
});

module.exports = recordRoutes;
