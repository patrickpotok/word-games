var directionHor = true;
var activeRow = 0;
var activeCol = 5;
var won = false;
var finalTime = 0;

let acrossClues = [
  {
    "number": "1a",
    "text": "How we met",
    "answer": "HINGE",
    "startPosition": "box05",
  },
  {
    "number": "2",
    "text": "Our favorite store",
    "answer": "COSTCO",
    "startPosition": "box10",
  },
  {
    "number": "4",
    "text": "Brand of car we drive",
    "answer": "AUDI",
    "startPosition": "box40",
  },
  {
    "number": "6a",
    "text": "Our favorite type of candy",
    "answer": "SOUR",
    "startPosition": "box46",
  },
  {
    "number": "7",
    "text": "What we slurp",
    "answer": "OYSTER",
    "startPosition": "box64",
  },
  {
    "number": "9",
    "text": "What we are doing for our honeymoon",
    "answer": "SAFARI",
    "startPosition": "box81",
  }
];

let downClues = [
  {
    "number": "2",
    "text": "Our favorite boardgame",
    "answer": "CATAN",
    "startPosition": "box10",
  },
  {
    "number": "5",
    "text": "Our favorite airline",
    "answer": "DELTA",
    "startPosition": "box42",
  },
  {
    "number": "1d",
    "text": "Our favorite brand of sneakers",
    "answer": "HOKA",
    "startPosition": "box05",
  },
  {
    "number": "6d",
    "text": "Our favorite restaurant food type",
    "answer": "SUSHI",
    "startPosition": "box46",
  },
  {
    "number": "3",
    "text": "Month we started dating",
    "answer": "JUNE",
    "startPosition": "box38",
  },
  {
    "number": "8",
    "text": "What we will give each other on Sunday",
    "answer": "RING",
    "startPosition": "box69",
  },
];

let currentClueIndex = 0;
let acrossClueMapping = {};
let downClueMapping = {};
let gameboard = [];

// let gameboard = [
//   [ "-", "-", "-", "-", "-", "H", "I", "N", "G", "E"],
//   [ "C", "O", "S", "T", "C", "O", "-", "-", "-", "-"],
//   [ "A", "-", "-", "-", "-", "K", "-", "-", "-", "-"],
//   [ "T", "-", "-", "-", "-", "A", "-", "-", "J", "-"],
//   [ "A", "U", "D", "I", "-", "-", "S", "O", "U", "R"],
//   [ "N", "-", "E", "-", "-", "-", "U", "-", "N", "-"],
//   [ "-", "-", "L", "-", "O", "Y", "S", "T", "E", "R"],
//   [ "-", "-", "T", "-", "-", "-", "H", "-", "-", "I"],
//   [ "-", "S", "A", "F", "A", "R", "I", "-", "-", "N"],
//   [ "-", "-", "-", "-", "-", "-", "-", "-", "-", "G"],
// ];

let maxRow = 10;
let maxCol = 10;

// Prepare SVG for Share Button
const SVG_SHARE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>';

const SVG_BACKSPACE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>'

function onloadRender() {
  buildGameboard();
  createGrid();
  setupClueMapping();
  setupKeyboard();
  createShareButton();
  addEventListener("keyup", handleKeyboardPress);

  var startingBox = document.getElementById("box05");
  refocusTo(startingBox);
  updateClue();
  highlightWord();
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

function buildGameboard() {
  for (var i = 0; i < maxRow; i++) {
    gameboard[i] = [];
    for (var j = 0; j < maxCol; j++) {
      gameboard[i][j] = "-";
    }
  }

  for (var i = 0; i < acrossClues.length; i++) {
    let acrossClueAnswer = acrossClues[i].answer;
    let acrossClueStartPosition = acrossClues[i].startPosition;
    let [clueRow, clueCol] = [parseInt(acrossClueStartPosition.charAt(3)), parseInt(acrossClueStartPosition.charAt(4))];
    for (var j = 0; j < acrossClueAnswer.length; j++) {
      gameboard[clueRow][clueCol + j] = acrossClueAnswer.charAt(j);
    }
  }

  for (var i = 0; i < downClues.length; i++) {
    let downClueAnswer = downClues[i].answer;
    let downClueStartPosition = downClues[i].startPosition;
    let [clueRow, clueCol] = [parseInt(downClueStartPosition.charAt(3)), parseInt(downClueStartPosition.charAt(4))];
    for (var j = 0; j < downClueAnswer.length; j++) {
      gameboard[clueRow + j][clueCol] = downClueAnswer.charAt(j);
    }
  }
}

function createGrid() {
  let grid = document.getElementById("grid");
  for (var i = 0; i < gameboard.length; i++) {
    // Create a row div
    let row = document.createElement("div");
    row.setAttribute("id", "row" + i);
    row.classList.add("row");
    grid.append(row);

    for (var j = 0; j < gameboard[i].length; j++) {
      var box = document.createElement("div");
      box.setAttribute("id", "box" + i + j);

      box.classList.add("box");
      box.classList.add("letter");

      if (gameboard[i][j] != "-") {
        box.addEventListener("click", handleActivate);
      } else {
        box.classList.add("disabled");
      }

      if (i == 0) {
        box.classList.add("topEdge");
      } else if (i == gameboard.length - 1) {
        box.classList.add("bottomEdge");
      }

      if (j == 0) {
        box.classList.add("leftEdge");
      } else if (j == gameboard[i].length - 1) {
        box.classList.add("rightEdge");
      }

      document.getElementById(row.id).append(box);
    }
  }
}

function setupClueMapping() {
  let runCount = 0;
  let clueCount = 0;
  for (var i = 0; i < gameboard.length; i++) {
    for (var j = 0; j < gameboard[i].length; j++) {
      if (gameboard[i][j] == "-") {
        if (runCount <= 1) {
          runCount = 0;
          continue;
        }

        for (var z = 0; z < runCount; z++) {
          acrossClueMapping["box" + i + (j - z - 1)] = clueCount;
        }
        clueCount++;
        runCount = 0;
        continue;
      }
      runCount++;
    }

    if (runCount > 1) {
      for (var z = 0; z < runCount; z++) {
        acrossClueMapping["box" + i + (gameboard[i].length - z - 1)] = clueCount;
      }
      clueCount++;
    }
    runCount = 0;
  }

  runCount = 0;
  clueCount = 0;
  for (var j = 0; j < gameboard.length; j++) {
    for (var i = 0; i < gameboard.length; i++) {
      if (gameboard[i][j] == "-") {
        if (runCount <= 1) {
          runCount = 0;
          continue;
        }

        for (var z = 0; z < runCount; z++) {
          downClueMapping["box" + (i - z - 1) + j] = clueCount;
        }
        clueCount++;
        runCount = 0;
        continue;
      }
      runCount++;
    }

    if (runCount > 1) {
      for (var z = 0; z < runCount; z++) {
        downClueMapping["box" + (i - z - 1) + (gameboard.length - 1)] = clueCount;
      }
      clueCount++;
    }
    runCount = 0;
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
  }

  activeRow = box.id.charAt(3);
  activeCol = box.id.charAt(4);

  // Change direction back if clue not valid
  let isValidClue = updateClue();
  if (!isValidClue) {
    directionHor = !directionHor;
    updateClue();
  }

  highlightWord();
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

function highlightWord() {
  var highlights = document.getElementsByClassName("highlight");
  while (highlights.length) {
    highlights[0].classList.remove("highlight");
  }

  if (directionHor) {
    // Highlight all boxes left of active box
    for (var i = activeCol; i >= 0; i--) {
      let boxToHighlight = document.getElementById("box" + activeRow + i);
      if (boxToHighlight.classList.contains("disabled")) {
        break;
      }
      boxToHighlight.classList.add("highlight");
    }

    // Highlight all boxes right of active box
    for (var i = activeCol; i < maxCol; i++) {
      let boxToHighlight = document.getElementById("box" + activeRow + i);
      if (boxToHighlight.classList.contains("disabled")) {
        break;
      }
      boxToHighlight.classList.add("highlight");
    }
  } else {
    // Highlight all boxes above active box
    for (var i = activeRow; i >= 0; i--) {
      let boxToHighlight = document.getElementById("box" + i + activeCol);
      if (boxToHighlight.classList.contains("disabled")) {
        break;
      }
      boxToHighlight.classList.add("highlight");
    }

    // Highlight all boxes below active box
    for (var i = activeRow; i < maxRow; i++) {
      let boxToHighlight = document.getElementById("box" + i + activeCol);
      if (boxToHighlight.classList.contains("disabled")) {
        break;
      }
      boxToHighlight.classList.add("highlight");
    }
  }
}

function updateClue() {
  let clue = null;
  let clueIndex = null;
  if (directionHor) {
    clueIndex = acrossClueMapping["box" + activeRow + activeCol] ?? null;
    if (clueIndex == null) {
      return false;
    }
    clue = acrossClues[clueIndex] ?? null;
  } else {
    clueIndex = downClueMapping["box" + activeRow + activeCol] ?? null;
    if (clueIndex == null) {
      return false;
    }
    clue = downClues[clueIndex] ?? null;
  }

  if (clue == null) {
    return false;
  }
  document.getElementById("clueNumber").innerText = clue.number + ":";
  document.getElementById("clueText").innerText = clue.text;
  currentClueIndex = clueIndex;
  return true;
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

  let currentClue = directionHor ? acrossClues[currentClueIndex] : downClues[currentClueIndex];
  currentClueStartPosition = currentClue.startPosition
  let [currentClueRow, currentClueCol] = [parseInt(currentClueStartPosition.charAt(3)), parseInt(currentClueStartPosition.charAt(4))];


  // Handle deletions
  if (key === "Backspace" || key === "Delete") {
    box.innerHTML = "";

    if (boxRow == currentClueRow && boxCol == currentClueCol) {
      if (currentClueIndex == 0) {
        directionHor = !directionHor;
      }

      let nextClueIndex = currentClueIndex > 0
        ? currentClueIndex - 1
        : (directionHor ? acrossClues.length - 1 : downClues.length - 1);

      let nextClue = directionHor ? acrossClues[nextClueIndex] : downClues[nextClueIndex];
      let nextClueEndRow = directionHor ? nextClue.startPosition.charAt(3) : (parseInt(nextClue.startPosition.charAt(3)) + nextClue.answer.length - 1);
      let nextClueEndCol = directionHor ? (parseInt(nextClue.startPosition.charAt(4)) + nextClue.answer.length - 1) : nextClue.startPosition.charAt(4);
      activate(document.getElementById("box" + nextClueEndRow + nextClueEndCol));
      return;
    }

    if (directionHor) { // direction = horizontal
      newBox = "box" + boxRow + (boxCol - 1);
    } else { // direction = vertical
      newBox = "box" + (boxRow - 1) + boxCol;
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

  let currentClueAnswerLength = currentClue.answer.length;
  let isAtWordEnd = directionHor
    ? boxRow == currentClueRow && boxCol == (currentClueCol + currentClueAnswerLength - 1)
    : boxRow == (currentClueRow + currentClueAnswerLength - 1) && boxCol == currentClueCol;

  // Reset to initial box and change direction
  if (isAtWordEnd) {
    let endClueIndex = (directionHor ? acrossClues.length - 1 : downClues.length - 1);
    if (currentClueIndex == endClueIndex) {
      directionHor = !directionHor;
    }

    let nextClueIndex = currentClueIndex < endClueIndex
      ? currentClueIndex + 1
      : 0;

    let nextClue = directionHor ? acrossClues[nextClueIndex] : downClues[nextClueIndex];
    activate(document.getElementById(nextClue.startPosition));
    return;
  }

  if (directionHor) { // direction = horizontal
    newBox = "box" + boxRow + (boxCol + 1);
  } else { // direction = vertical
    newBox = "box" + (boxRow + 1) + boxCol;
  }

  if (newBox != "") {
    activate(document.getElementById(newBox));
  }
}

function checkPuzzle() {
  for (var i = 0; i < gameboard.length; i++) {
    for (var j = 0; j < gameboard[i].length; j++) {
      let correctLetter = gameboard[i][j];
      if (correctLetter == "-") {
        continue;
      }

      let boxValue = document.getElementById("box" + i + j).innerHTML;
      if (correctLetter != boxValue.toUpperCase()) {
        return false;
      }
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
  for (var i = 0; i < gameboard.length; i++) {
    for (var j = 0; j < gameboard[i].length; j++) {
      if (gameboard[i][j] == "-") {
        continue;
      }
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
