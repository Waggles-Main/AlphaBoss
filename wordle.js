document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIG & STATE ---
    const DICTIONARY_URL = 'https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/North-American/NWL2020.txt';
    const WORD_LENGTH = 5;
    const MAX_GUESSES = 6;
    const REWARDS = { 1: 100, 2: 50, 3: 20, 4: 10, 5: 0, 6: -5 };

    const state = {
        dictionary: new Set(),
        solution: '',
        guesses: [],
        currentGuess: '',
        gameActive: false,
        runState: {},
    };

    // --- DOM ELEMENTS ---
    const gridContainer = document.getElementById('grid-container');
    const keyboardContainer = document.getElementById('keyboard-container');
    const moneyDisplayEl = document.getElementById('moneyDisplay');
    const resultModal = document.getElementById('resultModalOverlay');
    const resultTitleEl = document.getElementById('resultTitle');
    const resultMessageEl = document.getElementById('resultMessage');
    const statGuessesEl = document.getElementById('statGuesses');
    const statMoneyEl = document.getElementById('statMoney');
    const continueBtn = document.getElementById('continueBtn');
    const skipBtn = document.getElementById('skipBtn');
    const devScoreDetailsEl = document.getElementById('devScoreDetails');

    // --- GAME SETUP ---
    async function init() {
        state.runState = getRunState();
        moneyDisplayEl.textContent = `$${state.runState.money || 0}`;
        skipBtn.disabled = (state.runState.money || 0) < 10;

        await loadDictionary();
        setupGame();
        initializePageDevControls();
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
        // 1. Select a solution
        const fiveLetterWords = [...state.dictionary].filter(w => w.length === WORD_LENGTH);
        state.solution = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];

        // 2. Reset state
        state.guesses = [];
        state.currentGuess = '';
        state.gameActive = true;

        // 3. Render UI
        renderGrid();
        renderKeyboard();
        updateDevPanel();
        resultModal.style.display = 'none';

        // 4. Listen for input
        window.addEventListener('keydown', handleKeyPress);
        skipBtn.addEventListener('click', handleSkip);
    }

    // --- RENDERING ---
    function renderGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < MAX_GUESSES; i++) {
            const rowContainer = document.createElement('div');
            rowContainer.className = 'wordle-row-container';

            const row = document.createElement('div');
            row.className = 'wordle-row';
            for (let j = 0; j < WORD_LENGTH; j++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                row.appendChild(tile);
            }

            const rewardLabel = document.createElement('div');
            rewardLabel.className = 'wordle-reward-label';
            const rewardValue = REWARDS[i + 1];
            rewardLabel.textContent = `${rewardValue >= 0 ? '+' : ''}$${rewardValue}`;
            if (rewardValue < 0) rewardLabel.classList.add('negative');

            rowContainer.appendChild(row);
            rowContainer.appendChild(rewardLabel);
            gridContainer.appendChild(rowContainer);
        }
    }

    function renderKeyboard() {
        keyboardContainer.innerHTML = '';
        const keys = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];
        keys.forEach((row, rowIndex) => {
            const keyRow = document.createElement('div');
            keyRow.className = 'keyboard-row';
            if (rowIndex === 2) {
                const enterKey = createKey('ENTER');
                keyRow.appendChild(enterKey);
            }
            for (const letter of row) {
                keyRow.appendChild(createKey(letter));
            }
            if (rowIndex === 2) {
                const backspaceKey = createKey('⌫', 'backspace');
                keyRow.appendChild(backspaceKey);
            }
            keyboardContainer.appendChild(keyRow);
        });
    }

    function createKey(key, id = key.toLowerCase()) {
        const button = document.createElement('button');
        button.className = 'key';
        button.textContent = key;
        button.dataset.key = id;
        button.addEventListener('click', () => handleKeyPress({ key: id }));
        return button;
    }

    function updateGrid() {
        const rows = gridContainer.querySelectorAll('.wordle-row-container .wordle-row');
        for (let i = 0; i < MAX_GUESSES; i++) {
            const tiles = rows[i].querySelectorAll('.wordle-tile');
            if (i < state.guesses.length) { // Submitted guess
                const guess = state.guesses[i];
                const solutionLetters = state.solution.split('');
                const guessLetters = guess.split('');
                const statuses = Array(WORD_LENGTH).fill('absent');

                // First pass for correct letters
                for (let j = 0; j < WORD_LENGTH; j++) {
                    if (guessLetters[j] === solutionLetters[j]) {
                        statuses[j] = 'correct';
                        solutionLetters[j] = null; // Mark as used
                    }
                }
                // Second pass for present letters
                for (let j = 0; j < WORD_LENGTH; j++) {
                    if (statuses[j] !== 'correct' && solutionLetters.includes(guessLetters[j])) {
                        statuses[j] = 'present';
                        solutionLetters[solutionLetters.indexOf(guessLetters[j])] = null; // Mark as used
                    }
                }

                for (let j = 0; j < WORD_LENGTH; j++) {
                    tiles[j].textContent = guess[j];
                    tiles[j].classList.add(statuses[j], 'filled');
                    updateKeyboard(guess[j], statuses[j]);
                }
            } else if (i === state.guesses.length) { // Current guess
                for (let j = 0; j < WORD_LENGTH; j++) {
                    tiles[j].textContent = state.currentGuess[j] || '';
                    tiles[j].classList.toggle('filled', !!state.currentGuess[j]);
                }
            }
        }
    }

    function updateKeyboard(letter, status) {
        const key = keyboardContainer.querySelector(`[data-key="${letter.toLowerCase()}"]`);
        if (!key) return;

        // Prioritize the best status for a letter. Green > Yellow > Gray.
        const currentStatus = key.classList.contains('correct') ? 'correct'
                            : key.classList.contains('present') ? 'present'
                            : 'absent';

        if (status === 'correct' || (status === 'present' && currentStatus !== 'correct')) {
            key.classList.remove('present', 'absent');
            key.classList.add(status);
        } else if (status === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.classList.add('absent');
        }
    }
    // --- GAMEPLAY HANDLERS ---
    function handleKeyPress(e) {
        if (!state.gameActive) return;

        const key = e.key.toUpperCase();
        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE' || e.key === '⌫') {
            state.currentGuess = state.currentGuess.slice(0, -1);
        } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
            if (state.currentGuess.length < WORD_LENGTH) {
                state.currentGuess += key;
            }
        }
        updateGrid();
    }

    function submitGuess() {
        if (state.currentGuess.length !== WORD_LENGTH) {
            showErrorToast('Not enough letters');
            return;
        }
        if (!state.dictionary.has(state.currentGuess)) {
            showErrorToast('Not in word list');
            return;
        }

        state.guesses.push(state.currentGuess);
        const isWin = state.currentGuess === state.solution;
        state.currentGuess = '';
        updateGrid();

        if (isWin) {
            endGame(true);
        } else if (state.guesses.length === MAX_GUESSES) {
            endGame(false);
        }
    }

    function handleSkip() {
        const skipCost = 10;
        if (state.runState.money < skipCost) {
            showErrorToast("Not enough money to skip!");
            return;
        }

        // Deduct cost, advance stage, save, and navigate
        state.runState.money -= skipCost;
        state.runState.stageIndex++;
        saveRunState(state.runState);

        window.location.href = 'between-rounds.html';
    }

    // --- END GAME ---
    function endGame(didWin) {
        state.gameActive = false;
        window.removeEventListener('keydown', handleKeyPress);

        const guessCount = state.guesses.length;
        const moneyEarned = didWin ? REWARDS[guessCount] : REWARDS[MAX_GUESSES];

        // Update run state
        state.runState.money = (state.runState.money || 0) + moneyEarned;
        state.runState.stageIndex++;
        saveRunState(state.runState);

        // Populate and show modal
        resultTitleEl.textContent = didWin ? 'SUCCESS!' : 'FAILED';
        resultTitleEl.className = didWin ? 'success' : 'fail';
        resultMessageEl.textContent = `The word was: ${state.solution}`;
        statGuessesEl.textContent = guessCount;
        statMoneyEl.textContent = `${moneyEarned >= 0 ? '+' : ''}$${moneyEarned}`;
        statMoneyEl.style.color = moneyEarned >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

        setTimeout(() => {
            resultModal.style.display = 'flex';
        }, 500);
    }

    continueBtn.addEventListener('click', () => {
        window.location.href = 'between-rounds.html';
    });

    // --- DEV CONTROLS ---
    function updateDevPanel() {
        if (!devScoreDetailsEl) return;
        devScoreDetailsEl.textContent = `Solution: ${state.solution}`;
    }

    function initializePageDevControls() {
        const gameState = {
            winCondition: () => {
                if (!state.gameActive) return;
                state.currentGuess = state.solution;
                submitGuess();
            },
            loseCondition: () => {
                if (!state.gameActive) return;
                state.guesses = Array(MAX_GUESSES - 1).fill("WRONG");
                state.currentGuess = "GUESS";
                submitGuess();
            },
            updateDevPanel: updateDevPanel,
        };
        initDevControls(gameState); // This now correctly calls the shared function
    }

    // --- INITIALIZE ---
    init();
});