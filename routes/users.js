var express = require("express");
var router = express.Router();
const User = require("../model/userModel.js");

const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");

router.post(
  "/user",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    const user = {
      userName: data.userName,
      email: data.email,
      password: data.password,
      avatarUrl: data.avatarUrl,
    };
    await User.create(user).then(async () => {
      const allUser = await User.find();
      successHandler(res, allUser);
    });
  })
);

module.exports = router;
