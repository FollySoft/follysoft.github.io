
// Microphone Variables
var valuesForAverage = [];
var gatherForAverage = false;
var microphoneAverage = 0;
var micSensitivityFactor = 1;
// Appropriate volume level, set per video
var micThresholdUpper = 0;
var micThresholdLower = 0;

// Game Management
misses = 0; // Increment when too loud or too early
missTimeoutActive = false;
overallMisses = 0;
var clipScore = 0;

// Video Manager
let currentVideo = 0;
let videoRunTime = 0;
clipTransitioning = false;
let signDisplayed = false;
windowStart = 0.0;

const videoObjects = [
  {
    // Golf
    "link": "https://ia801500.us.archive.org/0/items/whhisc-GOLF_CENTER_Tournament_Coverage_at_the_2018_GolfWeek_Amateur_Tour/GOLF_CENTER_Tournament_Coverage_at_the_2018_GolfWeek_Amateur_Tour.HD.mov#t=90",
    "startTime": 100,
    "endTime": 110,
    "micThresholdUpper": 100,
    "micThresholdLower": 50,
    "volume": 0.1
  },
  {
    // Football
    "link": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Oregon_vs._Washington_St_-_FOX_COLLEGE_FOOTBALL_HIGHLIGHTS.webm#t=180",
    "startTime": 187,
    "endTime": 200,
    "micThresholdUpper": 999,
    "micThresholdLower": 100,
    "volume": 1
  },
  {
    // Birthday
    "link": "https://upload.wikimedia.org/wikipedia/commons/c/c2/18th_Birthday_Party.webm",
    "startTime": 8,
    "endTime": 200,
    "micThresholdUpper": 150,
    "micThresholdLower": 100,
    "volume": 0.1
  }
]

let vid = document.getElementById("myvideo");
// Fist video
vid.src = videoObjects[currentVideo].link;
vid.volume = videoObjects[currentVideo].volume;
// vid.addEventListener('loadeddata', function() {
//   console.log("Video ready!");
//   fadeOutStatic();
// }, false);


function getAmbientAverage() {
    // Listen for a few seconds and get the average ambent volume.
    var total = 0;
    for(var i = 0; i < valuesForAverage.length; i++) {
        total += valuesForAverage[i];
    }
    var microphoneAverage = total / valuesForAverage.length;
    console.log(valuesForAverage)
    console.log("New Average: " + microphoneAverage);
}

function updateMicSensitivity(sensitivityValue) {
  micSensitivityFactor = sensitivityValue;
  console.log("New Sensitivity: " + micSensitivityFactor);
}


function nextVideo() {
    fadeInStatic();
    clipTransitioning = false;
    currentVideo++;
    vid.src = videoObjects[currentVideo].link;
    vid.volume = videoObjects[currentVideo].volume;
    misses = 0;
    missTimeoutActive = false;
}

function playVid() {
    vid.play();
}

function pauseVid() {
    vid.pause();
} 

function fadeInStatic() {
  staticGif = document.getElementById("static-gif");
  staticGif.classList.remove("fade-out");
  staticGif.classList.add("fade-in");
}

function fadeOutStatic() {
  console.log("Video ready!");
  staticGif = document.getElementById("static-gif");
  staticGif.classList.remove("fade-in");
  staticGif.classList.add("fade-out");
}

// Get Video Runtime
vid.ontimeupdate = function(){
    videoRunTime = vid.currentTime;
    console.log(videoRunTime);
    // if (videoRunTime >= 100.8 && signDisplayed == false) {
    //   //$( "#sign-gif" ).addClass( "animate__shakeY animate__infinite" )
    //   signDisplayed = true;
    //   console.log("DISPLAYING SIGN?");
    //   //$( "#text-label" ).addClass( "animate__shakeY animate__infinite" )
    //   //showGif('sign-gif')
    //   //showSign('sign-gif')
    //   getAmbientAverage();
    //   gatherForAverage = false;
    // }
    
    // Check time against clip length and trigger end?
    if (videoRunTime >= videoObjects[currentVideo].endTime) {
      if (clipScore < 50 && ! clipTransitioning) {
        clipTransitioning = true;
        fadeInStatic();
        vid.volume = 0;
        setTimeout(() => {
          showWeakAndProceed();
        }, 2000)
      }
    }
};    
  
// Overlay Images
function showGif(gifId) {
  const gif = document.getElementById(gifId);
  gif.classList.add('show-gif');
  
  // Remove the class after animation ends to reset position for next use
  setTimeout(() => {
      gif.classList.remove('show-gif');
  }, 5000); // Match with animation duration
}

function showLoudText() {
  missTimeoutActive = true;
  misses += 1;
  if (misses >= 3) {
    fadeInStatic();
    showErrorAndProceed();
    return;  
  }
  $( "#text-label" ).html( "PIPE DOWN!" );
  $( "#text-label" ).addClass( "animate__shakeY animate__infinite" )
  setTimeout(() => {
    $( "#text-label" ).removeClass( "animate__shakeY animate__infinite" )       
    $( "#text-label" ).html( "" );
    missTimeoutActive = false;
  }, 2000)
}

function showEarlyText() {
  missTimeoutActive = true;
  misses += 1;
  if (misses >= 3) {
    fadeInStatic();
    showErrorAndProceed();
    return;  
  }
  $( "#early-label" ).html( "not yet..." );
  $( "#early-label" ).addClass( "animate__flash animate__infinite" )
  setTimeout(() => {
    $( "#early-label" ).removeClass( "animate__flash animate__infinite" )       
    $( "#early-label" ).html( "" );
    missTimeoutActive = false;
  }, 2000)
}


function showErrorAndProceed(misses) {
  overallMisses += 1;
  setTimeout(() => {
    if (overallMisses == 1) {
      $( "#miss-label" ).addClass( "animate__bounce" )
      $( "#miss-label" ).html( "X" );      
    }    
    if (overallMisses == 2) {
      $( "#miss-label" ).addClass( "animate__bounce" )
      $( "#miss-label" ).html( "X    X" );      
    }
    if (overallMisses == 3) {
      $( "#miss-label" ).addClass( "animate__bounce" )
      $( "#miss-label" ).html( "X    X    X" );      
    }
    setTimeout(() => {
      $( "#miss-label" ).html( "" );
      $( "#miss-label" ).removeClass( "animate__bounce" )   
      nextVideo();
      //fadeOutStatic();
    }, 3000)
  }, 2000)
}

function showSuccessAndProceed() {
  setTimeout(() => {
    showGif('clap-gif');
    nextVideo();
    //fadeOutStatic();
  }, 6000)
}

function showWeakAndProceed() {
  $( "#weak-label" ).addClass( "animate__pulse animate__infinite" )
  $( "#weak-label" ).html( "weak..." );     
  setTimeout(() => {
    $( "#weak-label" ).html( "" );
    $( "#weak-label" ).removeClass( "animate__pulse animate__infinite" )   
    showErrorAndProceed();
  }, 2000)
}

// Sign Indicator
function showSign(gifId) {
  const gif = document.getElementById(gifId);
  gif.classList.add('show-sign');
  
  // Remove the class after animation ends to reset position for next use
  setTimeout(() => {
      gif.classList.remove('show-sign');
  }, 5000); // Match with animation duration
}

// Courtesy www.0AV.com, LGPL license or as set by forked host, Travis Holliday, https://codepen.io/travisholliday/pen/gyaJk (modified by fixing for browser security change)
function startr(){
  console.log ("starting...");
  //gatherForAverage = true;
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true
      },
      function(stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        canvasContext = $("#canvas")[0].getContext("2d");

        javascriptNode.onaudioprocess = function() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
              // Multiply array[i] with sensitivity modifier? 0.1 - 1.9?
              values += ((array[i]) * micSensitivityFactor);
              //values += (array[i]);
            }

            var average = values / length;

            if (gatherForAverage == true) {
              valuesForAverage.push(average);
            }
  //          console.log(Math.round(average - 40));
            else {
              //console.log("AVERAGE DIFF: " + average);
              //let microphoneDifference = average - microphoneAverage;
              canvasContext.clearRect(0, 0, 80, 140);
              canvasContext.fillStyle = '#857253';  // Standard Fill
              canvasContext.fillRect(0, 180 - average, 80, 140);
              canvasContext.fillStyle = '#F62626';
              canvasContext.font = "12px impact";
              // Only use for debug!
              canvasContext.fillText(Math.round(average - 40), 8, 20);
              // Too early
              if ((Math.round(average - 40) > videoObjects[currentVideo].micThresholdLower) && (videoRunTime < videoObjects[currentVideo].startTime)) {
                if (!missTimeoutActive) {
                  showEarlyText();
                }                                
              }
              // Too Loud
              if ((Math.round(average - 40) > videoObjects[currentVideo].micThresholdUpper) && (videoRunTime > videoObjects[currentVideo].startTime)) {
                canvasContext.fillStyle = '#FA003F' // Loud Fill
                canvasContext.fillRect(0, 180 - average, 80, 140);
                if (!missTimeoutActive) {
                  showLoudText();
                }                
              }
              // Just Right
              if ((Math.round(average - 40) < videoObjects[currentVideo].micThresholdUpper) && (Math.round(average - 40) > videoObjects[currentVideo].micThresholdLower) && (videoRunTime > videoObjects[currentVideo].startTime)) {
                canvasContext.fillStyle = '#95C623' // Loud Fill
                canvasContext.fillRect(0, 180 - average, 80, 140);
                if (!missTimeoutActive) {
                  clipScore++;
                  if (clipScore >= 50) {
                    showSuccessAndProceed();
                  }
                }                
              }
              // console.log (average);
              }
          } // end fn stream
      },
      function(err) {
        console.log("The following error occured: " + err.name)
      });
      playVid();
      //showGif('clap-gif');
  } else {
    console.log("getUserMedia not supported");
  }
}
 
 