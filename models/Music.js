const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({

  songTitle: {
    type: String,
    required: true,
  },

  verse: {
    type: String,
    default: "",
  },

  chorus: {
    type: String,
    default: "",
  },

  bridge: {
    type: String,
    default: "",
  },

  // ✅ track who created this song
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, {
  timestamps: true,
});

const Music = mongoose.model("Music", musicSchema);

module.exports = Music;