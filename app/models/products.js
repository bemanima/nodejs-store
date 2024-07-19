const { default: mongoose, Types } = require("mongoose");

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  short_desc: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  tags: { type: [String], default: [] },
  category: { type: Types.ObjectId, required: true },
  comments: { type: [], default: [] },
  like: { type: [Types.ObjectId], default: [] },
  dislike: { type: [Types.ObjectId], default: [] },
  bookmark: { type: [Types.ObjectId], default: [] },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  count: { type: Number },
  type: { type: String, required: true },
  time: { type: String },
  format: { type: String },
  teacher: { type: Types.ObjectId, required: true },
  detail: {
    type: Object,
    default: {
      length: "",
      height: "",
      width: "",
      weight: "",
      madeIn: "",
      colors: [],
      model: [],
    },
  },
});

module.exports = {
  ProductModel: mongoose.model("product", Schema),
};
