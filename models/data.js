const mongoose = require("mongoose");

const nlDataSchema = mongoose.Schema({});

const NLData = mongoose.model("NLData", nlDataSchema);
module.exports = NLData;
