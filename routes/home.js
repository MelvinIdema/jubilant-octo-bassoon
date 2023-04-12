const express = require("express");
const router = express.Router();
const PoemController = require("../app/controllers/PoemController.js")

router.get("/", async (req, res) => {
  res.render("home");
});

// Export the router
module.exports = router;
