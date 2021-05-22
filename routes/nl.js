const express = require("express");
const bodyParser = require("body-parser");
const NLController = require("../controllers/nl");
const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/api/data", jsonParser, NLController.getData);

module.exports = router;
