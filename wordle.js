document.addEventListener('DOMContentLoaded', () => {
    const DICTIONARY_URL = 'https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/North-American/NWL2020.txt';
    const WORD_LENGTH = 5;
    const MAX_GUESSES = 6;

    const state = {
        dictionary: new Set(),
        solution: '',
        guesses: [],
        currentRow: 0,
        currentCol: 0,
        isGameOver: false,
    };

    const grid = document.getElementById('wordleGrid');
    const keyboard = document.getElementById('keyboard');
    const devScoreDetailsEl = document.getElementById('devScoreDetails');

    async function init() {
        await loadDictionary();
        setupGame();
        initDevControls();
    }

    async function loadDictionary() {
        try {
            const response = await fetch(DICTIONARY_URL);
            const text = await response.text();
            const words = text.split('\n').slice(2).map(line => line.split(/[\s\t]/)[0].trim().toUpperCase());
            state.dictionary = new Set(words);
            console.log('Wordle dictionary loaded.');
        } catch (error) {
            console.error('Failed to load dictionary:', error);
        }
    }

    function setupGame() {
        // Reset state
        state.guesses = Array(MAX_GUESSES).fill(null).map(() => Array(WORD_LENGTH).fill(''));
        state.currentRow = 0;
        state.currentCol = 0;
        state.isGameOver = false;

        // Select a new word
        const fiveLetterWords = [...state.dictionary].filter(w => w.length === WORD_LENGTH);
        state.solution = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
        console.log(`Wordle solution: ${state.solution}`);

        // Build UI
        buildGrid();
        updateDevPanel();
        document.querySelectorAll('.keyboard button').forEach(btn => {
            btn.className = '';
            if (btn.dataset.key === 'ENTER' || btn.dataset.key === 'BACKSPACE') {
                btn.classList.add('key-large');
            }
        });
    }

    function buildGrid() {
        grid.innerHTML = '';
        for (let r = 0; r < MAX_GUESSES; r++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            for (let c = 0; c < WORD_LENGTH; c++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                row.appendChild(tile);
            }
            grid.appendChild(row);
        }
    }

    function updateGrid() {
        for (let r = 0; r < MAX_GUESSES; r++) {
            for (let c = 0; c < WORD_LENGTH; c++) {
                const tile = grid.children[r].children[c];
                tile.textContent = state.guesses[r][c];
                tile.classList.toggle('filled', !!state.guesses[r][c]);
            }
        }
    }

    function handleKeyPress(key) {
        if (state.isGameOver) return;

        if (key === 'ENTER') {
            if (state.currentCol === WORD_LENGTH) {
                submitGuess();
            }
        } else if (key === 'BACKSPACE') {
            if (state.currentCol > 0) {
                state.currentCol--;
                state.guesses[state.currentRow][state.currentCol] = '';
                updateGrid();
            }
        } else if (state.currentCol < WORD_LENGTH && /^[A-Z]$/.test(key)) {
            state.guesses[state.currentRow][state.currentCol] = key;
            state.currentCol++;
            updateGrid();
        }
    }

    function submitGuess() {
        const guess = state.guesses[state.currentRow].join('');
        if (!state.dictionary.has(guess)) {
            showToast('Not in word list');
            return;
        }

        const rowEl = grid.children[state.currentRow];
        const solutionLetters = state.solution.split('');

        // First pass for correct letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] === solutionLetters[i]) {
                rowEl.children[i].classList.add('correct');
                updateKeyboard(guess[i], 'correct');
                solutionLetters[i] = null; // Mark as used
            }
        }

        // Second pass for present letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (!rowEl.children[i].classList.contains('correct')) {
                if (solutionLetters.includes(guess[i])) {
                    rowEl.children[i].classList.add('present');
                    updateKeyboard(guess[i], 'present');
                    solutionLetters[solutionLetters.indexOf(guess[i])] = null; // Mark as used
                } else {
                    rowEl.children[i].classList.add('absent');
                    updateKeyboard(guess[i], 'absent');
                }
            }
        }

        if (guess === state.solution) {
            endGame(true);
        } else if (state.currentRow === MAX_GUESSES - 1) {
            endGame(false);
        } else {
            state.currentRow++;
            state.currentCol = 0;
        }
    }

    function updateKeyboard(key, status) {
        const keyEl = keyboard.querySelector(`[data-key="${key}"]`);
        if (keyEl.classList.contains('correct')) return;
        if (keyEl.classList.contains('present') && status === 'absent') return;
        keyEl.classList.remove('present', 'absent');
        keyEl.classList.add(status);
    }

    function endGame(didWin) {
        const EVENT_REWARD = 8;
        state.isGameOver = true;
        const runState = getRunState();

        // Increment the stage index to move past the event
        if (runState) {
            runState.stageIndex++;
        }

        if (didWin) {
            if (runState) {
                runState.money = (runState.money || 0) + EVENT_REWARD;
            }
        }

        // Save the final state after all modifications
        if (runState) {
            saveRunState(runState);
        }

        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            const modal = document.createElement('div');
            modal.className = 'result-modal';
            modal.innerHTML = `
                <h2 class="${didWin ? 'success' : 'fail'}">${didWin ? 'SUCCESS!' : 'NICE TRY!'}</h2>
                <p>The word was: <strong>${state.solution}</strong></p>
                ${didWin ? `<p class="reward-text">You earned +$${EVENT_REWARD}!</p>` : ''}
                <div class="result-actions">
                    <button class="btn-continue">CONTINUE</button>
                </div>
            `;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            overlay.style.display = 'flex';
            modal.querySelector('.btn-continue').addEventListener('click', () => {
                // Always return to the between-rounds screen to continue the run
                window.location.href = 'between-rounds.html';
            });
        }, 1000);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- DEV PANEL LOGIC ---
    function updateDevPanel() {
        if (!devScoreDetailsEl) return;
        devScoreDetailsEl.textContent = `Solution: ${state.solution}`;
    }

    function initDevControls() {
        const devWinBtn = document.getElementById('devWin');
        const devLoseBtn = document.getElementById('devLose');
        const devNavMenuBtn = document.getElementById('devNavMenu');
        const devNavGameBtn = document.getElementById('devNavGame');
        const devMinimizeBtn = document.getElementById('devMinimizeBtn');
        const devNavShopBtn = document.getElementById('devNavShop');
        const devNavEventBtn = document.getElementById('devNavEvent');

        if (!devWinBtn) return;

        devMinimizeBtn.addEventListener('click', () => {
            const panel = document.getElementById('devPanel');
            panel.classList.toggle('minimized');
            devMinimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '-';
        });

        devWinBtn.addEventListener('click', () => {
            if (state.isGameOver) return;
            // Fill current row with the solution
            for (let i = 0; i < WORD_LENGTH; i++) {
                state.guesses[state.currentRow][i] = state.solution[i];
            }
            state.currentCol = WORD_LENGTH;
            updateGrid();
            submitGuess();
        });

        devLoseBtn.addEventListener('click', () => {
            if (state.isGameOver) return;
            endGame(false);
        });

        devNavMenuBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
        devNavGameBtn.addEventListener('click', () => { window.location.href = 'gameplay.html'; });
        devNavShopBtn.addEventListener('click', () => { window.location.href = 'shop.html'; });
        devNavEventBtn.addEventListener('click', () => { window.location.href = 'event.html'; });

        updateDevPanel();
    }

    // Event Listeners
    keyboard.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            handleKeyPress(e.target.dataset.key);
        }
    });

    document.addEventListener('keydown', (e) => {
        let key = e.key.toUpperCase();
        if (key === 'BACKSPACE' || key === 'ENTER' || /^[A-Z]$/.test(key)) {
            handleKeyPress(key);
        }
    });

    init();
});