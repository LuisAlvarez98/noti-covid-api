const axios = require("axios");
// This function is used to obtain the info from the website.
exports.getData = async () => {
  let res = await axios
    .get("http://www.gncys.com/covid19/covid19-estados.aspx?edoId=NL")
    .catch((error) => {
      console.log(error);
    });
  return res;
};
