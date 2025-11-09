require("dotenv").config(); // ✅ PHẢI có dòng này để load biến môi trường

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnlj0mgct",
  api_key: "271525775288881",
  api_secret: "4iAc0U7EiKzo-pOuVaywYAMyAqc"
});

module.exports = cloudinary;
