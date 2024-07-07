var directionHor = true;
var activeRow = 0;
var activeCol = 0;
var won = false;
var finalTime = 0;

let acrossClues = {
  0: "Clue A", // qqqqq
  1: "Clue B", // qqqqq
  2: "Clue C", // qqqqq
  3: "Clue D", // qqqqq
  4: "Clue E", // qqqqq
};
let downClues = {
  0: "Clue F", // .....
  1: "Clue G", // .....
  2: "Clue H", // .....
  3: "Clue I", // .....
  4: "Clue J", // .....
};

// Prepare SVG for Share Button
const SVG_SHARE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>';

const SVG_BACKSPACE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>'

let answer = Array.from("qqqqqqqqqqqqqqqqqqqqqqqqq");

function onloadRender() {
  createGrid();
  setupKeyboard();
  createShareButton();
  addEventListener("keyup", handleKeyboardPress);

  var startingBox = document.getElementById("box00");
  refocusTo(startingBox);
  highlightRow();
}

var initialTime = Date.now();
var timerInterval = window.setInterval(checkTime, 1000);
function checkTime() {
  var timeDifference = Date.now() - initialTime;
  var formatted = convertTime(timeDifference);
  document.getElementById('timer').innerHTML = '' + formatted;
}

function convertTime(miliseconds) {
  var totalSeconds = Math.floor(miliseconds / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds - minutes * 60;
  return (minutes < 10 ? "0" : "") + minutes + ':' + (seconds < 10 ? "0" : "") + seconds;
}

function createGrid() {
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      let row = document.getElementById("row" + i);
      var box = document.createElement("div");
      box.setAttribute("id", "box" + i + j);
      box.addEventListener("click", handleActivate);
      box.classList.add("box");
      box.classList.add("letter");

      if (i == 0) {
        box.classList.add("topEdge");
      } else if (i == 4) {
        box.classList.add("bottomEdge");
      }

      if (j == 0) {
        box.classList.add("leftEdge");
      } else if (j == 4) {
        box.classList.add("rightEdge");
      }

      document.getElementById(row.id).append(box);
    }
  }
}

function setupKeyboard() {
  let keyboardDiv = document.querySelector('.keyboard')
  for (let child of keyboardDiv.children) {
    child.remove()
  }

  let layout = ['qwertyuiop', '-asdfghjkl-', 'zxcvbnm!']
  for (let row of layout) {
    let keyboardRow = document.createElement('div')
    keyboardRow.classList.add('keyboard-row')
    for (let letter of Array.from(row)) {
      let extraClass
      if (letter === '!') {
        letter = 'Backspace'
        extraClass = 'larger'
      } else if (letter === '-') {
        letter = ''
        extraClass = 'spacer'
      }
      let keyboardBtn = document.createElement('button')
      keyboardBtn.classList.add('keyboard-button', 'key-' + letter.toLowerCase())
      if (extraClass) {
        keyboardBtn.classList.add(extraClass)
      }
      keyboardBtn.innerHTML = letter === 'Backspace' ? SVG_BACKSPACE : letter
      keyboardBtn.onclick = (e) => {
        onKeyPress(letter)
        e.stopPropagation()
        e.preventDefault()
      }
      if (letter === 'Backspace') {
        addOnLongTouchCallback(keyboardBtn, () => {
          clearLettersFilled()
        })
      }
      keyboardRow.append(keyboardBtn)
    }
    keyboardDiv.append(keyboardRow)
  }
}

function addOnLongTouchCallback(el, callback, delay = 650) {
  let timer = null
  el.addEventListener('touchstart', e => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      callback()
    }, delay)
  })
  el.addEventListener('touchend', e => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  })
}

function handleActivate(e) {
  let box = e.target;
  activate(box);
}

function activate(box) {
  refocusTo(box);
  if (box.id == ("box" + activeRow + activeCol)) {
    directionHor = !directionHor;
  } else {
    activeRow = box.id.charAt(3);
    activeCol = box.id.charAt(4);
  }
  highlightRow();
}

function getFocusedBox() {
  let boxesToUnfocus = document.getElementsByClassName("focused");
  // Clear wrongly focused boxes in case of multiple clicks
  for (var i = 1; i < boxesToUnfocus.length; i++) {
    boxesToUnfocus[i].classList.remove("focused");
  }
  return boxesToUnfocus[0];
}

function refocusTo(focusBox) {
  let boxToUnfocus = getFocusedBox();
  if (boxToUnfocus != null) {
    boxToUnfocus.classList.remove("focused");
  }
  if (focusBox != null) {
    focusBox.classList.add("focused");
  }
}

function highlightRow() {
  updateClue();

  var highlights = document.getElementsByClassName("highlight");
  while (highlights.length) {
    highlights[0].classList.remove("highlight");
  }

  if (directionHor) {
    for (var i = 0; i < 5; i++) {
      document.getElementById("box" + activeRow + i).classList.add("highlight");
    }
  } else {
    for (var i = 0; i < 5; i++) {
      document.getElementById("box" + i + activeCol).classList.add("highlight");
    }
  }
}

function updateClue() {
  if (directionHor) {
    document.getElementById("clueText").innerText = acrossClues[activeRow];
    if (activeRow == 0) {
      document.getElementById("clueNumber").innerText = "1a:";
    } else {
      document.getElementById("clueNumber").innerText = (parseInt(activeRow) + 5) + ":";
    }
  } else {
    document.getElementById("clueText").innerText = downClues[activeCol];
    if (activeCol == 0) {
      document.getElementById("clueNumber").innerText = "1d:";
    } else {
      document.getElementById("clueNumber").innerText = (parseInt(activeCol) + 1) + ":";
    }
  }
}

function handleKeyboardPress(event) {
  const charCode = event.keyCode;

  // Early return for invalid input
  if ((charCode <= 64 && charCode != 8) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode != 127)) {
    return;
  }

  onKeyPress(event.key);
}

function onKeyPress(key) {
  let newBox = "";
  var box = getFocusedBox();
  let [boxRow, boxCol] = [parseInt(box.id.charAt(3)), parseInt(box.id.charAt(4))];

  // Handle deletions
  if (key === "Backspace" || key === "Delete") {
    box.innerHTML = "";

    if (boxRow == 0 && boxCol == 0) {
      activate(document.getElementById("box44"));
      return;
    }

    if (directionHor) { // direction = horizontal
      if (boxCol == 0) {
        newBox = "box" + (boxRow - 1) + "4";
      } else {
        newBox = "box" + boxRow + (boxCol - 1);
      }
    } else { // direction = vertical
      if (boxRow == 0) {
        newBox = "box" + "4" + (boxCol - 1);
      } else {
        newBox = "box" + (boxRow - 1) + boxCol;
      }
    }

    if (newBox != "") {
      activate(document.getElementById(newBox));
    }
    return;
  }

  // Set value of box to pressed key
  box.innerHTML = key;

  // Check if puzzle is solved
  if (checkPuzzle()) {
    return;
  }

  // Reset to initial box and change direction
  if (boxRow == 4 && boxCol == 4) {
    directionHor = !directionHor;
    activate(document.getElementById("box00"));
    return;
  }

  if (directionHor) { // direction = horizontal
    if (boxCol == 4) {
      newBox = "box" + (boxRow + 1) + "0";
    } else {
      newBox = "box" + boxRow + (boxCol + 1);
    }
  } else { // direction = vertical
    if (boxRow == 4) {
      newBox = "box" + "0" + (boxCol + 1);
    } else {
      newBox = "box" + (boxRow + 1) + boxCol;
    }
  }

  if (newBox != "") {
    activate(document.getElementById(newBox));
  }
}

function checkPuzzle() {
  const puzzle = [];
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      let boxValue = document.getElementById("box" + i + j).innerHTML;
      if (boxValue == "") {
        return false
      }
      puzzle.push(boxValue);
    }
  }

  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] != answer[i]) {
      return false;
    }
  }
  winner();
  return true;
}

function winner() {
  finalTime = Date.now() - initialTime;
  window.clearInterval(timerInterval);
  removeEventListener("keyup", handleKeyboardPress);

  showNotification("Congratulations!\nYou solved it.");
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var box = document.getElementById("box" + i + j);
      box.blur();
      box.classList.remove("highlight");
      box.removeEventListener("click", handleActivate);
    }
  }
  refocusTo(null);

  document.body.classList.add('gameOver');
}

// Show notification
function showNotification(text) {
  let notificationElement = document.getElementById("notification");
  notificationElement.innerHTML = text;
  document.getElementById("notification").style.opacity = "1";
  setTimeout(() => {
    document.getElementById("notification").style.opacity = "0";
  }, 1200);
}

function createShareButton() {
  const shareButton = document.createElement('button')
  shareButton.classList.add('shareButton')
  shareButton.innerHTML = 'Share ' + SVG_SHARE
  shareButton.onclick = () => {
    showNotification('Copied results to clipboard!')
    writeToClipboard(getShareContent())
  }

  const shareContainer = document.querySelector('.shareContainer')
  shareContainer.prepend(shareButton)
}

function getShareContent() {
  return `I solved the Potok Party Crossword in ${convertTime(finalTime)}.`;
}

async function writeToClipboard(content) {
  const textarea = document.createElement('div')
  textarea.setAttribute('readonly', true);
  textarea.setAttribute('contenteditable', true);

  textarea.innerHTML = content
  Object.assign(textarea.style, {
    opacity: 0,
    pointerEvents: 'none',
    position: 'fixed',
    transform: 'translateX(-100%)',
    whiteSpace: 'pre'
  })
  document.body.append(textarea);

  const range = document.createRange();
  range.selectNodeContents(textarea);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  result = document.execCommand('copy');
  setTimeout(() => textarea.remove(), 100);
}
