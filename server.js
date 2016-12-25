const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const credentials = require("./credentials.js");
const passwordHash = require("password-hash");

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

  var x = 0;

   user.count({Username: req.body.username}, (err, count) => {
    if (err) return handleError(err);
    x = count;

    if(x == 1){
        user.findOne({Username: req.body.username}, (err, users) => {

          var check = passwordHash.verify( req.body.password, users.Password.toString());

          if(check === true) {
            res.cookie("username", req.body.username, { signed: true});
            res.redirect(303, "/games");

          }
          else{
            res.redirect(303, "/signin");
          }
        });
   }
   else{
     res.redirect(303, "/signin");
   }
  });
});

app.post("/process2", (req, res) => {
  res.redirect(303, "/signup");
});

var message_signup = "";

app.post("/process3", (req, res) => {

  user.count({Username: req.body.Username}, (err, count) => {
    var x = count;

    if(x == 0){
      new user({Email: req.body.Email,
                Firstname: req.body.Firstname,
                Lastname: req.body.Lastname,
                Username: req.body.Username,
                Password: passwordHash.generate(req.body.password) }).save();

      res.cookie("username", req.body.Username, { signed: true});
      res.redirect(303, "/games");
    }
    else{
      message_signup = "Username is already in use!";
      res.redirect(303, "/signup");
    }
  });

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

app.post("/process5", (req, res) => {
  res.clearCookie("username");
  res.redirect(303,"/home");
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
  res.render("signup",{message: message_signup});
  message_signup = "";
});
//signin page
app.get("/signin", (req, res) => {
  res.render("signin",{cuser: req.signedCookies.username});
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
