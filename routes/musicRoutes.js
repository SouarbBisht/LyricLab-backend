const express = require("express");
const router = express.Router();
const { createMusic, getMusic, updateMusic, deleteMusic } = require("../controllers/musicController");
const protect = require("../middlewares/auth");

router.post("/save", protect, createMusic);
router.get("/all", protect, getMusic);
router.put("/update/:id", protect, updateMusic);      // PUT /api/music/update/:id
router.delete("/delete/:id", protect, deleteMusic);   // DELETE /api/music/delete/:id

module.exports = router;