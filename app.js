var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("./connect/db.js");
var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");
var usersRouter = require("./routes/users");
const errorHandler = require("./service/errorHandler");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", usersRouter);

// error 404 找不到路由會到這
app.use((req, res, next) => {
  console.log("404 err");
  errorHandler(res, "404 此頁面不存在", 404);
});

// error 500 預期next(err)的錯誤會到這
app.use((err, req, res, next) => {
  errorHandler(res, err.message, 500);
});

module.exports = app;
