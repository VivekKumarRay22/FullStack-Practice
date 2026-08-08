const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  console.log(req.body, req.file);

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "token not provided, unauthorized access",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "invalid token, unauthorized access",
    });
  }

  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "test",
    folder: "practice-revision",
  });

  //   res.send(file);
  const post = await postModel.create({
    caption: req.body.caption,
    imageURL: file.url,
    user: decoded.id,
  });
  res.status(201).json({
    message: "post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "token not provided, unauthorized access",
    });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res(401).json({
      message: "invalid token, unauthorized access",
    });
  }
  const userId = decoded.id;
  const posts = await postModel.find({ user: userId });

  res.status(200).json({
    message: "post fetched successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "token not provided, unauthorized access",
    });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "invalid token, unauthorized access",
    });
  }

  const userId = decoded.id;
  const postId = req.params.postId;

}
module.exports = { createPostController, getPostController };
