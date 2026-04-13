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
    crossOrigin: "Anonymous"
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
  video.crossOrigin="Anonymous";
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
  alert(error);
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

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
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

  canvas.width = width;
  canvas.height = height;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  // Draw the video to fill the output canvas.
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Measure how the preview is actually rendered on screen.
  const previewRect = preview.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();

  // Convert preview-space pixels into canvas-space pixels.
  const scaleX = canvas.width / previewRect.width;
  const scaleY = canvas.height / previewRect.height;

  // Overlay position relative to the preview container.
  const drawX = (overlayRect.left - previewRect.left) * scaleX;
  const drawY = (overlayRect.top - previewRect.top) * scaleY;
  const drawWidth = overlayRect.width * scaleX;
  const drawHeight = overlayRect.height * scaleY;

  context.drawImage(overlay, drawX, drawY, drawWidth, drawHeight);

  document.getElementById("video-container").style.display = "none";
  document.getElementById("canvas").style.display = "block";

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);

  document.getElementById('#showVideo').disabled = false;
}

