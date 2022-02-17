
var helpModal = null;
var endModal = null;
var endModalHeader = null;
var endModalBody = null;

document.addEventListener("DOMContentLoaded", () => {

    // Get the modal
    helpModal = document.getElementById("helpModal");
    endModal = document.getElementById("endModal");
    endModalHeader = document.getElementById("end-modal-header")
    endModalBody = document.getElementById("end-modal-body")

    // Get the button that opens the modal
    var helpBtn = document.getElementById("help-button");

    // Get the <span> element that closes the modal
    var helpSpan = document.getElementsByClassName("help-modal-close")[0];
    var endSpan = document.getElementsByClassName("end-modal-close")[0];

    // When the user clicks on the button, open the help modal
    helpBtn.onclick = function() {
        helpModal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    helpSpan.onclick = function() {
        helpModal.style.display = "none";
    }
    endSpan.onclick = function() {
        endModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == helpModal) {
            helpModal.style.display = "none";
        }
        if (event.target == endModal) {
            helpModal.style.display = "none";
        }
    } 
})

function toggleEndModalDisplay() {
    endModal.style.display = "block";
}


function setEndModalContent(condition, hexCode) {

    if (condition == true) {
        endModalHeader.innerHTML = "Well Done!"
        var correctAnswerDiv = document.createElement("div")
        var correctAnswerText = document.createTextNode(hexCode);
        correctAnswerDiv.style = `padding:12px;border-radius: 2px; color:${hexCode}`
        correctAnswerDiv.appendChild(correctAnswerText);
        endModalBody.appendChild(correctAnswerDiv);
    }
    else {
        endModalHeader.innerHTML = "Try Again?"
        var correctAnswerDiv = document.createElement("div")
        var correctAnswerText = document.createTextNode(hexCode);
        correctAnswerDiv.style = `padding:12px;border-radius: 2px; color:${hexCode}; justify-content: center; align-items: center`
        correctAnswerDiv.appendChild(correctAnswerText);
        endModalBody.appendChild(correctAnswerDiv);

        
    }

    endModal.style.display = "block";
}