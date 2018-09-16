// framework for handling http interactions
var app = require("express")();
// used to make requests to the Microsoft API
var request = require("request");
var bodyParser = require("body-parser");
var $ = require("jquery");
var param = require("jquery-param");
var util = require("util");

// path to directory of the app (wheras dirname goes to index.js)
var path = __dirname;

// port used for heroku app
var port = process.env.PORT || 3000;

// allow free access to the public files
app.use(require("express").static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(require('serve-favicon')(__dirname + '/public/images/favicon.ico'));

// the default directory goes straight to home page
app.get("/", function(req, res) {
  res.sendFile(path + "/public/html/home.html");
});

app.post("/processImages", function(req, res) {
  var urls = [];

  for(var i = 0; i < req.body.length; i++) {
    urls.push(Object.entries(req.body, [0])[i][1].str);
  }
  // urls contains an array of urls
  // pairs will contain key value pairs of urls and their score
  var pairs = {};
  var total = urls.length;

  for (var x = 0; x < urls.length; x++) {
      // we will make an ajax request for each of the scoredImages
      var options = { method: 'POST',
      url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect',
      qs:
       { returnFaceId: 'true',
         returnFaceLandmarks: 'false',
         returnFaceAttributes: 'smile,emotion,blur,exposure,noise' },
      headers:
       { 'Postman-Token': 'f3220796-ee82-4ae7-bfbb-70745c0cf1f6',
         'Cache-Control': 'no-cache',
         'Ocp-Apim-Subscription-Key': 'abe8bd6bf09d46399f42bcb27097d98c',
         'Content-Type': 'application/json',
         'GIVEHACK' : "******" + urls[x] + "******"},
      body: { url: urls[x]},
      json: true };

      // this will be what we have to wait for each time
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var identifier = JSON.stringify(util.inspect(response.client._httpMessage.res.req)).split("******")[1];
        // populate the pairs with the key value pairs
        pairs[identifier] = getImageScore(body);
        // check if the pairs is the max length. If so, res.send it
        if(Object.keys(pairs).length == total) {
          res.send(JSON.stringify(pairs));
        }
      });
  }
});

function getImageScore(data) {
    // Show formatted JSON on webpage.
    let sum = 0
    for (var x = 0; x < data.length; x++) {
        sum += getFaceScore(data[x])
    }
    console.log("Average face score: " + sum / data.length)
    return sum / data.length
}

function getFaceScore(face){
    var attr = face.faceAttributes;
    var sum = 0
    sum += attr.smile
    sum += attr.emotion.happiness
    sum -= attr.blur.value
    sum -= attr.noise.value
    console.log("Face score: " + sum)
    return sum
}

// start the server
app.listen(port, function() {
  console.log("Listening on " + port);
});
