document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIG & STATE ---
    const DICTIONARY_URL = 'https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/North-American/NWL2020.txt';
    const GAME_CONFIG = {
        easy: {
            mainWordLength: 5,
            wordsToFind: 6,
            time: 120, // 2 minutes in seconds
            hintThreshold: 4,
        }
        // Medium, Hard, Extreme can be added later
    };

    const state = {
        dictionary: new Set(),
        difficulty: 'easy',
        mainWord: '',
        scrambledLetters: [],
        hiddenWords: [],
        foundWords: new Set(),
        foundBonusWords: new Set(),
        bonusWordsCount: 0,
        currentInput: [], // { letter: 'A', originalIndex: 0 }
        hintProgress: 0,
        timer: null,
        timeLeft: 0,
        gameActive: false,
        audioUnlocked: false,
    };
    let runState = {};

    // --- DOM ELEMENTS ---
    const timerEl = document.getElementById('timer');
    const wordsFoundCountEl = document.getElementById('wordsFoundCount');
    const bonusWordsCountEl = document.getElementById('bonusWordsCount');
    const wordsGridEl = document.getElementById('wordsGrid');
    const hintBarEl = document.getElementById('hintBar');
    const inputTilesEl = document.getElementById('inputTiles');
    const letterPoolEl = document.getElementById('letterPool');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const submitBtn = document.getElementById('submitBtn');
    const skipBtn = document.getElementById('skipBtn');
    const resultModal = document.getElementById('resultModalOverlay');
    const resultTitleEl = document.getElementById('resultTitle');
    const resultMessageEl = document.getElementById('resultMessage');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const continueBtn = document.getElementById('backToMenuBtn'); // Re-purposing this button
    let dragStartIndex;
    const devScoreDetailsEl = document.getElementById('devScoreDetails');

    // --- ANAGRAM & WORD LOGIC ---
    function getLetterCounts(word) {
        const counts = {};
        for (const letter of word) {
            counts[letter] = (counts[letter] || 0) + 1;
        }
        return counts;
    }

    function canFormWord(word, letterCounts) {
        const wordCounts = getLetterCounts(word);
        for (const letter in wordCounts) {
            if (!letterCounts[letter] || wordCounts[letter] > letterCounts[letter]) {
                return false;
            }
        }
        return true;
    }

    function findAnagrams(mainWord, dict) {
        const mainWordCounts = getLetterCounts(mainWord);
        const anagrams = [];
        for (const word of dict) {
            if (word.length >= 3 && word.length <= mainWord.length && canFormWord(word, mainWordCounts)) {
                anagrams.push(word);
            }
        }
        return anagrams;
    }

    // --- GAME SETUP ---
    async function init() {
        runState = getRunState();
        skipBtn.disabled = (runState.money || 0) < 10;

        await loadDictionary();
        setupGame();
    }

    async function loadDictionary() {
        try {
            const response = await fetch(DICTIONARY_URL);
            const text = await response.text();
            const words = text.split('\n').slice(2).map(line => line.split(/[\s\t]/)[0].trim().toUpperCase());
            state.dictionary = new Set(words);
            console.log('Scrabble dictionary loaded.');
        } catch (error) {
            console.error('Failed to load dictionary:', error);
        }
    }

    function setupGame() {
        const config = GAME_CONFIG[state.difficulty];
        
        // 1. Find a suitable main word and its anagrams
        const potentialMainWords = [...state.dictionary].filter(w => w.length === config.mainWordLength);
        let anagrams = [];
        let mainWord = '';
        while (anagrams.length < config.wordsToFind) {
            mainWord = potentialMainWords[Math.floor(Math.random() * potentialMainWords.length)];
            anagrams = findAnagrams(mainWord, state.dictionary);
        }
        state.mainWord = mainWord;

        // 2. Select hidden words
        shuffleArray(anagrams);
        state.hiddenWords = anagrams.slice(0, config.wordsToFind).sort((a, b) => a.length - b.length || a.localeCompare(b));

        // 3. Scramble letters for the pool
        state.scrambledLetters = mainWord.split('');
        shuffleArray(state.scrambledLetters);

        // 4. Reset state
        state.foundWords.clear();
        state.foundBonusWords.clear();
        state.bonusWordsCount = 0;
        state.hintProgress = 0;
        state.gameActive = true;
        clearInput();

        // 5. Render UI
        renderWordGrid();
        renderLetterPool();
        updateCounts();
        updateDevPanel();
        updateHintBar();
        resultModal.style.display = 'none';

        // 6. Start Timer
        state.timeLeft = config.time;
        startTimer();
    }

    // --- RENDERING ---
    function renderWordGrid() {
        wordsGridEl.innerHTML = '';
        state.hiddenWords.forEach(word => {
            const row = document.createElement('div');
            row.className = 'word-row';
            row.dataset.word = word;
            for (let i = 0; i < word.length; i++) {
                const box = document.createElement('div');
                box.className = 'letter-box';
                row.appendChild(box);
            }
            wordsGridEl.appendChild(row);
        });
    }

    function renderLetterPool() {
        letterPoolEl.innerHTML = '';
        state.scrambledLetters.forEach((letter, index) => {
            const tile = document.createElement('button');
            tile.className = 'pool-tile';
            tile.textContent = letter;
            tile.dataset.index = index;
            tile.addEventListener('click', () => handleLetterClick(letter, index));
            letterPoolEl.appendChild(tile);
        });
    }

    function renderInputTiles() {
        inputTilesEl.innerHTML = '';
        state.currentInput.forEach((input, index) => {
            const tile = document.createElement('div');
            tile.className = 'input-tile'; // This is the draggable tile
            tile.textContent = input.letter;
            tile.dataset.index = index;
            tile.setAttribute('draggable', true);

            // Add drag and drop event listeners
            tile.addEventListener('dragstart', dragStart);
            tile.addEventListener('dragend', dragEnd);
            tile.addEventListener('dragover', dragOver);
            tile.addEventListener('drop', dragDrop);

            inputTilesEl.appendChild(tile);
        });
    }

    function updateCounts() {
        const config = GAME_CONFIG[state.difficulty];
        wordsFoundCountEl.textContent = `${state.foundWords.size} / ${config.wordsToFind}`;
        bonusWordsCountEl.textContent = state.bonusWordsCount;
        updateDevPanel();
    }

    function updateHintBar() {
        const segments = hintBarEl.querySelectorAll('.hint-segment');
        segments.forEach((segment, i) => {
            segment.classList.toggle('filled', i < state.hintProgress);
        });
    }

    // --- GAMEPLAY HANDLERS ---
    function handleLetterClick(letter, index) {
        unlockAudio(); // Unlock audio on the first interaction
        if (!state.gameActive) return;
        const tile = letterPoolEl.querySelector(`[data-index="${index}"]`);
        if (tile.classList.contains('used')) return;

        tile.classList.add('used');
        state.currentInput.push({ letter, originalIndex: index });
        renderInputTiles();
        if (sounds.tileClick) sounds.tileClick.play();
    }

    function clearInput() {
        state.currentInput = [];
        renderInputTiles();
        letterPoolEl.querySelectorAll('.pool-tile').forEach(t => t.classList.remove('used'));
    }

    function handleSubmit() {
        if (state.currentInput.length < 3) return;
        const word = state.currentInput.map(i => i.letter).join('');

        if (state.hiddenWords.includes(word)) {
            if (!state.foundWords.has(word)) {
                state.foundWords.add(word);
                revealWordInGrid(word);
                updateCounts();
                updateDevPanel();
                if (sounds.success) sounds.success.play();
                if (state.foundWords.size === state.hiddenWords.length) {
                    endGame(true); // Win
                }
            } else {
                showErrorToast('Already found!');
                if (sounds.error) sounds.error.play();
            }
        } else if (state.dictionary.has(word)) {
            if (!state.foundBonusWords.has(word)) {
                // It's a valid new bonus word
                state.foundBonusWords.add(word);
                state.bonusWordsCount++;
                state.hintProgress += word.length;
                updateCounts();
                checkHint();
                updateDevPanel();
                if (sounds.success) sounds.success.play();
                showSuccessToast('BONUS WORD!');
            } else {
                showErrorToast('Bonus word already used!');
                if (sounds.error) sounds.error.play();
            }
        } else {
            if (sounds.error) sounds.error.play();
            showErrorToast('Not a valid word!');
        }
        clearInput();
    }

    function revealWordInGrid(word) {
        const row = wordsGridEl.querySelector(`[data-word="${word}"]`);
        if (row) {
            const boxes = row.querySelectorAll('.letter-box');
            for (let i = 0; i < word.length; i++) {
                boxes[i].textContent = word[i];
                boxes[i].classList.add('revealed');
            }
        }
    }

    function checkHint() {
        const config = GAME_CONFIG[state.difficulty];
        while (state.hintProgress >= config.hintThreshold) {
            state.hintProgress -= config.hintThreshold;
            revealRandomLetter();
        }
        updateHintBar();
    }

    function revealRandomLetter() {
        const unrevealedWords = state.hiddenWords.filter(w => !state.foundWords.has(w));
        if (unrevealedWords.length === 0) return;

        const wordToHint = unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)];
        const row = wordsGridEl.querySelector(`[data-word="${wordToHint}"]`);
        const boxes = row.querySelectorAll('.letter-box');
        
        const unrevealedIndices = [];
        boxes.forEach((box, i) => {
            if (!box.textContent) unrevealedIndices.push(i);
        });

        if (unrevealedIndices.length > 0) {
            const indexToReveal = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            boxes[indexToReveal].textContent = wordToHint[indexToReveal];
        }
    }

    // --- TIMER & END GAME ---
    function startTimer() {
        clearInterval(state.timer);
        state.timer = setInterval(() => {
            state.timeLeft--;
            const minutes = Math.floor(state.timeLeft / 60);
            const seconds = state.timeLeft % 60;
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            if (state.timeLeft <= 0) {
                endGame(false); // Lose
            }
        }, 1000);
    }

    function endGame(didWin) {
        const EVENT_REWARD = 8;
        clearInterval(state.timer);
        state.gameActive = false;
        resultModal.style.display = 'flex';

        // Hide the "Play Again" button as it's not needed in the main game loop
        playAgainBtn.style.display = 'none';
        continueBtn.textContent = 'CONTINUE';

        // Increment the stage index to move past the event
        if (runState) {
            runState.stageIndex++;
        }

        if (didWin) {
            if (runState) {
                runState.money = (runState.money || 0) + EVENT_REWARD;
            }

            resultTitleEl.textContent = 'SUCCESS!';
            resultTitleEl.className = 'success';
            resultMessageEl.innerHTML = `You found all ${state.hiddenWords.length} words with ${timerEl.textContent} to spare!<br><span class="reward-text">You earned +$${EVENT_REWARD}!</span>`;
        } else {
            resultTitleEl.textContent = 'TIME UP!';
            resultTitleEl.className = 'fail';
            resultMessageEl.textContent = `You found ${state.foundWords.size} out of ${state.hiddenWords.length} words.`;
        }

        // Save the final state after all modifications
        if (runState) {
            saveRunState(runState);
        }
    }

    // --- DRAG & DROP FOR INPUT TILES ---
    function dragStart(e) {
        dragStartIndex = +e.target.dataset.index;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop(e) {
        const dragEndIndex = +e.target.closest('.input-tile').dataset.index;
        swapItems(dragStartIndex, dragEndIndex);
    }

    function swapItems(fromIndex, toIndex) {
        const item = state.currentInput.splice(fromIndex, 1)[0];
        state.currentInput.splice(toIndex, 0, item);
        // Re-render the input tiles to reflect the new order
        renderInputTiles();
    }

    function showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast success-toast'; // Reuse styles, add success class
        toast.textContent = message;
        document.getElementById('error-container').appendChild(toast);
        setTimeout(() => toast.remove(), 1500); // Shorter duration for success
    }

    function showErrorToast(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        document.getElementById('error-container').appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function unlockAudio() {
        if (state.audioUnlocked) return;
        // Howler.js uses a single AudioContext. Resuming it allows all sounds to play.
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume();
        }
        state.audioUnlocked = true;
        console.log('Audio context unlocked for Word Scramble.');
    }

    function updateDevPanel() {
        if (!devScoreDetailsEl) return;
        const found = state.foundWords.size;
        const total = state.hiddenWords.length;
        const hiddenWordsList = state.hiddenWords.join(', ');
        devScoreDetailsEl.textContent = `Main Word: ${state.mainWord}\nFound: ${found}/${total}\nBonus: ${state.bonusWordsCount}\n\nWords: ${hiddenWordsList}`;
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

    function handleSkip() {
        const skipCost = 10;
        if (runState.money < skipCost) {
            showErrorToast("Not enough money to skip!");
            return;
        }

        // Deduct cost, advance stage, save, and navigate
        runState.money -= skipCost;
        runState.stageIndex++;
        saveRunState(runState);

        window.location.href = 'between-rounds.html';
    }

    // --- EVENT LISTENERS ---
    shuffleBtn.addEventListener('click', () => {
        if (!state.gameActive) return;
        shuffleArray(state.scrambledLetters);
        renderLetterPool();
        clearInput();
    });
    clearBtn.addEventListener('click', () => {
        if (state.gameActive) {
            clearInput();
            if (sounds.tileClick) sounds.tileClick.play();
        }
    });
    submitBtn.addEventListener('click', () => {
        if (state.gameActive) handleSubmit();
    });
    skipBtn.addEventListener('click', handleSkip);

    playAgainBtn.addEventListener('click', setupGame);
    continueBtn.addEventListener('click', () => {
        // Always return to the between-rounds screen to continue the run
        window.location.href = 'between-rounds.html';
    });

    // --- INITIALIZE ---
    init();
    initializePageDevControls();
});