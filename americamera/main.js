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

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: true
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
    // const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const stream = navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment'
      }
    });
    handleSuccess(stream);
    e.target.disabled = true;
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