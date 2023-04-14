require("dotenv").config();
const express = require("express");
const prompt = express.Router();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const { savePoem } = require("../app/controllers/PoemController");
const { create, toDataURL } = require("qrcode");

async function doFetch(url, headers) {
  console.log("Calling API");

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP error ${response.status}: ${errorText}`);
    throw new Error(`HTTP error ${response.status}`);
  }
  const data = await response.json();
  const fullData = await fetchSecondApiEndpoint(data.data.paragraph);
  return { data, fullData };
}

const fetchWithFallback = async (url, headers) => {
  try {
    const result = await doFetch(url, headers);
    return result;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

const firstSuccessfulFetch = async (promises) => {
  console.log("Calling firstSuccessfulFetch");

  if (promises.length === 0) {
    throw new Error("All promises failed");
  }

  const indexedPromises = promises.map((promise, index) => promise.then(result => ({ result, index })));
  const { result, index } = await Promise.race(indexedPromises);
  if (result !== null) {
    console.log("Promise" + index + " succeeded");
    return result;
  } else {
    console.log("Promise" + index + " failed");
    // Get the failed promise and remove it from the list of promises
    const remainingPromises = [...promises.slice(0, index), ...promises.slice(index + 1)];

    // const failedIndex = promises.findIndex(promise => promise === Promise.resolve(result));
    // const remainingPromises = [...promises.slice(0, failedIndex), ...promises.slice(failedIndex + 1)];
    return firstSuccessfulFetch(remainingPromises);
  }
};

async function doRewriteFetch(url, headers, body) {
  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP error ${response.status}: ${errorText}`);
    throw new Error(`HTTP error ${response.status}`);
  }
  const data = await response.json();
  const fullData = await fetchSecondApiEndpoint(data.data.paragraph);
  return { data, fullData };
}

prompt.use(bodyParser.urlencoded({ extended: false }));
prompt.use(bodyParser.json());

prompt.get("/prompt", (req, res) => {
  res.render("prompt");
});

prompt.post("/prompt", async (req, res) => {
  const type = req.body.type;
  const theme = req.body.theme;
  const url = `https://dichter.responsible-it.nl/api/poetry?type=${type}&theme=${encodeURIComponent(theme)}`;
  const headers = {
    Authorization: `Bearer ${process.env.API_KEY}`,
  };

  try {
    // const promise1 = doFetch(url, headers);
    // const promise1 = new Promise((resolve, reject) => {
    //   throw new Error("test");
    // });

    var promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(fetchWithFallback(url, headers));
    }

    const { data, fullData } = await firstSuccessfulFetch(promises);

    // const { data, fullData } = await Promise.race([promise1, promise2]).then((value) => {
    //   console.log(value);
    //   return value;
    // });

    const poemID = await savePoem(data.data.paragraph, fullData.keywords);
    const poemQR = await toDataURL("https://proompt.nicecock.eu/poem/" + poemID);

    res.json({ poem: data.data.paragraph, poemQR: poemQR.toString(), poemID: poemID, keywords: fullData.keywords });
  } catch (error) {
    console.error("Er is een fout opgetreden:", error);
    res.status(500).json({ error: error.message });
  }
});

prompt.post("/rewrite", async (req, res) => {
  console.log(req.body);
  const oldKeyword = req.body.oldKeyword;
  const newKeyword = req.body.newKeyword;
  const paragraph = req.body.paragraph;

  const url = `https://dichter.responsible-it.nl/api/rewrite?old=${oldKeyword}&new=${newKeyword}`;
  const headers = {
    Authorization: `Bearer ${process.env.API_KEY}`,
  };
  const body = {
    data: {
      paragraph: paragraph,
    },
  };

  try {
    const promise1 = doRewriteFetch(url, headers, body);
    const promise2 = doRewriteFetch(url, headers, body);

    const { data, fullData } = await Promise.race([promise1, promise2]).then((value) => {
      console.log(value);
      return value;
    });
    const poemID = await savePoem(data.data.paragraph, fullData.keywords);
    const poemQR = await toDataURL("https://proompt.nicecock.eu/poem/" + poemID);

    res.json({ poem: data.data.paragraph, poemQR: poemQR.toString(), poemID: poemID, keywords: fullData.keywords });
  } catch (error) {
    console.error("Er is een fout opgetreden:", error);
    res.status(500).json({ error: error.message });
  }
});

async function fetchSecondApiEndpoint(paragraph) {
  const url = `https://dichter.responsible-it.nl/api/keywords`;
  const headers = {
    Authorization: `Bearer ${process.env.API_KEY}`,
  };
  const body = {
    data: {
      paragraph: paragraph,
    },
  };

  try {
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error ${response.status}: ${errorText}`);
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (e) {
    console.error("Er is een fout opgetreden:", error);
    throw e;
  }
}

module.exports = prompt;
