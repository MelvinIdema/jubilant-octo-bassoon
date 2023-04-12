const express = require("express");
const router = express.Router();

router.get("/poem", async (req, res) => {
  res.render("poem");
});

router.get("/select", async (req, res) => {
  res.render("select");
});

// Export the router
module.exports = router;
