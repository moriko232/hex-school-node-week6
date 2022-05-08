var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan"); 
var cors = require("cors");

require("./connect/db.js");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;

// app.use((req, res, next) => {
//   console.log("有人進來了");
//   next();
// });
