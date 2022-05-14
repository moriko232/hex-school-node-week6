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

// 會員註冊
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

// 會員登入
router.post(
  "/user/login",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    let { email, password } = data;

    // 手動檢查欄位
    if (!email) {
      return appError({ errMessage: "未填寫email" }, next);
    }
    if (!password) {
      return appError({ errMessage: "未填寫password" }, next);
    }
    if (!validator.isEmail(email)) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }

    // +password可以額外撈出原本select false的資料
    const findUser = await User.findOne({ email }).select("+password");
    console.log("finduser", findUser);
    if (!findUser) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }

    const isPass = await bcrypt.compare(password, findUser.password);
    if (!isPass) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }

    generateSendJWT(findUser, 201, res);
  })
);

module.exports = router;
