const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const credentials = require("./credentials.js");
const passwordHash = require("password-hash");

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

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

//processing the post request
//process for log in existing user
app.post("/process1", (req, res) => {

  var x = 0;
// check if there is a username in the db
   user.count({Username: req.body.username}, (err, count) => {
    if (err) return handleError(err);
    x = count;

    if(x == 1){ // if there is one user that match, check if password is correct
        user.findOne({Username: req.body.username}, (err, users) => {

          var check = passwordHash.verify( req.body.password, users.Password.toString());

          if(check === true) {
            res.cookie("username", req.body.username.toString(), { signed: true});
            res.cookie("firstname",users.Firstname.toString(), { signed: true});
            res.cookie("lastname", users.Lastname.toString(), { signed: true});
            res.cookie("email", users.Email.toString(), { signed: true});
            res.cookie("guesswin","0", {signed:true});
            res.cookie("guessloss","0", {signed:true});
            res.cookie("guesstot","0", {signed:true});
            res.cookie("dicemax","0", {signed:true});
            res.cookie("dicemin","1000", {signed:true});
            res.cookie("dicetot","0", {signed:true});
            res.redirect(303, "/games");

          }
          else{ //if no matching password, try again
            res.redirect(303, "/signin");
          }
        });
   }
   else{ // no matching user, try again
     res.redirect(303, "/signin");
   }
  });
});

// process for go to sign up page to create new user
app.post("/process2", (req, res) => {
  res.redirect(303, "/signup");
});

var message_signup = "";
// process after filling in the form
app.post("/process3", (req, res) => {

  user.count({Username: req.body.Username}, (err, count) => {
    var x = count;

    if(x == 0){ // if there is no user with such name, create account
      new user({Email: req.body.Email,
                Firstname: req.body.Firstname,
                Lastname: req.body.Lastname,
                Username: req.body.Username,
                Password: passwordHash.generate(req.body.password) }).save();
      res.cookie("username", req.body.Username, { signed: true});
      res.cookie("firstname", req.body.Firstname, { signed: true});
      res.cookie("lastname", req.body.Lastname, { signed: true});
      res.cookie("email", req.body.Email, { signed: true});
      res.cookie("guesswin","0", {signed:true});
      res.cookie("guessloss","0", {signed:true});
      res.cookie("guesstot","0", {signed:true});
      res.cookie("dicemax","0", {signed:true});
      res.cookie("dicemin","1000", {signed:true});
      res.cookie("dicetot","0", {signed:true});
      res.redirect(303, "/games");
    }
    else{ // tell user to choose other username
      message_signup = "Username is already in use!";
      res.redirect(303, "/signup");
    }
  });

});

// process befor entering the page
app.post("/process4", (req, res) => {
  //console.log("Form: " + req.query.form);
  //console.log("CSRF: " + req.body._csrf);
  //console.log("birthday: " + req.body.dayOB+"/" + req.body.monthOB+"/" + req.body.yearOB);

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
  res.clearCookie("firstname");
  res.clearCookie("lastname");
  res.clearCookie("guesswin");
  res.clearCookie("guessloss");
  res.clearCookie("guesstot");
  res.clearCookie("dicemax");
  res.clearCookie("dicemin");
  res.clearCookie("dicetot");
  res.redirect(303,"/home");
});
//changing database information
app.post("/process6", (req, res) => {

  user.count({Username: req.body.Username}, (err, count) => {
    if (err) return handleError(err);
    x = count;

    if(x == 1){ // if there is one user that match, check if password is correct
      //contains error because the database isn't changed at all. ( found http://mongoosejs.com/docs/api.html#model_Model.update )
        user.findOneAndUpdate({Username: req.body.username},{Password: passwordHash.generate(req.body.password)}, {overwrite: true}, (err,raw)=>{
            if (err) return handleError(err);
            console.log('The raw response from Mongo was ', raw);
        });
          res.cookie("username", req.body.Username, { signed: true});
          res.cookie("firstname", req.body.Firstname, { signed: true});
          res.cookie("lastname", req.body.Lastname, { signed: true});
          res.cookie("email", req.body.Email, { signed: true});
          res.cookie("guesswin","0", {signed:true});
          res.cookie("guessloss","0", {signed:true});
          res.cookie("guesstot","0", {signed:true});
          res.cookie("dicemax","0", {signed:true});
          res.cookie("dicemin","1000", {signed:true});
          res.cookie("dicetot","0", {signed:true});
          res.redirect("/account");
        }
  });
});

//refres cookies after dicegame ( not working)
app.post("/process8", (req, res) => {
    if(req.signedCookies.username != ''){
      var text = req.body.text;
          if(text > req.signedCookies.dicemax){
            res.cookie("dicemax",req.body.text, {signed:true});
            res.cookie("dicetot",req.signedCookies.dicetot++, {signed:true});
          }
          if(text < req.signedCookies.dicemin){
            res.cookie("dicemin",req.body.text, {signed:true});
            res.cookie("dicetot",req.signedCookies.dicetot++, {signed:true});
          }
          if(text > req.signedCookies.dicemin&&text < req.signedCookies.dicemax){
            res.cookie("dicetot",req.signedCookies.dicetot++, {signed:true});
          }
          res.redirect("/games");
        }
      else{res.redirect("/games");}
});



//socket functions for chat possibility
var users=0;
io.sockets.on('connection', (socket)=>{
  console.log('a new user connected');
  users++;
  io.emit('NrOfUsrs',users);

  socket.on('nickname', (data)=>{
    socket.nickname = data;
  });
  socket.on('chat message', (message)=> {
    const newMsg = {nick: socket.nickname, msg: message};
    io.emit('chat message',newMsg);
  });
  socket.on('disconnect',()=>{
    console.log(socket.nickname + ' disconnected');
    users--;
    io.emit('disconnection', socket.nickname);
    io.emit('NrOfUsrs',users);
  });
});

//start page
app.get("/", (req, res) => {
  res.render("restrict",{layout:"restrict"});
});

//home page
app.get("/home", (req, res) => {
  res.render("home",{cuser: req.signedCookies.username});
});

//games page
app.get("/games", (req, res) => {
  res.render("games",{layout:"games",cuser: req.signedCookies.username});
});

//account page
app.get("/account", (req, res) => {
  res.render("account",{cuser: req.signedCookies.username, cfirst: req.signedCookies.firstname,clast:req.signedCookies.lastname,cemail:req.signedCookies.email,
    cguessw:req.signedCookies.guesswin,cguessl:req.signedCookies.guessloss,cguesst:req.signedCookies.guesstot ,cdicemax:req.signedCookies.dicemax,cdicemin:req.signedCookies.dicemin,
    cdicet:req.signedCookies.dicetot, layout:"persons"});

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

http.listen(app.get("port"), () => {
  console.log("Server started on http://localhost: " + app.get("port"));
});
