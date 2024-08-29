/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var drag;
var offsetX;
var offsetY;
var coordX;
var coordY;

let video = document.getElementById("gum-local");


// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
    width: 480,
    height: 480,
    // aspectRatio: 1,
  }
};

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  if (error.name === 'OverconstrainedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'NotAllowedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e) {
  try {

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
    //document.getElementById("video-container").style.display = "flex";
    //document.getElementById("video-containter").style.visibility = "hidden";
    document.getElementById("canvas").style.display = "none";
    document.getElementById('#showVideo').disabled = false;

  } catch (e) {
    handleError(e);
  }
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));


function startDrag(e) {
  // determine event object
  if (!e) {
    var e = window.event;
  }

  // IE uses srcElement, others use target
  var targ = e.target ? e.target : e.srcElement;

  if (targ.className != 'draggable') {return};
  // calculate event X, Y coordinates
    offsetX = e.clientX;
    offsetY = e.clientY;

  // assign default values for top and left properties
  if(!targ.style.left) { targ.style.left='0px'};
  if (!targ.style.top) { targ.style.top='0px'};

  // calculate integer values for top and left 
  // properties
  coordX = parseInt(targ.style.left);
  coordY = parseInt(targ.style.top);
  drag = true;
  // move div element
  console.log("moving");
  document.onpointermove=dragDiv;

  return false;
}

function dragDiv(e) {
  if (!drag) {return};
  if (!e) { var e= window.event};
  e.stopPropagation();
  var targ=e.target?e.target:e.srcElement;
  // var bound = document.getElementById("video-container").offsetWidth-document.getElementById("overlay").offsetWidth;    
  // if((coordX>=0)&&(coordX<bound)&&(coordY>=0)&&(coordY<bound)){
  //   // move div element
  //   targ.style.left=coordX+e.clientX-offsetX+'px';
  //   targ.style.top=coordY+e.clientY-offsetY+'px';
  // }
  // else {
  //   document.onmousemove = null;
  //   document.onmouseup();
  //   console.log("MOUSEUP")
  //   //stopDrag();
  // }
  targ.style.left=coordX+e.clientX-offsetX+'px';
  targ.style.top=coordY+e.clientY-offsetY+'px';
  return false;
}
function stopDrag() {
  drag=false;
}
window.onload = function() {
  document.onpointerdown = startDrag;
  document.onpointerup = stopDrag;
}


//Creating dynamic link that automatically click
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
  //after creating link you should delete dynamic link
  //clearDynamicLink(link); 
}

//Your modified code.
function printToFile() {
  html2canvas(document.getElementById("video-container"), {
      onrendered: function (canvas) {
          var myImage = canvas.toDataURL("image/png");
          //create your own dialog with warning before saving file
          //beforeDownloadReadMessage();
          //Then download file
          downloadURI("data:" + myImage, "yourImage.png");
      }
  });
}

//**************** SCREENSHOT CODE */

const width = 480; // We will scale the photo width to this
let height = 480; // This will be computed based on the input stream
// Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    const context = canvas.getContext("2d");
    //height = video.videoHeight / (video.videoWidth / width);
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = false;
    context.drawImage(video, 0, 0, width, height);

    // Set logo
    var img = new Image();
    img.src = "./amfoo-whitelogo.png";
    var logo = document.getElementById('overlay'); 
    
    //context.drawImage(img, width - (width * 0.60), height - (height * 0.80), logo.width, logo.height);
    context.drawImage(img, width - logo.width, height - (height * 0.8), logo.width, logo.height);

    document.getElementById("video-container").style.display = "none";
    //document.getElementById("video-containter").style.visibility = "hidden";
    document.getElementById("canvas").style.display = "block";
    
    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);

    document.getElementById('#showVideo').disabled = false;

  }
