var express = require("express");
var router = express.Router();
const User = require("../model/userModel.js");

const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");

router.post(
  "/user/sign_up",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;

    // 檢查欄位
    if (data.userName === "") {
      appError({ errMessage: "未填寫userName" }, next);
    }

    const user = {
      userName: data.userName,
      email: data.email,
      password: data.password,
    };
    await User.create(user).then(async () => {
      const allUser = await User.find();
      successHandler(res, allUser);
    });
  })
);

module.exports = router;
