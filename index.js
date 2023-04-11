const express = require("express");
const http = require("http");
const app = express();
const port = 6969;
const server = http.createServer(app);

app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

const homeRoutes = require("./routes/home");

app.use(homeRoutes);

app.use((req, res) => {
  res.status(404).send("Error 404");
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
