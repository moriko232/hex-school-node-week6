var express = require("express");
var validator = require("validator");
var bcrypt = require("bcrypt");
var router = express.Router();
const User = require("../model/userModel.js");

const generateSendJWT = require("../service/generateSendJWT.js");
const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");

// 列出會員
router.get(
  "/users",
  handleErrAsync(async (req, res, next) => {
    const allUser = await User.find();
    successHandler(res, allUser);
  })
);

// 註冊會員
router.post(
  "/user/sign_up",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    let { email, userName, password } = data;

    // 手動檢查欄位
    if (!userName) {
      return appError({ errMessage: "未填寫userName" }, next);
    }
    if (!email) {
      return appError({ errMessage: "未填寫email" }, next);
    }
    if (!password) {
      return appError({ errMessage: "未填寫password" }, next);
    }
    if (!validator.isEmail(email)) {
      return appError({ errMessage: "email格式有誤" }, next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError({ errMessage: "密碼未達8碼" }, next);
    }
    const existUser = await User.find({ email });
    if (existUser.length) {
      return appError({ errMessage: "此email已被使用" }, next);
    }

    // 加密password
    password = await bcrypt.hash(password, 12);
    console.log("new pw", password);

    const user = {
      userName,
      email,
      password,
    };
    console.log("new user", user);

    const newUser = await User.create(user);

    generateSendJWT(newUser, 201, res);
  })
);

module.exports = router;
