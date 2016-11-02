const express = require("express");
const handlebars = require("express-handlebars");

const app = express();

app.set("port", process.env.PORT || 80);
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars({
  defaultLayout: "main", helpers: {
    section : function (name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}));
app.set("view engine", "handlebars");

//home page
app.get("/", (req, res) => {
  res.render("home");
});
//games page
app.get("/games", (req, res) => {
  res.render("games",{layout:"games"});
});
//account page
app.get("/account", (req, res) => {
  res.render("account");
});
//info page
app.get("/info", (req, res) => {
  res.render("info");
});

// 404 page
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// 500 page
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost: " + app.get("port"));
});
