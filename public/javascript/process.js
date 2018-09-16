function processImages(urls) {
    var sums = []
    for (let x in urls) {
        sums.append(calculateScore(x))
    }    
    return urls[indexOfMax(sums)]
};

function calculateScore(imageUrl) {
    var subscriptionKey = "abe8bd6bf09d46399f42bcb27097d98c";
    var uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "smile,emotion,blur,exposure,noise"
    };

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + imageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.

        console.log(data);
        console.log(data.length);
        let sum = 0
        for (let x of data) {
            sum += getScore(x)
        }
        console.log(sum / data.length)
        return sum / data.length
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ?
            "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ?
            "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}

function getScore(face){
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