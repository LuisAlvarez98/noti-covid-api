let covidData = {};

exports.getPdf = async (req, res) => {};

exports.getData = async (req, res) => {
  return res.status(200).json({ data: covidData });
};
