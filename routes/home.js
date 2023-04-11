const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("home");
});

// Export the router
module.exports = router;
