const { default: mongoose, Types } = require("mongoose");

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
    default: [],
  },
  comments: {
    type: [],
    default: [],
  },
  author: {
    type: Types.ObjectId,
    required: true,
  },
  category: {
    type: Types.ObjectId,
    required: true,
  },
  like: {
    type: [Types.ObjectId],
    default: [],
  },
  dislike: {
    type: [Types.ObjectId],
    default: [],
  },
  bookmark: {
    type: [Types.ObjectId],
    default: [],
  },
});

module.exports = {
  BlogModel: mongoose.model("blog", Schema),
};
