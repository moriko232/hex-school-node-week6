var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("./connect/db.js");
var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");
var usersRouter = require("./routes/users");

var app = express();

// 發生重大錯誤會到這
process.on("uncaughtException", (err) => {
  console.error("Uncaughted Exception: ");
  console.error(err);
  // 記錄錯誤下來，等到所有其他服務處理完成，然後停掉該process
  server.close(() => {
    process.exit(1);
  });
});

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
  // errorHandler(res, "404 此頁面不存在", 404);
});

// error 500 預期next(err)的錯誤會到這
app.use((err, req, res, next) => {
  console.error("500 err: ", err);
  // errorHandler(res, err.message, 500);
});

// 其他未預期的錯誤會到這
process.on("unhandleRejection", (err, promise) => {
  console.error("未捕捉的錯誤: ", promise, "。原因: ", err);
});

module.exports = app;
