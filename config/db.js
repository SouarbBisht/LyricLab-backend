const mongoose = require("mongoose");

const connectDB = async () => {

  mongoose.connect(
    "mongodb://127.0.0.1:27017/lyricsLab"
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

};

module.exports = connectDB;