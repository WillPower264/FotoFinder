// framework for handling http interactions
var app = require("express")();
// used to make requests to the Microsoft API
var request = require("request");
var bodyParser = require("body-parser");
var $ = require("jquery");
var param = require("jquery-param");

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
  var urls = [];

  for(var i = 0; i < req.body.length; i++) {
    urls.push(Object.entries(req.body, [0])[i][1].str);
  }

  var returnString = processImages(urls);
  res.send(returnString);
});

function processImages(urls) {
  var pairs = {};

  for (var x = 0; x < urls.length; x++) {
      var score = calculateScore(urls[x]);
      pairs[urls[x]] = score;
  }

  console.log(pairs);
  return "urls[indexOfMax(sums)]";
};

function calculateScore(imageUrl) {
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
       'Content-Type': 'application/json' },
    body: { url: imageUrl},
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    return getImageScore(body);
  });
}

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

function indexOfMax(arr) {
    if (arr.length === 0)
        return -1;

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

// start the server
app.listen(port, function() {
  console.log("Listening on " + port);
});
