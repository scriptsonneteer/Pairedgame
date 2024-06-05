const { JSDOM } = require('jsdom'); // Import JSDOM from the 'jsdom' library to simulate a browser environment
const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module to work with file and directory paths

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8'); // Read the HTML file into a string

let dom;
let document;

beforeEach(() => { // Set up a simulated browser environment before each test
  dom = new JSDOM(html, { runScripts: 'dangerously' }); // Create a new JSDOM instance with the HTML and allow scripts to run
  document = dom.window.document; // Set the global 'document' to the JSDOM document
  global.document = document; // Make the document globally available
  global.window = dom.window; // Make the window globally available
  require('./script.js'); // Load and execute the script.js file
});

test('should create 8 pairs of cards', () => { // Test that the game creates 8 pairs of cards
  const cards = Array.from(document.querySelectorAll('.card')); // Select all cards
  expect(cards).toHaveLength(16); // Expect 16 cards (8 pairs)

  const nums = cards.map(card => card.dataset.num); // Extract the data-num attribute from each card
  const uniqueNums = new Set(nums); // Create a set of unique numbers
  expect(uniqueNums.size).toBe(8); // Expect 8 unique numbers

  nums.forEach(num => { // For each unique number, check that there are exactly 2 cards with that number
    const count = nums.filter(n => n === num).length;
    expect(count).toBe(2);
  });
});

test('should update score on match', () => { // Test that the score updates when a pair is matched
  const firstCard = document.querySelector('.card[data-num="1"]'); // Select the first card with data-num="1"
  const secondCard = Array.from(document.querySelectorAll('.card[data-num="1"]')).find(c => c !== firstCard); // Select the second card with data-num="1"

  firstCard.click(); // Click the first card
  secondCard.click(); // Click the second card

  expect(document.getElementById('score').textContent).toBe('1'); // Expect the score to be 1
});

test('should flip back cards on mismatch', done => { // Test that mismatched cards flip back
  const firstCard = document.querySelector('.card[data-num="1"]'); // Select the first card with data-num="1"
  const secondCard = document.querySelector('.card[data-num="2"]'); // Select a card with a different data-num
  
  firstCard.click(); // Click the first card
  secondCard.click(); // Click the second card

  setTimeout(() => { // Wait for the flip back animation to complete
    expect(firstCard.classList.contains('flipped')).toBe(false); // Expect the first card to not be flipped
    expect(secondCard.classList.contains('flipped')).toBe(false); // Expect the second card to not be flipped
    done();
  }, 1100);
});

test('should end game after 3 mismatched attempts', done => { // Test that the game ends after 3 mismatched attempts
  const firstCard1 = document.querySelector('.card[data-num="1"]'); // Select the first card with data-num="1"
  const secondCard1 = document.querySelector('.card[data-num="2"]'); // Select the first card with data-num="2"
  const firstCard2 = document.querySelector('.card[data-num="3"]'); // Select the first card with data-num="3"
  const secondCard2 = document.querySelector('.card[data-num="4"]'); // Select the first card with data-num="4"
  const firstCard3 = document.querySelector('.card[data-num="5"]'); // Select the first card with data-num="5"
  const secondCard3 = document.querySelector('.card[data-num="6"]'); // Select the first card with data-num="6"

  firstCard1.click(); // Click the first pair of cards
  secondCard1.click();

  setTimeout(() => {
    firstCard2.click();  // Click the second pair of cards
    secondCard2.click();

    setTimeout(() => {
      firstCard3.click(); // Click the third pair of cards
      secondCard3.click();

      setTimeout(() => {
        expect(document.getElementById('status').textContent).toBe('Game Over');
        done(); // Signal that the asynchronous test is complete
      }, 1100);
    }, 1100);
  }, 1100);
});

test('should not allow the same card to be flipped more than once', () => { // Test that the same card cannot be flipped twice
  const firstCard = document.querySelector('.card[data-num="1"]'); // Select the first card with data-num="1"
  firstCard.click(); // Click the card
  firstCard.click(); // Click the card again
  
  expect(firstCard.classList.contains('flipped')).toBe(true); // Expect the card to remain flipped
  expect(firstCard.querySelector('.front').style.display).toBe('none'); // Expect the front to be hidden
});

test('should reset the game after a win', done => { // Test that the game resets after a win
  for (let i = 1; i <= 8; i++) {
    const firstCard = document.querySelector(`.card[data-num="${i}"]`); // Select the first card of each pair
    const secondCard = Array.from(document.querySelectorAll(`.card[data-num="${i}"]`)).find(c => c !== firstCard); // Select the second card of each pair
    firstCard.click(); // Click the first card
    secondCard.click(); // Click the second card
  }

  setTimeout(() => {
    expect(document.getElementById('status').textContent).toBe('You Win!'); // Expect the status to be 'You Win!'
    setTimeout(() => {
      expect(document.getElementById('score').textContent).toBe('0'); // Expect the score to reset to 0
      expect(document.getElementById('status').textContent).toBe('Game On'); // Expect the status to reset to 'Game On'
      done(); // Signal that the asynchronous test is complete
    }, 3100);
  }, 1000);
});

test('should reset the game after a loss', done => { // Test that the game resets after a loss
  const firstCard1 = document.querySelector('.card[data-num="1"]'); // Select the first card with data-num="1"
  const secondCard1 = document.querySelector('.card[data-num="2"]'); // Select the first card with data-num="2"
  const firstCard2 = document.querySelector('.card[data-num="3"]'); // Select the first card with data-num="3"
  const secondCard2 = document.querySelector('.card[data-num="4"]'); // Select the first card with data-num="4"
  const firstCard3 = document.querySelector('.card[data-num="5"]'); // Select the first card with data-num="5"
  const secondCard3 = document.querySelector('.card[data-num="6"]'); // Select the first card with data-num="6"

  firstCard1.click(); // Click the first pair of cards
  secondCard1.click();

  setTimeout(() => {
    firstCard2.click(); // Click the second pair of cards
    secondCard2.click();

    setTimeout(() => {
      firstCard3.click(); // Click the third pair of cards
      secondCard3.click();

      setTimeout(() => {
        expect(document.getElementById('status').textContent).toBe('Game Over'); // Expect the status to be 'Game Over'
        setTimeout(() => {
          expect(document.getElementById('score').textContent).toBe('0'); // Expect the score to reset to 0
          expect(document.getElementById('status').textContent).toBe('Game On'); // Expect the status to reset to 'Game On'
          done(); // Signal that the asynchronous test is complete
        }, 3100);
      }, 1100);
    }, 1100);
  }, 1100);
});
