// Minimal placeholder gameplay logic to render a 4x4 grid and basic interactions
const gridEl = document.getElementById('tileGrid');
const chipsEl = document.getElementById('scoreChips');
const baseScoreEl = document.getElementById('baseScore');
const roundScoreEl = document.getElementById('roundScore');
const targetScoreEl = document.getElementById('targetScore');
const progressBarEl = document.getElementById('progressBar');
const wordsRemainingEl = document.getElementById('wordsRemaining');

// Bag Modal Element Selectors
const bagModalOverlay = document.getElementById('bagModalOverlay');
const closeBagBtn = document.getElementById('btnCloseBagModal');
const bagGrid = document.getElementById('bagGrid');
const sortControls = document.querySelector('.sort-controls');

// Tile Distribution and Point Values
const TILE_DISTRIBUTION = 'EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTDDDDLLLLSSSSUUUUGGGBBCCFFHHMMPPVVWWYYJKQXZ__'.split('');
const TILE_VALUES = {
    A: 1, E: 1, I: 1, L: 1, N: 1, O: 1, R: 1, S: 1, T: 1, U: 1,
    D: 2, G: 2,
    B: 3, C: 3, M: 3, P: 3,
    F: 4, H: 4, V: 4, W: 4, Y: 4,
    K: 5,
    J: 8, X: 8,
    Q: 10, Z: 10,
    _: 0
};

let dictionary = [];
let tilePool = [];
let dragStartIndex;

// Bag Modal State
let currentBagSort = 'alpha';
let bagTiles = [];


// --- UTILITY FUNCTIONS ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadDictionary() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/North-American/NWL2020.txt');
        const text = await response.text();
        dictionary = text.split('\n').slice(2).map(line => line.split(/[\s\t]/)[0].trim().toUpperCase());
        console.log('Official Scrabble dictionary loaded successfully.');
    } catch (error) {
        console.error('Failed to load Scrabble dictionary:', error);
        // Fallback to a small dictionary in case of an error
        dictionary = ['EAT', 'CAT', 'DOG', 'BAT', 'RAT', 'MAT', 'HAT', 'SAT', 'PAT', 'FAT', 'VAT', 'BAG', 'TAG', 'RAG', 'SAG', 'WAG', 'LAG', 'NAG', 'DAG', 'GAG', 'HAG', 'BIG', 'DIG', 'FIG', 'GIG', 'JIG', 'PIG', 'RIG', 'WIG', 'ZIG', 'BOG', 'COG', 'FOG', 'HOG', 'JOG', 'LOG', 'NOG', 'TOG', 'WOG', 'BED', 'FED', 'LED', 'RED', 'TED', 'WED', 'ZED', 'BID', 'DID', 'FID', 'HID', 'KID', 'LID', 'MID', 'RID', 'SID', 'TID', 'VID', 'WID', 'ZID', 'BET', 'GET', 'JET', 'LET', 'MET', 'NET', 'PET', 'SET', 'VET', 'WET', 'BEN', 'DEN', 'FEN', 'GEN', 'HEN', 'KEN', 'LEN', 'MEN', 'PEN', 'REN', 'SEN', 'TEN', 'VEN', 'WEN', 'YEN', 'ZEN', 'BIN', 'DIN', 'FIN', 'GIN', 'HIN', 'JIN', 'KIN', 'LIN', 'MIN', 'PIN', 'RIN', 'SIN', 'TIN', 'VIN', 'WIN', 'YIN', 'ZIN', 'BON', 'CON', 'DON', 'FON', 'GON', 'HON', 'JON', 'KON', 'LON', 'MON', 'NON', 'PON', 'RON', 'SON', 'TON', 'VON', 'WON', 'YON', 'ZON', 'BOP', 'COP', 'DOP', 'FOP', 'GOP', 'HOP', 'JOP', 'LOP', 'MOP', 'NOP', 'POP', 'ROP', 'SOP', 'TOP', 'VOP', 'WOP', 'YOP', 'ZOP', 'BOW', 'COW', 'DOW', 'FOW', 'GOW', 'HOW', 'JOW', 'LOW', 'MOW', 'NOW', 'POW', 'ROW', 'SOW', 'TOW', 'VOW', 'WOW', 'YOW', 'ZOW', 'BOX', 'COX', 'DOX', 'FOX', 'GOX', 'HOX', 'JOX', 'LOX', 'MOX', 'NOX', 'POX', 'ROX', 'SOX', 'TOX', 'VOX', 'WOX', 'YOX', 'ZOX', 'BOY', 'COY', 'DOY', 'FOY', 'GOY', 'HOY', 'JOY', 'LOY', 'MOY', 'NOY', 'POY', 'ROY', 'SOY', 'TOY', 'VOY', 'WOY', 'YOY', 'ZOY', 'BUZ', 'CUZ', 'DUZ', 'FUZ', 'GUZ', 'HUZ', 'JUZ', 'LUZ', 'MUZ', 'NUZ', 'PUZ', 'RUZ', 'SUZ', 'TUZ', 'VUZ', 'WUZ', 'YUZ', 'ZUZ', 'BAB', 'CAB', 'DAB', 'FAB', 'GAB', 'HAB', 'JAB', 'LAB', 'MAB', 'NAB', 'PAB', 'RAB', 'SAB', 'TAB', 'VAB', 'WAB', 'YAB', 'ZAB', 'QUARK', 'QUART', 'QUICK', 'QUIET', 'QUILT', 'QUIZ', 'QUOTE', 'QUEEN', 'QUEST', 'QUERY', 'QUAKE', 'QUALM', 'QUASH', 'QUAIL', 'QUARTZ', 'QUIVER'];
    }
}

// --- GAME STATE & LOGIC ---
const state = {
    selected: [],
    roundScore: 0,
    target: 450,
    wordsRemaining: 5,
    discards: 5,
    money: 4,
};

function drawTile() {
    if (tilePool.length === 0) {
        console.log("Tile pool is empty!");
        return '_'; // Return a blank tile if the pool is empty
    }
    return tilePool.pop();
}

function generateGrid() {
    gridEl.innerHTML = '';
    for (let idx = 0; idx < 16; idx++) {
        const letter = drawTile();
        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.dataset.index = String(idx);
        tile.dataset.letter = letter;
        tile.setAttribute('aria-pressed', 'false');

        const displayLetter = letter === 'Q' ? 'Qu' : letter === '_' ? '' : letter;
        tile.innerHTML = `${displayLetter}<span class="val">${TILE_VALUES[letter]}</span>`;
        tile.addEventListener('click', () => toggleTile(idx, tile));
        gridEl.appendChild(tile);
    }
}

function repopulateGrid(usedTiles) {
    usedTiles.forEach(usedTile => {
        const newLetter = drawTile();
        const tileElement = gridEl.querySelector(`[data-index="${usedTile.index}"]`);
        if (tileElement) {
            const displayLetter = newLetter === 'Q' ? 'Qu' : newLetter === '_' ? '' : newLetter;
            tileElement.innerHTML = `${displayLetter}<span class="val">${TILE_VALUES[newLetter]}</span>`;
            tileElement.dataset.letter = newLetter; // Update the letter in the dataset
        }
    });
}


function toggleTile(index, el) {
    const letter = el.dataset.letter;
    const foundIndex = state.selected.findIndex(s => s.index === index);

    if (foundIndex >= 0) {
        // This part handles deselecting a tile from the main grid
        state.selected.splice(foundIndex, 1);
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
    } else {
        // This part handles selecting a new tile
        state.selected.push({ index, letter });
        el.classList.add('selected');
        el.setAttribute('aria-pressed', 'true');
    }
    renderChips();
}

function deselectChip(selectedIndex) {
    // Find the chip to be removed from the selection
    const itemToDeselect = state.selected[selectedIndex];
    
    // Find the corresponding tile on the main grid and visually deselect it
    const gridTileEl = gridEl.querySelector(`[data-index="${itemToDeselect.index}"]`);
    if (gridTileEl) {
        gridTileEl.classList.remove('selected');
        gridTileEl.setAttribute('aria-pressed', 'false');
    }

    // Remove the chip from the state and re-render the scoring area
    state.selected.splice(selectedIndex, 1);
    renderChips();
}


function playWord() {
    if (state.selected.length < 3) {
        showError('MINIMUM 3 LETTERS');
        shakeScreen();
        return;
    }

    const word = state.selected.map(s => s.letter).join('');
    const validatedWord = validateWord(word);

    if (!validatedWord) {
        showError('TRY AGAIN');
        shakeScreen();
        return;
    }

    // Valid word found
    const score = calculateWordScore(word);
    state.roundScore += score;
    state.wordsRemaining--;
    wordsRemainingEl.textContent = state.wordsRemaining;
    const usedTilesInfo = [...state.selected];

    // Clear selection from state and UI
    clearSelection();

    // Repopulate the grid where the used tiles were
    repopulateGrid(usedTilesInfo);

    // Update score displays
    updateRoundUI();

    // Show success feedback with the actual word and score
    showSuccess(validatedWord, score);

    if (state.wordsRemaining === 0) {
        gameOver();
    }
}


function clearSelection() {
    state.selected = [];
    document.querySelectorAll('.tile.selected').forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('aria-pressed', 'false');
    });
    renderChips();
}

function gameOver() {
    // A simple placeholder for a game over message
    setTimeout(() => {
        alert("Game Over!");
    }, 1000); // Delay to allow the success message to be seen
}

// --- UI, DRAGGING, & VALIDATION ---

function renderChips() {
    chipsEl.innerHTML = '';
    let base = 0;

    state.selected.forEach((s, index) => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.setAttribute('draggable', true);
        chip.dataset.selectedIndex = index;

        const displayLetter = s.letter === 'Q' ? 'Qu' : s.letter === '_' ? '' : s.letter;
        chip.innerHTML = `${displayLetter}<span class="v">${TILE_VALUES[s.letter]}</span>`;
        
        // Add event listener to deselect by clicking the chip
        chip.addEventListener('click', () => deselectChip(index));

        // Add drag and drop event listeners
        chip.addEventListener('dragstart', dragStart);
        chip.addEventListener('dragend', dragEnd);
        chip.addEventListener('dragover', dragOver);
        chip.addEventListener('drop', dragDrop);

        chipsEl.appendChild(chip);
        base += TILE_VALUES[s.letter];
    });

    baseScoreEl.textContent = String(base);
}

// --- Drag and Drop Functions ---
function dragStart(e) {
    dragStartIndex = +e.target.dataset.selectedIndex;
    // Add a class to give visual feedback for the item being dragged
    setTimeout(() => e.target.classList.add('dragging'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault(); // This is necessary to allow a drop
}

function dragDrop(e) {
    const dragEndIndex = +e.target.closest('.chip').dataset.selectedIndex;
    swapItems(dragStartIndex, dragEndIndex);
    // Remove dragging class from all elements to be safe
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('dragging'));
}

function swapItems(fromIndex, toIndex) {
    // Remove the dragged item from its original position
    const item = state.selected.splice(fromIndex, 1)[0];
    // Insert the dragged item at the new position
    state.selected.splice(toIndex, 0, item);
    // Re-render the chips to reflect the new order
    renderChips();
}


function updateRoundUI() {
    roundScoreEl.textContent = String(state.roundScore);
    targetScoreEl.textContent = String(state.target);
    const pct = Math.max(0, Math.min(1, state.roundScore / state.target));
    progressBarEl.style.width = `${Math.round(pct*100)}%`;
}

function validateWord(word) {
    // If the word has no blanks, check it directly and return the word if valid
    if (!word.includes('_')) {
        const formattedWord = (word.includes('Q') ? word.replace(/Q/g, 'QU') : word).toUpperCase();
        return dictionary.includes(formattedWord) ? formattedWord : false;
    } else {
        // If it has blanks, use the recursive checker which will return the valid word
        return checkBlankWord(word);
    }
}

function checkBlankWord(wordWithBlanks) {
    const blankIndex = wordWithBlanks.indexOf('_');
    // Base case: if there are no more blanks, check if this version is a valid word
    if (blankIndex === -1) {
        const formattedWord = (wordWithBlanks.includes('Q') ? wordWithBlanks.replace(/Q/g, 'QU') : wordWithBlanks).toUpperCase();
        return dictionary.includes(formattedWord) ? formattedWord : false;
    }
    // Recursive step: try every letter for the current blank
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const newWord = wordWithBlanks.substring(0, blankIndex) + letter + wordWithBlanks.substring(blankIndex + 1);
        // Recurse to handle remaining blanks or check the final word
        const result = checkBlankWord(newWord);
        if (result) {
            return result; // A valid word was found, return it
        }
    }
    return false; // No valid word could be formed
}


function calculateWordScore(word) {
    return word.split('').reduce((score, letter) => score + TILE_VALUES[letter], 0);
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #ff5f4f; color: white; padding: 20px 30px; border-radius: 16px;
        font-family: m6x11plus; font-size: 24px; font-weight: bold; z-index: 10000;
        box-shadow: 0 8px 0 rgba(0,0,0,.5); animation: errorShake 0.5s ease-in-out;`;
    document.body.appendChild(errorEl);
    setTimeout(() => { errorEl.remove(); }, 2000);
}

function showSuccess(word, score) {
    const successEl = document.createElement('div');
    successEl.className = 'success-container';

    const wordEl = document.createElement('div');
    wordEl.className = 'success-word';
    wordEl.textContent = `${word} +${score}`; // Display the validated word and score
    
    successEl.appendChild(wordEl);
    document.body.appendChild(successEl);
    
    createParticles(successEl);

    // Remove the element after the animation is well and truly over
    setTimeout(() => {
        successEl.remove();
    }, 1000); 
}

function createParticles(container) {
    const particleCount = 20; // The number of particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const x = (Math.random() - 0.5) * 200; // Random horizontal destination
        const y = (Math.random() - 0.5) * 200; // Random vertical destination
        const duration = 300 + Math.random() * 200; // Randomize duration slightly
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        particle.style.animation = `explode ${duration}ms ease-out forwards`;
        container.appendChild(particle);
    }
}


function shakeScreen() {
    const screen = document.querySelector('.screen');
    screen.style.animation = 'screenShake 0.5s ease-in-out';
    setTimeout(() => { screen.style.animation = ''; }, 500);
}

// --- BAG MODAL FUNCTIONS ---

function openBagModal() {
    bagTiles = [...tilePool]; // Create a copy of the remaining tiles in the pool
    sortBagTiles(currentBagSort, false); // Apply current sort without re-rendering yet
    renderBagTiles();
    bagModalOverlay.style.display = 'flex';
}

function closeBagModal() {
    bagModalOverlay.style.display = 'none';
}

function sortBagTiles(sortBy, shouldRender = true) {
    currentBagSort = sortBy;

    // Update the active class on the sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortBy);
    });

    if (sortBy === 'alpha') {
        bagTiles.sort((a, b) => a.localeCompare(b));
    } else if (sortBy === 'value') {
        // Sort by value descending, then by letter ascending for ties
        bagTiles.sort((a, b) => TILE_VALUES[b] - TILE_VALUES[a] || a.localeCompare(b));
    } else if (sortBy === 'type') {
        // This is a placeholder as requested. For now, it defaults to alphabetical.
        // You could later sort by Vowel vs. Consonant here.
        bagTiles.sort((a, b) => a.localeCompare(b));
    }
    
    if (shouldRender) {
        renderBagTiles();
    }
}

function renderBagTiles() {
    bagGrid.innerHTML = ''; // Clear previous tiles
    bagTiles.forEach(letter => {
        const tile = document.createElement('div');
        tile.className = 'bag-tile';

        const displayLetter = letter === 'Q' ? 'Qu' : letter === '_' ? '' : letter;
        tile.innerHTML = `${displayLetter}<span class="val">${TILE_VALUES[letter]}</span>`;
        
        bagGrid.appendChild(tile);
    });
}


// --- EVENT LISTENERS & INITIALIZATION ---
document.getElementById('btnClear').addEventListener('click', clearSelection);
document.getElementById('btnOptions').addEventListener('click', () => alert('Options placeholder'));
document.getElementById('btnPlay').addEventListener('click', playWord);

// Bag Modal Listeners
document.getElementById('btnBag').addEventListener('click', openBagModal);
closeBagBtn.addEventListener('click', closeBagModal);
bagModalOverlay.addEventListener('click', (e) => {
    // Close if the user clicks the overlay background, but not the modal content
    if (e.target === bagModalOverlay) {
        closeBagModal();
    }
});
sortControls.addEventListener('click', (e) => {
    const sortBtn = e.target.closest('.sort-btn');
    if (sortBtn && sortBtn.dataset.sort) {
        sortBagTiles(sortBtn.dataset.sort);
    }
});


function initGooglyEyes() {
    const bossPortrait = document.querySelector('.boss-portrait');
    const pupils = document.querySelectorAll('.pupil');
    if (!bossPortrait || pupils.length === 0) return;

    document.addEventListener('mousemove', (e) => {
        const rect = bossPortrait.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 2;

        if (distance > 0) {
            const normalizedX = deltaX / distance;
            const normalizedY = deltaY / distance;
            const moveX = Math.min(Math.abs(normalizedX * maxDistance), maxDistance) * Math.sign(normalizedX);
            const moveY = Math.min(Math.abs(normalizedY * maxDistance), maxDistance) * Math.sign(normalizedY);
            pupils.forEach(pupil => {
                pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
            });
        }
    });

    document.addEventListener('mouseleave', () => {
        pupils.forEach(pupil => { pupil.style.transform = 'translate(-50%, -50%)'; });
    });
}

async function init() {
    // 1. Create and shuffle the tile pool for the game session
    tilePool = [...TILE_DISTRIBUTION];
    shuffleArray(tilePool);

    // 2. Load the dictionary
    await loadDictionary();

    // 3. Generate the initial grid from the pool
    generateGrid();

    // 4. Initialize UI components
    renderChips();
    updateRoundUI();
    initGooglyEyes();
}

// Start the game
init();