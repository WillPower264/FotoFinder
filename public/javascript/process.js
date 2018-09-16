var inputCount = 0;
function addPictureInput() {
  $("#facebookInput").remove();
  var input = document.createElement("input");
  input.id = "input" + inputCount;
  var tag = document.createElement("div");
  $(tag).addClass("col s2");
  $(tag).append("Image " + inputCount + " url:");
  var field = document.createElement("div");
  $(field).addClass("col s10");
  $(field).append(input);
  inputCount++;
  document.getElementById("inputArea").append(tag);
  document.getElementById("inputArea").append(field);
}

function submitPictures() {
  var urls = [];
  for(var i = 0; i < inputCount; i++) {
    var str = document.getElementById("input" + i).value;
    urls.push({str, i});
  }
  // urls should have all of the submitted urls
  $.ajax({
    url: '/processImages',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(urls),
    success: function(data){
      var list = JSON.parse(data);
      var urls = Object.keys(list).sort(function(a,b){return list[b]-list[a]})
      for(var i = 0; i < urls.length; i++) {
        createCard(urls[i], "Face Score: " + JSON.parse(data)[urls[i]]);
      }

    }
  });

}

// create a card with image, title, and description
function createCard(image, title) {

  // area for the general card
  var area = document.createElement("div");
  $(area).addClass("col s12 m6 l3");

  // the card itself
  var card = document.createElement("div");
  $(card).addClass("card");

  // add an image to the card
  $(card).append();

  var imageDiv = document.createElement("div");
  $(imageDiv).addClass("card-image");
  $(imageDiv).append("<img class='responsive-img' src='" + image +"'>");
  $(imageDiv).append("<span class='card-title col s12'>" + title + "</span>");
  $(card).append(imageDiv);

  // the contents that are displayed normally
  // var content = document.createElement("div");
  // $(content).addClass("card-content");
  // $(content).append("<div class='row'>");
  //   $(content).append();
  // $(content).append("</div>");
  // $(card).append(content);


  $(area).append(card);
  $("#bestImage").append(area);
}
