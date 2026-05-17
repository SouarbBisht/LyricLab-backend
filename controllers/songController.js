const Song = require("../models/Song");

const saveSong = async (req, res) => {

  try {

    const { verse, chorus, bridge } = req.body;

    const newSong = new Song({
      verse,
      chorus,
      bridge,
    });

    await newSong.save();

    res.status(201).json({
      message: "Song saved successfully",
      song: newSong,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getSongs = async (req, res) => {

  try {

    const songs = await Song.find().sort({
      createdAt: -1,
    });

    res.status(200).json(songs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  saveSong,
  getSongs,
};