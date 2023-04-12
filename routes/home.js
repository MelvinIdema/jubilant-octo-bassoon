const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("home");
});

router.get("/prompt", async (req, res) => {
  res.render("prompt");
});

// Export the router
module.exports = router;
