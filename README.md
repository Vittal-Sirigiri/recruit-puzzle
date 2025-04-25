# Recruitment Puzzle

A web-based puzzle that hides an email address within a grid of letters using Markov numbers.

## Setup

1. Generate the grid using Python:
   ```bash
   python generate_grid.py > grid_output.html
   ```
2. Copy the generated grid HTML from `grid_output.html` into the `<div class="grid">...</div>` section in `index.html`, replacing the existing content.
3. Open `index.html` in a web browser.

## How to Use

1. Open the `index.html` file in a web browser.
2. You'll see a grid of letters.
3. The email address is hidden within the grid. The positions of the characters correspond to the sequence of Markov numbers (1, 2, 5, 13, 29, 34, 89, 169, 194, 233, 433, 610, 985, 1325, 1597, 1690, 2897), wrapping around the grid.
4. Use the "Show Hint" button if you need help finding the pattern.

## Technical Details

- The grid is 20x20 cells.
- Each cell contains a random letter.
- The email characters are placed at positions corresponding to the Markov number sequence, wrapping around the grid.
- The position index is calculated as `(Markov_Number - 1) % 400`.
- The grid is generated using Python and inserted statically into the HTML.
- The grid is responsive and will adjust for different screen sizes.

## Files

- `index.html` - The main webpage with the static grid.
- `styles.css` - Styles for the grid and UI.
- `script.js` - Hint functionality.
- `generate_grid.py` - Python script to generate the grid.

## Security

The grid generation logic is hidden from users as it's pre-generated using Python and inserted statically into the HTML. This prevents users from easily discovering the pattern by examining the source code.

## How It Works

1. The grid is filled with random letters.
2. The email characters are placed at specific positions based on the Markov number sequence.
3. The position index is calculated by `(Markov_Number - 1) % 400` (where 400 is the total number of cells).
4. The row and column are derived from this index:
   - `row = index // 20`
   - `col = index % 20` 