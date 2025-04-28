// DOM Elements
const showHint = document.getElementById('showHint');
const message = document.getElementById('message');

// Show hint
function showHintHandler() {
    message.textContent = 'Hint: The positions follow the sequence of prime numbers (2, 3, 5, 7, ...), wrapping around the grid.';
    message.style.color = '#2196F3';
}

// Initialize the puzzle
function init() {
    // Add event listener for hint
    showHint.addEventListener('click', showHintHandler);
}

// Start the puzzle
init();