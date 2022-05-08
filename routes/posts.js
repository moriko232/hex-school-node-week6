var express = require("express");
var router = express.Router();
const Post = require("../model/post.js");
const User = require("../model/user.js");

const errorHandler = require("../service/errorHandler");
const successHandler = require("../service/successHandler");

router.get("/posts", async (req, res) => {
  // const error = new Error("aaaaaaaaaaaaa");
  // next(error);
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
});

// 新增POSTS
router.post("/post", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findById(data.userId).exec();

    if (user === null) {
      errorHandler(res, "此User不存在");
      return;
    }
    if (data.title === undefined) {
      errorHandler(res, "POST title未填寫");
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
  } catch (error) {
    // console.log("req error", error);
    errorHandler(res, `POST 格式錯誤，${error}`);
  }
});

router.delete("/posts", async (req, res) => {
  await Post.deleteMany({})
    .then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
});

router.delete("/post/:id", async (req, res) => {
  const id = req.params.id;
  const findPostId = await Post.findById(id);
  if (findPostId === null) {
    errorHandler(res, "文章不存在");
    return;
  }
  await Post.findByIdAndDelete(id)
    .then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    })
    .catch(() => {
      errorHandler(res, error);
    });
});

router.patch("/post/:id", async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const findUserId = await Post.findById(id);
    if (findUserId === null) {
      errorHandler(res, "文章不存在");
      return;
    }
    if (data.title === undefined) {
      errorHandler(res, "格式錯誤或無該筆資料");
      return;
    }

    const post = {
      tag: data.tag,
      userName: data.userName,
      title: data.title,
      content: data.content,
      imgUrl: data.imgUrl,
    };
    await Post.findByIdAndUpdate(id, post)
      .then(async () => {
        const allData = await Post.find();
        successHandler(res, allData);
      })
      .catch(() => {
        errorHandler(res, error);
      });
  } catch (error) {
    errorHandler(res, "格式錯誤");
  }
});

module.exports = router;
