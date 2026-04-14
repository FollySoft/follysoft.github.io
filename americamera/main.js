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
    facingMode: { ideal: "environment" },
    width: { ideal: 1920 },
    height: { ideal: 1920 }
  }
};

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
  video.crossOrigin="Anonymous";
}

function handleError(error) {
  if (error.name === 'OverconstrainedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'NotAllowedError') {
    errorMsg('Permissions have not been granted to use your camera.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  alert(msg);
}

async function init(e) {
  try {

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
    //document.getElementById("video-container").style.display = "flex";
    //document.getElementById("video-containter").style.visibility = "hidden";
    //document.getElementById("canvas").style.display = "none";
    document.getElementById('button-container').style.display = "none";
    document.getElementById('active-buttons').style.display = "grid";

  } catch (e) {
    handleError(e);
  }
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));


function downloadImage() {
  var link = document.createElement('a');
  link.download = 'filename.png';
  link.href = document.getElementById('canvas').toDataURL()
  link.click();
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

    document.getElementById("video-container").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("retakePhoto").style.display = "none";
    document.getElementById("takePhoto").style.display = "block";
    document.getElementById("savePhoto").disabled = true;
    document.getElementById("savePhoto").style.backgroundColor = "#8a8a8a";

    // const data = canvas.toDataURL("image/png");
    // photo.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

function takepicture() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const video = document.getElementById("gum-local");
  const overlay = document.getElementById("overlay");
  const preview = document.getElementById("video-container");

  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;


  // Crop the camera frame to a square using the largest centered square.
  const cropSize = Math.min(sourceWidth, sourceHeight);
  const cropX = (sourceWidth - cropSize) / 2;
  const cropY = (sourceHeight - cropSize) / 2;

  // Keep the final image square, but at the camera's real resolution.
  canvas.width = cropSize;
  canvas.height = cropSize;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  // Draw a high-resolution square crop from the video feed.
  context.drawImage(
    video,
    cropX,
    cropY,
    cropSize,
    cropSize,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const previewRect = preview.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();

  const previewWidth = preview.clientWidth;
  const previewHeight = preview.clientHeight;
  const borderLeft = preview.clientLeft;
  const borderTop = preview.clientTop;

  const scaleX = canvas.width / previewWidth;
  const scaleY = canvas.height / previewHeight;

  const drawX = (overlayRect.left - previewRect.left - borderLeft) * scaleX;
  const drawY = (overlayRect.top - previewRect.top - borderTop) * scaleY;
  const drawWidth = overlayRect.width * scaleX;
  const drawHeight = overlayRect.height * scaleY;


  // Draw the logo at the same relative size/position as the preview.
  context.drawImage(overlay, drawX, drawY, drawWidth, drawHeight);

  document.getElementById("video-container").style.display = "none";
  document.getElementById("canvas").style.display = "block";

  // const data = canvas.toDataURL("image/png");
  // photo.setAttribute("src", data);

  document.getElementById("takePhoto").style.display = "none";
  document.getElementById("retakePhoto").style.display = "block";
  document.getElementById("savePhoto").disabled = false;
  document.getElementById("savePhoto").style.backgroundColor = "#4dd838";

}

