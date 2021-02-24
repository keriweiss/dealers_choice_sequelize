const {
  syncAndSeed,
  models: { BuildYourOwn, Restaurant, Pizza, Unique_pizza },
} = require("./db/db");
const express = require("express");
const path = require("path");
const router = require("./routes/routes");

const app = express();

app.use("/dist", express.static(path.join(__dirname, "./dist")));
app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/api", router);

app.get("/", async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (err) {
    next(err);
  }
});

const run = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 1337;
    await app.listen(port, () => console.log(`listening in port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

run();
