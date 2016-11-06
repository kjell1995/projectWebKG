const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const formidable = require("formidable");

const app = express();

app.set("port", process.env.PORT || 2000);
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

//middleware
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//home page
app.get("/", (req, res) => {
  res.render("home");
});

//processing the post request
app.post("/process1", (req, res) => {
  console.log("Form: " + req.query.form);
  console.log("CSRF: " + req.body._csrf);
  console.log("Username: " + req.body.username);
  console.log("Password: " + req.body.password);
  res.redirect(303, "/");
});

app.post("/process2", (req, res) => {
  res.redirect(303, "/signup");
});

app.post("/process3", (req, res) => {
  console.log("Form: " + req.query.form);
  console.log("CSRF: " + req.body._csrf);
  console.log("Email: " + req.body.Email);
  console.log("Firstname: " + req.body.Firstname);
  console.log("Lastname: " + req.body.Lastname);
  console.log("Username:" + req.body.Username);
  console.log("Password:" + req.body.pasword);
  res.redirect(303, "/games");
})

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
//signup page
app.get("/signup", (req, res) => {
  res.render("signup");
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
