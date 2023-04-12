const express = require("express");
const router = express.Router();

router.get("/poem", async (req, res) => {
  res.render("poem");
});

// Export the router
module.exports = router;
