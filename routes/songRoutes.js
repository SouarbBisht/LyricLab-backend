const express = require("express");
const Song = require("../models/Song");

const router = express.Router();


// SAVE SONG
router.post("/save", async (req, res) => {

  try {

    const { songTitle, verse, chorus, bridge } = req.body;

    const newSong = await Song.create({
      songTitle,
      verse,
      chorus,
      bridge,
    });

    res.status(201).json(newSong);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


// GET ALL SONGS
router.get("/", async (req, res) => {

  try {

    const songs = await Song.find().sort({
      createdAt: -1,
    });

    res.json(songs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

module.exports = router;