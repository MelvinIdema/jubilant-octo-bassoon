const express = require("express");
const prompt = express.Router();
const fetch = require("node-fetch");
require('dotenv').config();

const bodyParser = require("body-parser");
const { savePoem } = require("../app/controllers/PoemController");
const { create, toDataURL } = require("qrcode");

prompt.use(bodyParser.urlencoded({ extended: false }));
prompt.use(bodyParser.json());

prompt.get('/prompt', (req, res) => {
  res.render('prompt');
});

prompt.post('/prompt', async (req, res) => {
  const type = req.body.type;
  const theme = req.body.theme;
  const url = `https://dichter.responsible-it.nl/api/poetry?type=${type}&theme=${encodeURIComponent(theme)}`;
  const headers = {
    "Authorization": `Bearer ${process.env.API_KEY}`
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error ${response.status}: ${errorText}`);
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    const poemID = await savePoem(data.data.paragraph);
    const poemQR = await toDataURL("https://proompt.nicecock.eu/poem" + poemID);
    res.json({ poem: data.data.paragraph, poemQR: poemQR.toString() });
  } catch (error) {
    console.error("Er is een fout opgetreden:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = prompt;