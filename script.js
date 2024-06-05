// Initialize variables
let cards = []; // Array to store card objects
let firstCard, secondCard; // Variables to track the first and second flipped cards
let hasFlippedCard = false; // Boolean to check if a card has been flipped
let lockBoard = false; // Boolean to lock the board and prevent clicking during certain operations
let score = 0; // Variable to track the score
let attempts = 0; // Variable to track the number of attempts
const maxAttempts = 3; // Constant for the maximum allowed attempts
const winningScore = 8; // Constant for the score needed to win the game

// Get elements from the DOM
const cardsGrid = document.getElementById('cards-grid'); // Select the cards grid container
const scoreDisplay = document.getElementById('score'); // Select the score display element
const statusDisplay = document.getElementById('status'); // Select the status display element
const gameContainer = document.querySelector('.game-container'); // Select the game container

/**
 * Function to create and shuffle cards
 */
function createCards() {
  const pairs = Array.from({ length: 8 }, (_, i) => i + 1).flatMap(num => [num, num]); // Create an array of pairs of numbers from 1 to 8
  pairs.sort(() => Math.random() - 0.5); // Shuffle the pairs array
  cards = pairs.map((num, i) => ({ // Map the shuffled pairs to card objects
    id: i,
    num: num,
    element: createCardElement(num) // Create card elements and assign them to the card objects
  }));
}

/**
 * Function to create card elements
 * @param {number} num - The number for the card
 * @returns {HTMLElement} - The card element
 */
function createCardElement(num) { 
  const card = document.createElement('div'); // Create a new div element for the card
  card.classList.add('card'); // Add the 'card' class to the div
  card.dataset.num = num.toString(); // Set the data-num attribute to the card's number

  const front = document.createElement('div'); // Create a new div for the front of the card
  front.classList.add('front'); // Add the 'front' class to the div
  front.textContent = ''; // Set the front text content to an empty string
  front.style.display = 'block'; // Display the front by default

  const back = document.createElement('div'); // Create a new div for the front of the card
  back.classList.add('back'); // Add the 'front' class to the div
  back.textContent = num.toString(); // Set the front text content to an empty string
  back.style.display = 'none'; // Display the front by default

  card.appendChild(front); // Append the front div to the card
  card.appendChild(back); // Append the back div to the card

  card.addEventListener('click', flipCard); // Add a click event listener to the card
  cardsGrid.appendChild(card);
  return card;
}

/**
 * Function to show the front of the card
 */
function showFront() {
  this.querySelector('.front').style.display = 'block'; // Show the front of the card
  this.querySelector('.back').style.display = 'none'; // Hide the back of the card
}

/**
 * Function to show the back of the card
 */
function showBack() {
  this.querySelector('.front').style.display = 'none'; // Hide the front of the card
  this.querySelector('.back').style.display = 'block'; // Show the back of the card
}

/**
 * Function to handle card flips
 */
function flipCard() {
  if (lockBoard) return; // If the board is locked, return
  if (this === firstCard) return; // Prevent clicking the same card twice

  showBack.call(this); // Show the back of the clicked card
  this.classList.add('flipped'); // Add the 'flipped' class to the card

  if (!firstCard) {
    firstCard = this; // If it's the first card flipped, assign it to 'firstCard'
    return;
  }

  secondCard = this; // If it's the second card flipped, assign it to 'secondCard'
  checkForMatch(); // Check if the two flipped cards match
}

/**
 * Function to check for card match
 */
function checkForMatch() {
  const isMatch = parseInt(firstCard.dataset.num) === parseInt(secondCard.dataset.num); // Check if the numbers on the two flipped cards match
  isMatch ? disableCards() : unflipCards(); // If there's a match, disable the cards, otherwise unflip them
}

/**
 * Function to disable matched cards
 */
function disableCards() {
  firstCard.removeEventListener('click', flipCard); // Remove click event listener from the first card
  secondCard.removeEventListener('click', flipCard); // Remove click event listener from the second card
  firstCard.classList.add('matched'); // Add the 'matched' class to the first card
  secondCard.classList.add('matched'); // Add the 'matched' class to the second card
  firstCard.classList.remove('flipped'); // Remove the 'flipped' class from the first card
  secondCard.classList.remove('flipped'); // Remove the 'flipped' class from the second card
  showFront.call(firstCard); // Show the front of the first card
  showFront.call(secondCard); // Show the front of the second card
  resetBoard(); // Reset the board state
  updateScore(); // Update the score
}

/**
 * Function to unflip cards
 */
function unflipCards() { 
  lockBoard = true; // Lock the board to prevent additional flips
  setTimeout(() => {
    firstCard.classList.remove('flipped');  // Remove the 'flipped' class from the first card
    secondCard.classList.remove('flipped'); // Remove the 'flipped' class from the second card
    showFront.call(firstCard); // Show the front of the first card
    showFront.call(secondCard); // Show the front of the second card
    resetBoard(); // Reset the board state
    updateAttempts(); // Update the attempts
  }, 1000); // Wait for 1 second before unflipping the cards
}

/**
 * Function to reset board state
 */
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

/**
 * Function to update the score
 */
function updateScore() {
  score++; // Increment the score
  scoreDisplay.textContent = score.toString(); // Update the score display
  if (score === winningScore) { // If the player wins
    statusDisplay.textContent = 'You Win!'; // Display 'You Win!'
    setTimeout(() => startNewGame(), 3000); // Start a new game after 3 seconds
  }
}

/**
 * Function to update the attempts
 */
function updateAttempts() {
  attempts++; // Increment the attempts
  if (attempts >= maxAttempts) { // If the maximum attempts are reached
    statusDisplay.textContent = 'Game Over'; // Display 'Game Over'
    setTimeout(() => startNewGame(), 3000); // Start a new game after 3 seconds
  }
}

/**
 * Function to reset the game
 */
function startNewGame() {
  cardsGrid.innerHTML = ''; // Clear the cards grid
  score = 0; // Reset the score
  attempts = 0; // Reset the
  scoreDisplay.textContent = score.toString();
  statusDisplay.textContent = 'Game On';
  countdown(3);
}

/**
 * Function to handle the countdown
 * @param {number} seconds - The countdown time in seconds
 */
function countdown(seconds) {
  statusDisplay.textContent = `Starting in ${seconds}`;
  if (seconds > 0) {
    setTimeout(() => countdown(seconds - 1), 1000);
  } else {
    statusDisplay.textContent = 'Game On';
    createCards();
    setTimeout(() => {
      document.querySelectorAll('.card').forEach(card => {
        showBack.call(card);
        setTimeout(() => {
          showFront.call(card);
        }, 1500);
      });
    }, 2000);
  }
}

// Start the game with a countdown
countdown(3);
