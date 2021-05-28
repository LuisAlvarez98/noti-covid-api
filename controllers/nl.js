var globals = require("../utils/globals");

exports.getData = async (req, res) => {
  return res.status(200).json({ data: globals });
};
