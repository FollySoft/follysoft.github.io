// Generate Color

//var hexCode = Math.floor(Math.random() * 16777215).toString(16);
const hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
var answerArray = [];
for (let index = 0; index < 6; index++)
{
    answerArray[index] = hexChars[Math.floor(Math.random() * hexChars.length)];
}
hexCode = answerArray.join('');

var correctLetters = 0;
var letterDuplicates = 0;
// Set itch page color?

const textColor = getContrastYIQ(hexCode, "text");
const borderColor = getContrastYIQ(hexCode, "border");

var tipsEnabled = true;

document.addEventListener("DOMContentLoaded", () => {

    // When document is loaded...

    document.body.style.backgroundColor = "#" + hexCode;
    console.log("Aw come on, this is cheating.");    
    console.log("Color: #" + hexCode);

    document.getElementById("title").style.color = textColor;
    document.getElementById("title").style = `border-bottom: 1px solid ${borderColor}; color:${textColor}`;

    buttons = document.getElementsByClassName("text-button");
    for (var i = 0; i < buttons.length; i++) {
        //buttons[i].style.color = getContrastYIQ(borderColor, "text");
        buttons[i].style.color = textColor;
        buttons[i].setAttribute("data-color", borderColor)
    }
    
    // Add listener to toggle tips
    var tipsBtn = document.getElementById("tips-button");
    tipsBtn.onclick = function() {
        if (tipsEnabled) {
            tipsBtn.style.backgroundColor = borderColor;
            tipsBtn.style.color = getContrastYIQ(borderColor, "text");
            tipsBtn.setAttribute("data-title", "Enable Hints");
            tipsEnabled = false;
        }
        else {
            tipsBtn.style = `background-color:transparent`;;
            tipsBtn.style.color = textColor;
            tipsBtn.setAttribute("data-title", "Disable Hints");
            tipsEnabled = true;
        }
    }
    

    // Create Board
    createSquares();

    const guessedWords = [[]];
    let availableSpace = 1;
    let guessedHexCount = 0;

    const keys = document.querySelectorAll('.keyboard-row button')

    function getCurrentWordArray() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArray = getCurrentWordArray();

        if (currentWordArray && currentWordArray.length < 6) {
            currentWordArray.push(letter);

            // Find row of current guess, then get individual letter
            const availableRowElement = document.getElementsByClassName('row')[guessedHexCount];
            const availableSpaceElement = availableRowElement.children[availableSpace];
            availableSpace = availableSpace + 1;

            availableSpaceElement.textContent = letter;
        }
    }

    function handleDeleteLetter() {
        const currentWordArray = getCurrentWordArray();
        const removedLetter = currentWordArray.pop();

        //guessedWords[guessedWords.length - 1] = currentWordArray;

        let row = document.getElementsByClassName('row')[guessedHexCount];
        const lastLetterElement = row.children[availableSpace -1];
        if (lastLetterElement.textContent != '#')
        {
            lastLetterElement.textContent = '';
            availableSpace = availableSpace - 1;
        }
    }

    function handleSubmitWord() {
        
        const currentWordArray = getCurrentWordArray();
        let row = document.getElementsByClassName('row')[guessedHexCount];

        if (currentWordArray.length !== 6) {
            row.classList.add("animate__animated");
            row.classList.add("animate__headShake");
            setTimeout(function() {
                row.classList.add("animate__animated");
                row.classList.remove("animate__headShake");
            }, 1000)
            return;
        }

        const currentWord = currentWordArray.join('');
        row.style = `display:inline-flex;background-color:#${currentWord};transition: background-color 0.3s linear;
        justify-content:center;align-items:center;border-radius: 2px`;
        let letterColor = getContrastYIQ(currentWord, "text");
        
        // '#' sign - Set contrasting color, nothing else
        let poundElement = row.children[0];        
        poundElement.style = `color:${letterColor}`;
        
        let styles = getComparisonStyles();

        if (tipsEnabled)
        {
            // Set interval for reveal flip
            const interval = 200;
            currentWordArray.forEach((letter, index) => {            
                //const styleObj = getTileStyle(letter, index);
                const styleObj = styles[index];
                let letterElement = row.children[index+1];      //Skip Pound
                letterElement.style = `color:${letterColor}`                
                letterElement.classList.add(String(styleObj.animType)); 
                letterElement.style = `${styleObj.tileStyle};color:${letterColor};`;
            });
        }
        else {
            if (currentWord === hexCode)
            {
                // Animate CSS if correct guess.
                currentWordArray.forEach((letter, index) => {            
                    //const styleObj = getTileStyle(letter, index);
                    const styleObj = styles[index];
                    let letterElement = row.children[index+1];      //Skip Pound
                    letterElement.style = `color:${letterColor}`                
                    letterElement.classList.add(String(styleObj.animType)); 
                    letterElement.style = `${styleObj.tileStyle};color:${letterColor};`;
                });
            }
            else
            {
                currentWordArray.forEach((letter, index) => {
                    poundElement.style = `color:${letterColor};transition:opacity 0.3s;opacity:0.2;`;
                    let letterElement = row.children[index+1];
                    letterElement.style = `color:${letterColor};transition:opacity 0.3s;opacity:0.2;
                                            transition:border 0.3s;border:2px solid transparent;`;
                })
            }            
        }

        prevWord = currentWord;
        guessedHexCount += 1;
        
        // Display Modals
        if (currentWord === hexCode) {
            // Win
            showEndButtons();
            var delayInMilliseconds = 300;
            setTimeout(function() {
                setEndModalContent(true, hexCode, textColor);
            }, delayInMilliseconds);
        }

        else if (guessedWords.length === 6) {
            // Lose
            poundElement.style = `color:${letterColor};transition:opacity 0.3s;opacity:0.2;`;
            showEndButtons();
            var delayInMilliseconds = 300;
            setTimeout(function() {
                setEndModalContent(false, hexCode, textColor);                
            }, delayInMilliseconds);
        }
        else
        {
            // Next Guess
            // Reset character placement in row.
            availableSpace = 1;
            guessedWords.push([]);
            poundElement.style = `color:${letterColor};transition:opacity 0.3s;opacity:0.2;`;
        }
    }

    function createSquares() {

        const gameBoard = document.getElementById("board");

        for (let r_index = 0; r_index < 6; r_index++)
        {
            let row = document.createElement("div");
            row.classList.add("row");
            row.setAttribute("id", r_index + 1);
            //row.style = `display:inline-flex;border:2px solid ${borderColor};radius: 2px;`;
            row.style = `display:inline-flex;background-color:transparent`;
            for (let s_index = 0; s_index < 7; s_index++)
            {
                if (s_index == 0)
                {
                    let square = document.createElement("div");
                    square.classList.add("square");                
                    square.setAttribute('id', 'pound');
                    square.textContent = '#';  
                    square.style = `color: ${textColor}`;
                    row.appendChild(square);                      
                }
                else
                {
                    let square = document.createElement("div");
                    square.classList.add("square");
                    square.classList.add("animate__animated");
                    square.setAttribute("id", s_index);
                    square.style = `display:inline-flex;border:2px solid ${borderColor};color: ${textColor}`;
                    row.appendChild(square);            
                }                
            }
            gameBoard.appendChild(row);
        }
    }

    for (let index = 0; index < keys.length; index++) {
        keys[index].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key") //Get letter assigned to key

            if (letter === 'enter')
            {
                handleSubmitWord();
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter();
                return;
            }
            updateGuessedWords(letter);            
        }
        
    }

    function getComparisonStyles() {

        let styles = new Array(6);
        let guess = getCurrentWordArray();
        let remainingChars = hexCode.split("");
      
        // First we determine correctly positioned letters
        for (let i = 0; i < styles.length; i++) {
          const guessedChar = guess[i];
          let resultStyle = null;
      
          if (remainingChars[i] === guessedChar) {
            resultStyle = {
                tileStyle: `border:2px solid ${borderColor};`,
                animType: "animate__bounce"
              };
            remainingChars[i] = null;
          }
      
          styles[i] = resultStyle
        }
      
        // And then we consider letters that exist in the word, handling duplicates.
        for (let i = 0; i < styles.length; i++) {
          if (styles[i] !== null) {
            continue;
          }
      
          const guessedChar = guess[i];
          const index = remainingChars.indexOf(guessedChar);
          if (index !== -1) {
            styles[i] = {
                tileStyle: `opacity:1;transition:border 0.3s;border:2px solid transparent;`,
                animType: "animate__flash"
            }
            remainingChars[index] = null;
          } else {
            styles[i] = {
                tileStyle: `transition:opacity 0.3s;opacity:0.2;transition:border 0.3s;border:2px solid transparent;`,
                animType: "animate__flipX"
            }
          }
        }
        return styles;
    }

    function showEndButtons() {
        // Get Button Elems
        var endButtonContainer = document.getElementById("end-buttons");
        var resultsButton = document.getElementById("results-button");
        resultsButton.classList.add("animate__animated");
        var retryButton = document.getElementById("retry-button");   
        retryButton.classList.add("animate__animated");

        // Fade Out keyboard
        var keyboardContainer = document.getElementById("keyboard-container");
        keyboardContainer.style = `transition:opacity 0.3s;opacity:0`;
            
        var delayInMilliseconds = 600;
        setTimeout(function() {
            // Hide and remove Keyboard Container
            keyboardContainer.style.display = "none";
            keyboardContainer.remove();  
            // Fade in buttons
            endButtonContainer.style = `display:flex;`;
            resultsButton.style = `color:${textColor};`
            resultsButton.classList.add("animate__fadeIn");
            retryButton.style = `color:${textColor};`
            retryButton.classList.add("animate__fadeIn");

            var buttonTextColor = getContrastYIQ(borderColor, "text");
            // Hover Listeners
            resultsButton.addEventListener('mouseenter', e => {
                resultsButton.style = `transition:background-color 0.3s;background-color:${borderColor};transition:color 0.3s; color:${buttonTextColor}`;
              }); 
            resultsButton.addEventListener('mouseleave', e => {
                resultsButton.style = `transition:background-color 0.3s;background-color:transparent;transition:color 0.3s; color:${textColor}`;
            });
            retryButton.addEventListener('mouseenter', e => {
                retryButton.style = `transition:background-color 0.3s;background-color:${borderColor};transition:color 0.3s; color:${buttonTextColor}`;                
              }); 
            retryButton.addEventListener('mouseleave', e => {
                retryButton.style = `transition:background-color 0.3s;background-color:transparent;transition:color 0.3s; color:${textColor}`;                
            });
        }, delayInMilliseconds);
    }
})


function getContrastYIQ(hexcolor, objects){
    // Set text color based on brightness of background.
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    if (objects == "text")
    {
        return ((yiq >= 128) ? "#242124" : "#DCDCDC");    // Raisin Black ---- Gainsboro
    }
    else if (objects == "border")
    {
        return ((yiq >= 128) ? "#3A3A3C" : "#C5C5C3");    // Dark ------- Light
    }
}