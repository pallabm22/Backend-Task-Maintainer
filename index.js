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
  const filename = req.body.title.split(" ").join(" ") + ".txt";
  fs.writeFile(`./files/${filename}`, req.body.details, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error in saving the task");
    }
    res.redirect("/");
  });
});

app.get("/files/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("show",{filename:req.params.filename,filedata:filedata});
  })
}); 

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send("File not found");
    res.render("edit", {
      filename: req.params.filename,
      filedata: filedata,
    });
  });
});
app.post("/edit", (req, res) => {
  const oldPath = `./files/${req.body.previous}`;
  const newFileName = req.body.New.endsWith(".txt")
    ? req.body.New
    : req.body.New + ".txt";
  const newPath = `./files/${newFileName}`;
  const newDetails = req.body.details;

  fs.rename(oldPath, newPath, (err) => {
    console.log(err);
    return res.status(500).send("Error renaming file");
  });
  fs.writeFile(newPath, newDetails, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error in changing the task details");
    }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log("App is running successfully");
  console.log("App is running without any problem");
});
