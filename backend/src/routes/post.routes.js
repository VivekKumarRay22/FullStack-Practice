const express = require("express");
const postRouter = express.Router();
const multer = require("multer");
const postController = require("../controllers/post.controller");

const upload = multer({ storage: multer.memoryStorage() });
postRouter.post(
  "/",
  upload.single("imageURL"),
  postController.createPostController,
);
postRouter.get("/",postController.getPostController)
postRouter.get("/details/:postId", postController.getPostDetailsController)

module.exports = postRouter;
