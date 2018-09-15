// framework for handling http interactions
var app = require("express")();
// used to make requests to the Microsoft API
var request = require("request");

// path to directory of the app (wheras dirname goes to index.js)
var path = __dirname;

// port used for heroku app
var port = process.env.PORT || 3000;

// allow free access to the public files
app.use(require("express").static("public"));

// the default directory goes straight to home page
app.get("/", function(req, res) {
  res.sendFile(path + "/public/html/index.html");
});

// start the server
app.listen(port, function() {
  console.log("Listening on " + port);
});
