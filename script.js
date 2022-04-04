// added a start and reset button to the game
// players can click on start before clicking the card
// or just click directly on the card to start the game and timer
// BUT
// I'm facing an issue where after the game times out and the player loses
// the timer will start again when the card is clicked
// but the card will not be clickable, and will not reset.

// reset button has to reset timer AND game.
// need to have a variable to indicate whether the game is over?
// if playing, then card should be clickable and start the timer.
// if over, timer should not start again?

// game variables
const boardSize = 4; // board has to be even numbered to have pairs
const board = []; // empty array for storing values on the board
let deck; // variable to store game deck to draw cards from

let timeOut = false;
let startTime;

const timeLimit = 10000;
let timerRunning = false;
let interval;

let firstCard = null; // variable to store first card
let firstCardElement; // variable to store first card element

// DOM elements
const timerDisplay = document.createElement('div');
timerDisplay.className = 'timer-div';

const buttonDisplay = document.createElement('div');
buttonDisplay.className = 'btn-div';

// buttons for timer
const startButton = document.createElement('button');
startButton.className = 'btn';
startButton.innerText = 'start';
const resetButton = document.createElement('button');
resetButton.className = 'btn';
resetButton.innerText = 'reset';

buttonDisplay.append(startButton, resetButton);

// create output element, but only append after board
const outputDisplay = document.createElement('div');
outputDisplay.className = 'output-div';

//
// TIMER FUNCTIONS
//
// format milliseconds in minutes, seconds
const formatTime = (duration) => {
  let milliseconds = parseInt(duration % 1000, 10);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);

  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');
  milliseconds = milliseconds.toString().padStart(3, '0');

  return `${minutes}:${seconds}`;
};

const setStartTime = () => {
  startTime = Date.now();
};

const resetStartTime = () => {
  startTime = 0;
};

// timer function
const timer = () => {
  const timeElapsed = Date.now() - startTime;
  const timeRemain = Math.max(timeLimit - timeElapsed, 0);

  if (timeRemain > 0) {
    timerDisplay.innerText = formatTime(timeRemain);
  } else {
    timeOut = true;
    stopTimer();

    output('Time is up! Press reset to try again. ');
  }
};

// start timer on click
const startTimer = () => {
  if (timerRunning === true) {
    return; // if timer is already running, don't create more intervals
  }

  console.log('START!');

  setStartTime();
  timerRunning = true;

  interval = setInterval(timer, 10); // setInterval with timer function to run every 10ms
};

// stop timer
const stopTimer = () => {
  console.log('STOP!');

  clearInterval(interval); // clear interval to stop it from running timer function
  resetStartTime(); // reset the value of startTime
  timerRunning = false;
};

// reset timer to 0
const resetTimer = () => {
  console.log('RESET!');

  clearInterval(interval); // reset function will also stop timer from running
  resetStartTime(); // reset startTime
  timerRunning = false;
  timeOut = false;

  deck = shuffleCards(deck);

  timerDisplay.innerText = formatTime(timeLimit); // reset to 0:0:0.000
  // lapTimes = []; // empty lapTimes list
};

//
// CARD / DECK FUNCTIONS
//
// function to get random index for shuffling cards
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// function to shuffle cards
const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
  }
  return cards;
};

// function to make deck
const makeDeck = () => {
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];

    let suitSymbol;
    const suitColor = suitIndex < 2 ? 'red' : 'black';

    if (currentSuit === 'hearts') {
      suitSymbol = '♥️';
    } else if (currentSuit === 'diamonds') {
      suitSymbol = '♦️';
    } else if (currentSuit === 'clubs') {
      suitSymbol = '♣️';
    } else if (currentSuit === 'spades') {
      suitSymbol = '♠️';
    }

    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      let cardName = `${rankCounter}`;
      let cardDisplay = `${rankCounter}`;

      if (cardName === '1') {
        cardName = 'ace';
        cardDisplay = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplay = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplay = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplay = 'K';
      }

      const card = {
        suit: currentSuit,
        symbol: suitSymbol,
        name: cardName,
        displayName: cardDisplay,
        color: suitColor,
        rank: rankCounter,
      };

      newDeck.push(card);
    }
  }

  return newDeck;
};

const makeCutDeck = () => {
  let tempDeck = shuffleCards(makeDeck()); // make a deck and shuffle

  const deckSubset = tempDeck.slice(0, boardSize * boardSize); // cut the deck and draw cards
  const doubleDeck = []; // placeholder deck to duplicate cards into

  for (let i = 0; i < deckSubset.length; i += 1) {
    const tempCard = deckSubset.pop();
    doubleDeck.push(tempCard);
    doubleDeck.push(tempCard); // duplicating cards in the deck
  }

  tempDeck = shuffleCards(doubleDeck);
  return tempDeck;
};

//
// HELPER FUNCTIONS
//
// function to output messages
const output = (message) => {
  outputDisplay.innerText = message;
};

// function to handle clicking on squares
const clickCard = (cardElement, row, column) => {
  const clickedCard = board[row][column]; // this is the card object to lok for

  if (timerRunning === false) {
    startTimer();
  }

  // if timeout in progress
  if (timeOut === true) {
    output('Wait for timeout to end');
    return; // end the function here so it doesn't go further
  }

  // if card has been clicked already
  if (cardElement.innerText !== '') {
    // tell them they've already clicked the square
    output('Already clicked this square!');
    return; // end the function here so it doesn't go further
  }

  // if no first card flipped
  if (firstCard === null) {
    firstCard = clickedCard;
    // flip the card over and display name
    console.log(clickedCard);
    cardElement.innerText = `${firstCard.displayName} \n ${firstCard.symbol}`;
    firstCardElement = cardElement;
  } else {
    if (
      // this check is important in case there's a red and black card of same number
      clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit
    ) {
      cardElement.innerText = `${clickedCard.displayName} \n ${clickedCard.symbol}`;
      output('It\'s a match');
      setTimeout(() => { // reset the display if they don't match
        output('');
      }, 3000);
    } else {
      cardElement.innerText = `${clickedCard.displayName} \n ${clickedCard.symbol}`;
      output('Not a match');
      timeOut = true;
      setTimeout(() => { // reset the display if they don't match
        cardElement.innerText = '';
        firstCardElement.innerText = '';
        timeOut = false;
        output('');
        console.log('no match');
      }, 1000);
    }
    firstCard = null; // reset the first card
  }
};

// function to generate board and assign pairs
const buildBoard = (gameBoard) => {
  // create a board with class board to store rows
  const boardElement = document.createElement('div');
  boardElement.className = 'board';

  // loop through boardSize times to build board rows
  for (let i = 0; i < gameBoard.length; i += 1) {
    // create a row to store the cards in a row
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    // loop through boardSize times again to build each card in the row
    for (let j = 0; j < gameBoard.length; j += 1) {
      // create card div with class card for CSS styling
      const cardElement = document.createElement('div');
      cardElement.className = 'card';

      // addEventListener to make it run the click function
      cardElement.addEventListener('click', (event) => {
        // pass in the card that we're clicking on, and its position
        clickCard(event.currentTarget, i, j);
      });

      // appendChild each square to the row
      rowElement.appendChild(cardElement);
    }

    // then appendChild each row to the board
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// function to set up the game
const initGame = () => {
  document.body.appendChild(timerDisplay);
  document.body.appendChild(buttonDisplay);
  // display countdown at max time on page load
  timerDisplay.innerText = formatTime(timeLimit);

  deck = makeCutDeck();

  for (let i = 0; i < boardSize; i += 1) {
    board.push([]); // create an array for each row
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop()); // assign an identiy to each card
    }
  }

  const boardElement = buildBoard(board);
  document.body.appendChild(boardElement);
  document.body.appendChild(outputDisplay);
};

initGame();
