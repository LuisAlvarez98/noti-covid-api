require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("./middleware/cors");
const cron = require("node-cron");

const nlRoutes = require("./routes/nl");

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

/** Init */
cron.schedule("* * * * *", () => {
  // "59 23 * * *"
  console.log("running a task every minute");
});

app.listen(8080, () => {
  console.log("The server is running on port 8080");
});
