const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({

  songTitle: {
    type: String,
    required: true,
  },

  verse: {
    type: String,
  },

  chorus: {
    type: String,
  },

  bridge: {
    type: String,
  },

}, {
  timestamps: true,
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;