// DOM Elements
const showHint = document.getElementById('showHint');
const message = document.getElementById('message');
const gridCells = document.querySelectorAll('.grid-cell');

// Function to check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Function to get cell position in the grid
function getCellPosition(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    return row * 10 + col + 1; // +1 because positions start from 1
}

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    if (cell.classList.contains('correct') || cell.classList.contains('incorrect')) {
        return; // Don't allow re-clicking already clicked cells
    }

    const position = getCellPosition(cell);
    if (isPrime(position)) {
        cell.classList.add('correct');
        message.textContent = 'Correct! This is a prime number position.';
        message.style.color = '#4CAF50';
    } else {
        cell.classList.add('incorrect');
        message.textContent = 'Incorrect! This is not a prime number position.';
        message.style.color = '#f44336';
    }
}

// Show hint
function showHintHandler() {
    message.textContent = 'Hint: The positions follow the sequence of prime numbers (2, 3, 5, 7, ...), wrapping around the grid.';
    message.style.color = '#2196F3';
}

// Initialize the puzzle
function init() {
    // Add event listener for hint
    showHint.addEventListener('click', showHintHandler);
    
    // Add click event listeners to all grid cells
    gridCells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

// Start the puzzle
init();