const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  imageURL: {
    type: String,
    required: [true, "image is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "user id is required"],
  },
});

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
