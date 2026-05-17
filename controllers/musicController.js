const Music = require("../models/Music");

// ✅ CREATE
const createMusic = async (req, res) => {
  try {
    const { songTitle, verse, chorus, bridge } = req.body;

    const newMusic = await Music.create({
      songTitle,
      verse,
      chorus,
      bridge,
      createdBy: req.user.userId, // ✅ JWT se aata hai
    });

    res.status(201).json({
      success: true,
      message: "Music Created Successfully",
      music: newMusic,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL
const getMusic = async (req, res) => {
  try {
    const music = await Music.find()
      .populate("createdBy", "fullName email") // ✅ creator ka naam + email bhi aayega
      .sort({ createdAt: -1 });

    res.status(200).json(music);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE — sirf owner kar sakta hai
const updateMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const { songTitle, verse, chorus, bridge } = req.body;

    const music = await Music.findById(id);
    if (!music) {
      return res.status(404).json({ success: false, message: "Music not found" });
    }

    // ✅ ownership check
    if (music.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this song" });
    }

    const updated = await Music.findByIdAndUpdate(
      id,
      { songTitle, verse, chorus, bridge },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Music Updated Successfully",
      music: updated,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE — sirf owner kar sakta hai
const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;

    const music = await Music.findById(id);
    if (!music) {
      return res.status(404).json({ success: false, message: "Music not found" });
    }

    // ✅ ownership check
    if (music.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this song" });
    }

    await Music.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Music Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMusic,
  getMusic,
  updateMusic,
  deleteMusic,
};