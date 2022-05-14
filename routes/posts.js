var express = require("express");
var router = express.Router();
const Post = require("../model/postModel.js");
const User = require("../model/userModel.js");

const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");

router.get(
  "/posts",
  handleErrAsync(async (req, res) => {
    const timeSort = req.query.timeSort == "asc" ? "createAt" : "-createAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};

    const allData = await Post.find(q)
      .populate({
        path: "userData",
        select: "userName",
      })
      .sort(timeSort);
    successHandler(res, allData);
  })
);

// 新增POSTS
router.post(
  "/post",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    const user = await User.findById(data.userId).exec();

    if (user === null) {
      appError({ errMessage: "此User不存在" }, next);
      return;
    }
    if (data.title === undefined) {
      appError({ errMessage: "POST title未填寫" }, next);
      return;
    }

    const post = {
      userData: data.userId,
      title: data.title,
      content: data.content,
      imgUrl: data.imgUrl,
      tag: data.tag,
    };
    await Post.create(post).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

router.delete(
  "/posts",
  handleErrAsync(async (req, res, next) => {
    await Post.deleteMany({}).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

router.delete(
  "/post/:id",
  handleErrAsync(async (req, res, next) => {
    const id = req.params.id;
    const findPostId = await Post.findById(id);
    if (findPostId === null) {
      appError({ errMessage: "文章不存在" }, next);
      return;
    }
    await Post.findByIdAndDelete(ss).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

router.patch(
  "/post/:id",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    const findUserId = await Post.findById(id);
    if (findUserId === null) {
      appError({ errMessage: "文章不存在" }, next);
      return;
    }
    if (data.title === undefined) {
      appError({ errMessage: "格式錯誤或無該筆資料" }, next);
      return;
    }

    const post = {
      tag: data.tag,
      userName: data.userName,
      title: data.title,
      content: data.content,
      imgUrl: data.imgUrl,
    };
    await Post.findByIdAndUpdate(id, post).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

module.exports = router;
