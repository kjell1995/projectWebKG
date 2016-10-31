const express = require("express");
const handlebars = require("express-handlebars");

const app = express();

app.set("port", process.env.PORT || 80);
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars({
  defaultLayout: "main"}));
app.set("view engine", "handlebars");

//home page
app.get("/", (req, res) => {
  res.render("home");
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
