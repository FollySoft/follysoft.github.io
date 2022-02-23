
var helpModal = null;

var endModal = null;
var endModalHeader = null;
var endModalBody = null;
var endModalAnswerDiv = null;
var endModalAnswerText = null;
var endModalGuessText = null;

document.addEventListener("DOMContentLoaded", () => {

    // Get the modal
    helpModal = document.getElementById("helpModal");
    
    // End Modal elements
    endModal = document.getElementById("endModal");
    endModalHeader = document.getElementById("end-modal-header")
    endModalBody = document.getElementById("end-modal-body");
    endModalAnswerDiv = document.getElementById("answer-div");
    endModalAnswerText = document.getElementById("answer-text");
    endModalGuessText = document.getElementById("answer-attempts");


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


function setEndModalContent(condition, hexCode, guessedHexCount, guessedWords, textColor) {

    if (condition == true) {
        endModalHeader.innerHTML = "Well Done!"
        endModalAnswerDiv.style.backgroundColor = "#"+hexCode;
        endModalAnswerDiv.style.color = textColor;
        endModalAnswerText.innerHTML ="#"+hexCode;

        endModalGuessText.innerHTML = guessedHexCount + "/6 Attempts"

        let answerGradientDiv = document.getElementById("answer-gradient");
        let gradientColorLiteral = ``;
        for (var i = 0; i < guessedWords.length; i++) {
            if (i == guessedWords.length - 1) {
                gradientColorLiteral += ("#" + guessedWords[i].toString().replaceAll(',', ''));
            }
            else {
                gradientColorLiteral += ("#" + guessedWords[i].toString().replaceAll(',', '') + ",");
            }            
        };
        console.log(gradientColorLiteral);
        answerGradientDiv.style.display = "flex";
        answerGradientDiv.style.backgroundImage = 'linear-gradient(to right, ' + gradientColorLiteral + ')'
        console.log(answerGradientDiv.style.backgroundImage);
        //answerGradientDiv.style = `display:flex;background-image:linear-gradient(to right, ${gradientColorLiteral})`;
        //drawGradient(guessedWords);

    }
    else {
        endModalHeader.innerHTML = "Try Again?"
        endModalAnswerDiv.style.backgroundColor = "#"+hexCode;
        endModalAnswerDiv.style.color = textColor;
        endModalAnswerText.innerHTML ="#"+hexCode;
    }
    endModal.style.display = "block";
}

function drawGradient(guessedWords) {
    var c = document.getElementById("gradient-canvas");
    var ctx = c.getContext("2d");

    // Create gradient
    var grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(10, 10, 150, 80); 
}