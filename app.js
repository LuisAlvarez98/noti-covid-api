require("dotenv").config();
var globals = require("./utils/globals");
const express = require("express");
const morgan = require("morgan");
const cors = require("./middleware/cors");
const cheerio = require("cheerio");
const cron = require("node-cron");
const nlRoutes = require("./routes/nl");
const { getData } = require("./utils/util");

/** Setup app */
const app = express();

/** Setup global middlewares */
app.use(cors);
app.use(morgan("dev"));

/** Setup routes */
app.use(nlRoutes);

app.get("/", function (req, res) {
  res.send("NotiCovid, API working");
});

app.all("*", (req, res) => {
  console.log("not found");
  res.statusMessage = "Route not found";
  res.status(404).end();
});

// This cronjob will get the data of the website and set the values in global
cron.schedule("* * * * *", async () => {
  console.log("running a task every minute");
  let res = await getData();
  let data = res.data;
  let $ = cheerio.load(data);
  let fecha = $("body > main > div.row.w-100 > div.col-sm-10 > p").text();
  let confirmados = $(
    "body > main > div:nth-child(2) > div.col-sm-10 > div > div:nth-child(1) > div > div.card-body.d-flex.align-items-end > div"
  ).text();
  let defunciones = $(
    "body > main > div:nth-child(2) > div.col-sm-10 > div > div:nth-child(2) > div > div.card-body.d-flex.align-items-end > div"
  ).text();
  let sospechosos = $(
    "body > main > div:nth-child(2) > div.col-sm-10 > div > div:nth-child(3) > div > div.card-body.d-flex.align-items-end > div"
  ).text();
  let negativos = $(
    "body > main > div:nth-child(2) > div.col-sm-10 > div > div:nth-child(4) > div > div.card-body.d-flex.align-items-end > div"
  ).text();
  let activos = $(
    "body > main > div:nth-child(2) > div.col-sm-10 > div > div:nth-child(5) > div > div.card-body.d-flex.align-items-end > div"
  ).text();

  let datosGenerales = {
    confirmados,
    defunciones,
    sospechosos,
    negativos,
    activos,
  };
  let datosMunicipios = $(
    "body > main > div:nth-child(5) > div.col-sm-10 > div > div > div > div.card-body.h-100 > table"
  )
    .map(function () {
      return $(this)
        .find("td")
        .map(function () {
          return $(this).text();
        })
        .get();
    })
    .get();
  let listaDatosMunicipios = [];
  for (let i = 0; i < datosMunicipios.length; i += 5) {
    if (datosMunicipios[i + 1] !== "066" && datosMunicipios[i + 1] !== "999") {
      listaDatosMunicipios.push({
        municipio: datosMunicipios[i + 1],
        confirmados: datosMunicipios[i + 2],
        defunciones: datosMunicipios[i + 3],
        sospechosos: datosMunicipios[i + 4],
      });
    }
  }
  globals.datosGenerales = datosGenerales;
  globals.listaDatosMunicipios = listaDatosMunicipios;
});

app.listen(8080, () => {
  console.log("The server is running on port 8080");
});
