// game variables
const boardSize = 4; // board has to be even numbered to have pairs
const board = []; // empty array for storing values on the board
let gameStart = false;
let timeOut = false;

let gameTimeLimit = 180000;
const delayInMilliseconds = 1;

let deck; // variable to store game deck to draw cards from

let firstCard = null; // variable to store first card
let firstCardElement; // variable to store first card element

// DOM variables
const timerElement = document.createElement('div');
timerElement.className = 'timer';
timerElement.innerText = msToTime(gameTimeLimit);
document.body.appendChild(timerElement);

const outputElement = document.createElement('div');
outputElement.className = 'output';

// helper functions
// milliseconds to minutes, seconds
function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000));
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  // let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  // hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');
  milliseconds = milliseconds.toString().padStart(3, '0');

  // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  return `${minutes}:${seconds}.${milliseconds}`;
}

// timer function
const startTimer = () => {
  const timer = setInterval(() => {
    timerElement.innerText = msToTime(gameTimeLimit);

    if (gameTimeLimit <= 0) {
      timerElement.innerText = msToTime(0);
      clearInterval(timer);
    }

    gameTimeLimit -= 1;
  }, delayInMilliseconds);
};

// function to get random index for shuffling cards
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// function to shuffle cards
const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    // swap card locations
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
      let cardDisplay;

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

// function to output messages
const output = (message) => {
  outputElement.innerText = message;
};

// function to handle clicking on squares
const clickCard = (cardElement, row, column) => {
  const clickedCard = board[row][column]; // this is the card object to lok for

  startTimer();

  // if card has been clicked already
  if (cardElement.innerText !== '') {
    // tell them they've already clicked the square
    output('Already clicked this square!');
    return; // end the function here so it doesn't go further
  }

  if (timeOut === true) {
    output('Wait for timeout to end');
    return; // end the function here so it doesn't go further
  }

  // if no first card flipped
  if (firstCard === null) {
    firstCard = clickedCard;
    // flip the card over and display name
    cardElement.innerText = `${firstCard.name} \n ${firstCard.symbol}`;
    firstCardElement = cardElement;
  } else {
    if (
      // this check is important in case there's a red and black card of same number
      clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit
    ) {
      cardElement.innerText = `${clickedCard.name} \n ${clickedCard.symbol}`;
      output('It\'s a match');
      setTimeout(() => { // reset the display if they don't match
        output('');
      }, 3000);
    } else {
      cardElement.innerText = `${clickedCard.name} \n ${clickedCard.symbol}`;
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
        gameStart = true;
      });

      // appendChild each square to the row
      rowElement.appendChild(cardElement);
    }

    // then appendChild each row to the board
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// function to set up the game
const initGame = () => {
  deck = shuffleCards(makeDeck());
  const deckSubset = deck.slice(0, boardSize * boardSize);

  const doubleDeck = [];

  for (let i = 0; i < deckSubset.length; i += 1) {
    const tempCard = deckSubset.pop();
    const tempCard2 = tempCard;
    console.log(tempCard, tempCard2);
    doubleDeck.push(tempCard);
    doubleDeck.push(tempCard2);
  }

  deck = shuffleCards(doubleDeck);

  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardElement = buildBoard(board);
  document.body.appendChild(boardElement);
  document.body.appendChild(outputElement);
};

initGame();
