// (c) Patrick Potok

// Initialize date
// getDate();

// Initialize game variable
let board = [];
let guesses = [];
let categories = [];
let wordList = [];
let order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let complete = [0, 0, 0, 0];
let selected = [];
let lives = 4;
let rows = 0;
var words = document.getElementsByClassName("word");

let colours = ["rgb(249, 223, 109)", "rgb(160, 195, 90)", "rgb(176, 196, 239)", "rgb(186, 129, 197)"];
let selectedColor = "rgb(90, 89, 78)";
let selectedColorTransparent = "rgb(90, 89, 78, 0.75)";

// Initialize Event Listeners
for (let i = 0; i < words.length; i++) {
  words[i].addEventListener("mousedown", function () {
    select(words[i]);
  });
  words[i].addEventListener("mouseup", function () {
    onMouseUp(words[i]);
  });
  words[i].addEventListener("mouseleave", function () {
    onMouseUp(words[i]);
  });
  words[i].style.zIndex = "1";
}
document.getElementById("shuffle").addEventListener("mousedown", function () {
  toolMouseDown(document.getElementById("shuffle"));
  shuffle();
});
document.getElementById("deselect").addEventListener("mousedown", function () {
  toolMouseDown(document.getElementById("deselect"));
  deselectAll();
});
document.getElementById("submit").addEventListener("mousedown", function () {
  toolMouseDown(document.getElementById("submit"));
  submit();
});
document.getElementById("shuffle").addEventListener("mouseup", function () {
  toolMouseUp(document.getElementById("shuffle"));
});
document.getElementById("deselect").addEventListener("mouseup", function () {
  toolMouseUp(document.getElementById("deselect"));
});
document.getElementById("submit").addEventListener("mouseup", function () {
  toolMouseUp(document.getElementById("submit"));
});
document.getElementById("shuffle").addEventListener("mouseleave", function () {
  toolMouseUp(document.getElementById("shuffle"));
});
document.getElementById("deselect").addEventListener("mouseleave", function () {
  toolMouseUp(document.getElementById("deselect"));
});
document.getElementById("submit").addEventListener("mouseleave", function () {
  toolMouseUp(document.getElementById("submit"));
});

// Prepare SVG for Share Button
const SVG_SHARE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>'


// Prepare game
let games = getGames();
let numGames = games.length;
let gameIndex = Math.floor(numGames * Math.random());
categories = games[gameIndex].categories.map((x) => x.toUpperCase());
wordList = games[gameIndex].wordList.map((x) => x.toUpperCase());
reset();
setWords();
shuffle();
createShareButton();

// Set initial tiles
function setWords() {
  for (let i = 0; i < 16; i++) {
    let currentWord = document.getElementById("tile" + order[i]);
    currentWord.innerHTML = wordList[i];
    addRemoveLongWord(currentWord);
  }
}

function addRemoveLongWord(currentWord) {
  let wordParts = currentWord.innerHTML.split(' ')
  if (wordParts.some(e => e.length > 9)) {
    currentWord.classList.add('longerWord');
    currentWord.classList.remove('longWord');
  } else if (wordParts.some(e => e.length > 8) || wordParts.length > 2) {
    currentWord.classList.add('longWord');
    currentWord.classList.remove('longerWord');
  } else {
    currentWord.classList.remove('longWord');
    currentWord.classList.remove('longerWord');
  }
}

// Reset Tiles to Default
function reset() {
  for (let i = 0; i < words.length; i++) {
    words[i].style.backgroundColor = "rgb(239, 239, 230)";
    words[i].style.color = "#000000";
  }
}

// Reset Tile Size
function onMouseUp(wButton) {
  wButton.style.transition = "";
  wButton.style.transform = "";
}

function toolMouseDown(wButton) {
  if (wButton.innerHTML == "Submit" && selected.length == 4) {
    wButton.style.opacity = 0.8;
    return;
  }

  if (wButton.innerHTML == "Deselect All" && selected.length == 0) {
    return
  }

  wButton.style.backgroundColor = "#E2E2E2";
}

function toolMouseUp(wButton) {
  if (wButton.innerHTML == "Submit" && selected.length == 4) {
    wButton.style.opacity = 1;
    return;
  }
  wButton.style.backgroundColor = "#ffffff";
}

function buttonOn(wButton) {
  wButton.style.borderColor = "#000000";
  wButton.style.color = "#000000";
  if (wButton.innerHTML == "Submit") {
    wButton.style.backgroundColor = "#000000";
    wButton.style.color = "#FFFFFF";
  }
}

function buttonOff(wButton) {
  wButton.style.borderColor = "#7F7F7F";
  wButton.style.color = "#7F7F7F";
  wButton.style.backgroundColor = "#FFFFFF";
}

// Select Tile
function select(wButton) {
  // wButton.style.transition = "all .3s ease-in-out";
  // wButton.style.transform = "scale(0.9)";

  if (
    wButton.style.backgroundColor == "rgb(239, 239, 230)" &&
    selected.length < 4
  ) {
    if (selected.length == 3) {
      buttonOn(document.getElementById("submit"));
    }
    wButton.style.backgroundColor = selectedColor;
    wButton.style.color = "#ffffff";
    selected.push(wButton);
  } else {
    wButton.style.backgroundColor = "rgb(239, 239, 230)";
    wButton.style.color = "#000000";
    let a = selected.indexOf(wButton);
    if (a > -1) {
      selected.splice(a, 1);
      buttonOff(document.getElementById("submit"));
    }
  }

  if (selected.length == 0) {
    buttonOff(document.getElementById("deselect"));
  } else {
    buttonOn(document.getElementById("deselect"));
  }
}

// Deselect All Tiles
function deselectAll() {
  buttonOff(document.getElementById("deselect"));
  if (selected.length == 4) {
    buttonOff(document.getElementById("submit"));
  }
  for (let i = selected.length - 1; i >= 0; i--) {
    selected[i].style.backgroundColor = "rgb(239, 239, 230)";
    selected[i].style.color = "#000000";
    selected.splice(i, 1);
  }
}

// Shuffle
function shuffle() {
  let selectedWords = [];
  for (let i in selected) {
    let word = selected[i].innerHTML;
    selectedWords.push(word);
  }

  for (let i = 15; i >= 4 * rows; i--) {
    let swap = Math.floor(Math.random() * (i + 1 - 4 * rows)) + 4 * rows;
    if (swap >= 4 * rows) {
      temp = order[swap];
      order[swap] = order[i];
      order[i] = temp;
    }
  }

  for (let i = 4 * rows; i < 16; i++) {
    let swap = Math.floor(Math.random() * (16 - i)) + 4 * rows;
    if (swap >= 4 * rows) {
      temp = order[swap];
      order[swap] = order[i];
      order[i] = temp;
    }
  }

  setWords();

  // Rearrange selected tiles
  reset();
  selected = [];
  for (let i in selectedWords) {
    selected.push(
      document.getElementById("tile" + order[wordList.indexOf(selectedWords[i])])
    );
    document.getElementById(
      "tile" + order[wordList.indexOf(selectedWords[i])]
    ).style.backgroundColor = selectedColor;
    document.getElementById(
      "tile" + order[wordList.indexOf(selectedWords[i])]
    ).style.color = "#ffffff";
  }
}

// Submit when 4 tiles selected
function submit() {
  if (selected.length != 4) {
    return;
  }

  selected.sort((a, b) =>
    wordList.indexOf(a.innerHTML) > wordList.indexOf(b.innerHTML) ? 1 : -1
  );

  let entry = [];
  for (let i in selected) {
    entry.push(wordList.indexOf(selected[i].innerHTML));
  }

  const alreadyGuessed = (data, arr) => {
    return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
  }

  if (alreadyGuessed(board, entry)) {
    showNotification("Already guessed!");
    return;
  }

  board.push(entry);
  for (let i in selected) {
    let move = [
      { transform: "translateY(0px)" },
      { transform: "translateY(-6px)" },
      { transform: "translateY(0px)" },
    ];
    selected[i].animate(move, { duration: 300, delay: 150 * i });
  }

  let rowIndexes = [
    Math.floor(wordList.indexOf(selected[0].innerHTML) / 4),
    Math.floor(wordList.indexOf(selected[1].innerHTML) / 4),
    Math.floor(wordList.indexOf(selected[2].innerHTML) / 4),
    Math.floor(wordList.indexOf(selected[3].innerHTML) / 4),
  ]
  guesses.push(rowIndexes);

  if (rowIndexes.every(e => e === rowIndexes[0])) {
    setTimeout(() => {
      correct();
    }, 750);
  } else {
    let uniqueRows = new Set(rowIndexes);
    if (
      uniqueRows.size === 2 &&
      (
        rowIndexes.filter(row => row === [...uniqueRows][0]).length === 1 ||
        rowIndexes.filter(row => row === [...uniqueRows][1]).length === 1
      )
    ) {
      showNotification("One away...");
    }
    wrong();
  }
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
  const decoder = new TextDecoder('utf-8')
  const squareGlyphs = [
    decoder.decode(new Uint8Array([240, 159, 159, 168])), // Yellow
    decoder.decode(new Uint8Array([240, 159, 159, 169])), // Green
    decoder.decode(new Uint8Array([240, 159, 159, 166])), // Blue
    decoder.decode(new Uint8Array([240, 159, 159, 170])), // Purple
  ]
  const colorMatrix = guesses.map(row => {
    return row.map(index => squareGlyphs[index] || '')
      .join('')
  })
    .filter(row => row)

  let score = "Flawless"
  if (lives == 3) {
    score = "Great"
  } else if (lives == 2) {
    score = "Good"
  } else if (lives == 1) {
    score = "Okay"
  }

  const text = [
    `Wordle - K&P's Version: ${score}`,
    ...colorMatrix,
  ].join('\n')
  return text
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

function onEndGame() {
  let victory = hasWon()
  let message = victory ? 'You got it!' : 'Yikes, better luck next time!';
  showNotification(message)
  document.body.classList.add('gameOver')
}

function hasWon() {
  return true;
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

// Move tiles to new locations and generate answer block
function correct() {
  let row = Math.floor(wordList.indexOf(selected[0].innerHTML) / 4);
  complete[row] = 1;
  let swap = [];
  for (let i = 0; i < 4; i++) {
    if (
      Math.floor(order[wordList.indexOf(selected[i].innerHTML)] / 4) != rows
    ) {
      swap.push(order[wordList.indexOf(selected[i].innerHTML)]);
    }
  }
  let top = [];
  for (let i = rows * 4; i < rows * 4 + 4; i++) {
    if (Math.floor(order.indexOf(i) / 4) != row) {
      top.push(i);
    }
  }
  for (let i in swap) {
    let pos1 = document.getElementById("tile" + swap[i]).getBoundingClientRect();
    let pos2 = document.getElementById("tile" + top[i]).getBoundingClientRect();
    let tx = pos1.x - pos2.x;
    let ty = pos1.y - pos2.y;
    let movement1 =
      "translateX(" + tx * -1 + "px) translateY(" + ty * -1 + "px)";
    let movement2 = "translateX(" + tx + "px) translateY(" + ty + "px)";
    let move1 = [{ transform: "translateX(0px)" }, { transform: movement1 }];
    let move2 = [{ transform: "translateX(0px)" }, { transform: movement2 }];
    document.getElementById("tile" + swap[i]).animate(move1, { duration: 1010 });
    document.getElementById("tile" + top[i]).animate(move2, { duration: 1010 });
  }

  setTimeout(() => {
    showAnswers(swap, top, row);

    if (complete.every(e => e == 1)) {
      onEndGame();
    }
  }, 1000);
}

// Display answers
function showAnswers(swap, top, row) {
  for (let i in swap) {
    let temp = document.getElementById("tile" + swap[i]).innerHTML;
    document.getElementById("tile" + swap[i]).innerHTML = document.getElementById(
      "tile" + top[i]
    ).innerHTML;
    document.getElementById("tile" + top[i]).innerHTML = temp;
    let i1 = order.indexOf(swap[i]);
    let i2 = order.indexOf(top[i]);

    let temp1 = order[i1];
    order[i1] = order[i2];
    order[i2] = temp1;

    addRemoveLongWord(document.getElementById("tile" + swap[i]));
    addRemoveLongWord(document.getElementById("tile" + top[i]));
  }

  deselectAll();
  rows++;

  // Prepare new answer UI component
  let tile = document.getElementById("row" + rows);
  let answer = document.createElement("div");
  answer.classList.add("answerRow");
  answer.style.width = document.getElementById("row1").clientWidth - 8 + "px";
  answer.style.height = document.getElementById("tile0").clientHeight + "px";
  answer.style.backgroundColor = colours[row];

  // Set text for primary content (cateogry name)
  let head = document.createElement("p");
  let category = document.createTextNode(categories[row]);
  head.appendChild(category);
  head.classList.add("answerTitle");
  answer.appendChild(head);

  // Set text for secondary content (answer words)
  text = "";
  for (let i = 0; i < 3; i++) {
    text += wordList[row * 4 + i] + ", ";
  }
  text += wordList[row * 4 + 3];
  let answers = document.createElement("p");
  let answerText = document.createTextNode(text);
  answers.appendChild(answerText);
  answers.classList.add("answerSubtitle");
  answer.appendChild(answers);
  tile.appendChild(answer);

  // Animate effect on component
  let move = [
    { transform: "scale(1)" },
    { transform: "scale(1.1)" },
    { transform: "scale(1)" },
  ];
  answer.animate(move, { duration: 300, delay: 0 });
}

// Autocomplete Game when all lives lost
function autocomplete() {
  deselectAll();
  let skip = 0;
  for (let i = 0; i < 4; i++) {
    if (complete[i] == 0) {
      setTimeout(() => {
        autocompleteRow(i);
      }, 2400 * (i - skip));
    } else {
      skip++;
    }
  }
}

// Finish a given row
function autocompleteRow(i) {
  for (let j = i * 4; j < i * 4 + 4; j++) {
    selected.push(document.getElementById("tile" + order[j]));
  }
  submit();
}

// Remove life on wrong answer
function wrong() {
  for (let i in selected) {
    let move = [
      { transform: "translateX(0px)", backgroundColor: selectedColorTransparent },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0px)", backgroundColor: selectedColorTransparent },
    ];
    selected[i].animate(move, { duration: 250, delay: 1200 });
    selected[i].animate(
      [{ backgroundColor: selectedColorTransparent }, { backgroundColor: selectedColorTransparent }],
      { duration: 500, delay: 1450 }
    );
  }
  let moveLife = [
    { transform: "scale(1)" },
    { transform: "scale(1.5)" },
    { transform: "scale(0.75)" },
    { transform: "scale(0)" },
  ];
  document
    .getElementById("life" + lives)
    .animate(moveLife, { duration: 600, delay: 2100 });
  setTimeout(() => {
    document.getElementById("life" + lives).style.backgroundColor = "#ffffff";
    lives--;
    if (lives == 0) {
      autocomplete();
    }
  }, 2600);
}

function getDate() {
  const date = new Date();
  let df = "";
  switch (date.getMonth()) {
    case 0:
      df += "January";
      break;
    case 1:
      df += "February";
      break;
    case 2:
      df += "March";
      break;
    case 3:
      df += "April";
      break;
    case 4:
      df += "May";
      break;
    case 5:
      df += "June";
      break;
    case 6:
      df += "July";
      break;
    case 7:
      df += "August";
      break;
    case 8:
      df += "September";
      break;
    case 9:
      df += "October";
      break;
    case 10:
      df += "November";
      break;
    case 11:
      df += "December";
      break;
  }
  df += " " + date.getDate() + ", " + date.getFullYear();
  document.getElementById("date").innerHTML = df;
}

function getGames() {
  return [
    {
      categories: [
        "Our go-to homemade dinners",
        "Our favorite trips",
        "Our favorite restaurants",
        "Our dogs (+ Bailey)",
      ],
      wordList: [
        "chickpeas",
        "poke",
        "cacio e pepe",
        "sea bass",

        "charleston",
        "phoenix",
        "belfast",
        "maui",

        "misi",
        "abcV",
        "taco bell",
        "the four horseman",

        "denver",
        "dublin",
        "roger",
        "brodie",
      ],
    }
  ];
}
