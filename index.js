// framework for handling http interactions
var app = require("express")();
// used to make requests to the Microsoft API
var request = require("request");
var bodyParser = require("body-parser");

// path to directory of the app (wheras dirname goes to index.js)
var path = __dirname;

// port used for heroku app
var port = process.env.PORT || 3000;

// allow free access to the public files
app.use(require("express").static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// the default directory goes straight to home page
app.get("/", function(req, res) {
  res.sendFile(path + "/public/html/home.html");
});

app.post("/processImages", function(req, res) {
  console.log(req.body);
  var urls = [];

  for(var i = 0; i < req.body.length; i++) {
    urls.push(Object.entries(req.body, [0])[i][1].str);
  }

  var returnString = selectBest(urls);
  res.send(returnString);
});

function selectBest(urlArray) {
  var index = parseInt(Math.random() * urlArray.length);
  return urlArray[index];
}

// start the server
app.listen(port, function() {
  console.log("Listening on " + port);
});
