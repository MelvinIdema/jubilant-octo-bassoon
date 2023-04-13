const express = require("express");
const { getPoem } = require("../app/controllers/PoemController");
const router = express.Router();

router.get("/poem/:poemId", async (req, res) => {
	const poemID = req.params.poemId;

	const poem = await getPoem(poemID);
	if (poem == null) {
		res.render('poem', {
			paragraph: "Poem not found!"
		})
		return
	}

	if (poem.keywords == null) {
		res.render('poem', {
			paragraph: poem.paragraph
		})
	} else {
		res.render('poem', {
			paragraph: poem.paragraph,
			keywords: JSON.stringify(poem.keywords)
		})
	}
})

router.get("/select", async (req, res) => {
  res.render("select");
});

module.exports = router;