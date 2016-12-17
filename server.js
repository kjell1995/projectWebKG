const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const credentials = require("./credentials.js");

const app = express();

//setup db connection
const user = require("./models/user.js");
const dburl = credentials.connectionString;
const mongoose = require("mongoose");
const opts = {
  server: {
    socketOptions: {keepAlive: 1}
  }
};

mongoose.connect(dburl, opts);

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

app.use(require("cookie-parser")(credentials.cookieSecret));

app.get("/", (req, res) => {
  res.render("restrict",{layout:"restrict"});
});
//home page
app.get("/home", (req, res) => {
  res.render("home",{cuser: req.signedCookies.username});
});

//processing the post request
app.post("/process1", (req, res) => {
  res.cookie("username", req.body.username, { signed: true });
  res.cookie("password", req.body.password, { signed: true });
  console.log("Form: " + req.query.form);
  console.log("CSRF: " + req.body._csrf);
  console.log("Username: " + req.body.username);
  console.log("Password: " + req.body.password);

  res.redirect(303, "/home");
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

app.post("/process4", (req, res) => {
  console.log("Form: " + req.query.form);
  console.log("CSRF: " + req.body._csrf);
  console.log("birthday: " + req.body.dayOB+"/" + req.body.monthOB+"/" + req.body.yearOB);

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(yyyy-req.body.yearOB<18){
    res.redirect(303,"/samson");
  }
  else if(yyyy-req.body.yearOB==18){
    if(mm-req.body.monthOB<0){
      res.redirect(303,"/samson");
    }
    else if(mm-req.body.monthOB==0){
      if(dd-req.body.dayOB<0){
        res.redirect(303,"/samson");
      }
      else {
        res.redirect(303,"/home");
      }
    }
    else{
      res.redirect(303,"/home");
    }
  }
  else{
      res.redirect(303,"/home");
  }
});

//games page
app.get("/games", (req, res) => {
  res.render("games",{layout:"games",cuser: req.signedCookies.username});
});
//account page
app.get("/account", (req, res) => {
  res.render("account",{cuser: req.signedCookies.username});
});
//info page
app.get("/info", (req, res) => {
  res.render("info",{cuser: req.signedCookies.username});
});
//signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});
//samson page
app.get("/samson", (req, res) => {
  res.render("samson",{layout:"restrict"});
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
