const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  const filename = req.body.title.split(" ").join("_") + ".txt";
  fs.writeFile(`./files/${filename}`, req.body.details, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error in saving the task");
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("App is running");
});
