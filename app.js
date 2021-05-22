require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("./middleware/cors");

const nlRoutes = require("./routes/nl");

/** Setup Mongoose */
mongoose.connect("mongodb://localhost/noticovid", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

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

db.once("open", () => {
  console.log("Connected to the db");
  app.listen(8080, () => {
    console.log("The server is running on port 8080");
  });
});

db.on("error", () => {
  console.log("DB connection error");
});
