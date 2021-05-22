exports.getData = async (req, res) => {
  return res.status(200).json({ data: { message: "Get Data" } });
};
