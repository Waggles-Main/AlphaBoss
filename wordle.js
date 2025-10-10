document.addEventListener('DOMContentLoaded', () => {
    const WORD_LIST = ["BRAIN", "QUERY", "GHOST", "PIXEL", "CHART"];
    const solution = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

    const grid = document.getElementById('wordleGrid');
    const keyboard = document.getElementById('keyboard');
    const TILE_COUNT = 5;
    const GUESS_COUNT = 6;

    let currentRow = 0;
    let currentCol = 0;
    let guesses = Array(GUESS_COUNT).fill(null).map(() => Array(TILE_COUNT).fill(''));

    // --- INITIALIZATION ---
    function createGrid() {
        for (let i = 0; i < GUESS_COUNT; i++) {
            const row = document.createElement('div');
            row.className = 'grid-row';
            for (let j = 0; j < TILE_COUNT; j++) {
                const tile = document.createElement('div');
                tile.className = 'grid-tile';
                row.appendChild(tile);
            }
            grid.appendChild(row);
        }
    }

    // --- INPUT HANDLING ---
    function handleKeyPress(key) {
        if (key === 'ENTER') {
            submitGuess();
            return;
        }
        if (key === 'BACKSPACE') {
            deleteLetter();
            return;
        }
        if (currentCol < TILE_COUNT && /^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }

    function addLetter(letter) {
        guesses[currentRow][currentCol] = letter;
        const tile = grid.children[currentRow].children[currentCol];
        tile.textContent = letter;
        tile.classList.add('filled');
        currentCol++;
    }

    function deleteLetter() {
        if (currentCol > 0) {
            currentCol--;
            guesses[currentRow][currentCol] = '';
            const tile = grid.children[currentRow].children[currentCol];
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    }

    // --- GUESS SUBMISSION & EVALUATION ---
    function submitGuess() {
        if (currentCol !== TILE_COUNT) {
            // Optionally, add a "not enough letters" message
            return;
        }

        const guess = guesses[currentRow].join('');
        flipTiles(guess);
    }

    function flipTiles(guess) {
        const rowTiles = grid.children[currentRow].children;
        let correctCount = 0;

        for (let i = 0; i < TILE_COUNT; i++) {
            const tile = rowTiles[i];
            const letter = guess[i];
            let state = 'absent';

            if (solution[i] === letter) {
                state = 'correct';
                correctCount++;
            } else if (solution.includes(letter)) {
                state = 'present';
            }

            setTimeout(() => {
                tile.classList.add('flip');
                tile.classList.add(state);
                updateKeyboard(letter, state);
            }, i * 300);
        }

        setTimeout(() => {
            if (correctCount === TILE_COUNT) {
                endGame(true); // Win
            } else if (currentRow === GUESS_COUNT - 1) {
                endGame(false); // Lose
            } else {
                currentRow++;
                currentCol = 0;
            }
        }, TILE_COUNT * 300);
    }

    function updateKeyboard(letter, state) {
        const key = keyboard.querySelector(`[data-key="${letter}"]`);
        if (!key) return;

        const currentState = key.dataset.state;
        if (currentState === 'correct') return;
        if (currentState === 'present' && state !== 'correct') return;

        key.classList.add(state);
        key.dataset.state = state;
    }

    // --- END GAME ---
    function endGame(didWin) {
        const overlay = document.createElement('div');
        overlay.className = 'result-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'result-modal';

        const title = document.createElement('h2');
        const message = document.createElement('p');
        const continueBtn = document.createElement('a');
        continueBtn.textContent = 'CONTINUE';
        continueBtn.href = 'gameplay.html'; // Navigate back to the main game

        if (didWin) {
            title.textContent = 'YOU WON!';
            message.textContent = 'Placeholder Outcome: +$10'; // The placeholder outcome
        } else {
            title.textContent = 'NICE TRY!';
            message.textContent = `The word was: ${solution}`;
        }

        modal.appendChild(title);
        modal.appendChild(message);
        modal.appendChild(continueBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // --- EVENT LISTENERS ---
    keyboard.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            handleKeyPress(e.target.dataset.key);
        }
    });

    document.addEventListener('keydown', (e) => {
        let key = e.key.toUpperCase();
        if (key === 'BACKSPACE' || key === 'ENTER') {
            handleKeyPress(key);
        } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
            handleKeyPress(key);
        }
    });

    // --- START ---
    createGrid();
});