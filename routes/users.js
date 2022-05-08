var express = require("express");
var router = express.Router();
const User = require("../model/user.js");

const errorHandler = require("../service/errorHandler");
const successHandler = require("../service/successHandler");

router.post("/user", async (req, res) => {
  try {
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
  } catch (error) {
    console.log("req error", error);
    errorHandler(res, `POST User 格式錯誤，${error}`);
  }
});

module.exports = router;
