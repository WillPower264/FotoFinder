var inputCount = 0;
  function addPictureInput() {
    var input = document.createElement("input");
    input.id = "input" + inputCount;
    inputCount++;
    document.getElementById("inputArea").append(input);
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
          var title = document.createElement("h1");
          title.innerHTML = "Face Score: " + JSON.parse(data)[urls[i]];
          document.getElementById("bestImage").append(title);
          var img = document.createElement("img");
          img.src = urls[i];
          document.getElementById("bestImage").append(img);
        }

      }
    });

  }
