var videoElement = document.getElementById("myvideo");
console.log(videoElement);
    var totalTimePlayed = 0;
    var lastUpdatedTime = 0;
    videoElement.addEventListener("timeupdate", function(event) {
      var newTime = videoElement.currentTime;
      var timeDiff = newTime - lastUpdatedTime;
      if (timeDiff > 0) {
        totalTimePlayed += timeDiff;
        // feel free to do something else here
        document.getElementById("video_counter").innerText = totalTimePlayed + " seconds played.";
      }
      lastUpdatedTime = newTime;
    });