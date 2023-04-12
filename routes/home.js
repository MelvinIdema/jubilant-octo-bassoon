const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("home");
});

router.get('/loading', async (req, res) => {
  res.render("loading")
});

// Export the router
module.exports = router;
