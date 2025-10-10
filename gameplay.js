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

// New round-based score targets
const ROUND_TARGETS = [20, 50, 125, 300, 650, 1200, 2100, 3000];

// New word length multipliers
const WORD_LENGTH_MULTIPLIERS = {
    6: 1.5,  7: 2,    8: 2.75, 9: 3.5,
    10: 4.5, 11: 5.5,  12: 6.75, 13: 8,
    14: 9.5, 15: 11,   16: 13,
};

let dictionary = [];
let dragStartIndex;

// --- GAME STATE & LOGIC ---
const state = {
    tilePool: [],
    bagTiles: [],
    currentBagSort: 'alpha',
    round: 1, // Start at round 1
    audioUnlocked: false,
};

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

function drawTile() {
    // Use state.tilePool instead of global tilePool
    if (state.tilePool.length === 0) {
        console.log("Tile pool is empty!");
        return '_'; // Return a blank tile if the pool is empty
    }
    return state.tilePool.pop();
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

        // --- MODIFIER ASSIGNMENT ---
        // Placeholder for modifier logic. Here, we'll give a 15% chance for a tile to be Enhanced.
        if (Math.random() < 0.15) {
            // For now, we only have one type of enhancement: Booster
            tile.dataset.modifier = 'enhanced';
            tile.dataset.modifierType = 'booster';
            tile.classList.add('enhanced-booster');
        }
        // Future modifier classes can be added here:
        // else if (Math.random() < 0.1) {
        //   tile.dataset.modifier = 'seal';
        //   tile.dataset.modifierType = '...';
        //   tile.classList.add('seal-...');
        // }

        // Create a new wrapper for animation to avoid conflicts with JS transform
        const tileAnimator = document.createElement('div');
        tileAnimator.className = 'tile-animator';

        // Create an inner wrapper for the content and gelatine effect
        const tileContent = document.createElement('div');
        tileContent.className = 'tile-content';

        const displayLetter = letter === 'Q' ? 'Qu' : letter === '_' ? '' : letter;
        tileContent.innerHTML = `${displayLetter}<span class="val">${TILE_VALUES[letter]}</span>`;
        tileAnimator.appendChild(tileContent);
        tile.appendChild(tileAnimator);
        tile.addEventListener('click', () => toggleTile(idx, tile));
        gridEl.appendChild(tile);
    }
    initTileHoverEffects(); // Add this call to initialize the new hover effects
}

function repopulateGrid(usedTiles) {
    usedTiles.forEach(usedTile => {
        const newLetter = drawTile();
        const tileElement = gridEl.querySelector(`[data-index="${usedTile.index}"]`);
        if (tileElement) {
            // Clear old modifiers and classes
            tileElement.className = 'tile'; // Reset classes
            delete tileElement.dataset.modifier;
            delete tileElement.dataset.modifierType;

            // Add a chance for the new tile to have a modifier
            if (Math.random() < 0.15) {
                tileElement.dataset.modifier = 'enhanced';
                tileElement.dataset.modifierType = 'booster';
                tileElement.classList.add('enhanced-booster');
            }

            const tileContent = tileElement.querySelector('.tile-content'); // This still works as it's the innermost element
            const displayLetter = newLetter === 'Q' ? 'Qu' : newLetter === '_' ? '' : newLetter;
            // Update the content of the inner wrapper
            tileContent.innerHTML = `${displayLetter}<span class="val">${TILE_VALUES[newLetter]}</span>`;
            tileElement.dataset.letter = newLetter;
        }
    });
}


function toggleTile(index, el) {
    const letter = el.dataset.letter;
    const modifier = el.dataset.modifier;
    const modifierType = el.dataset.modifierType;
    const foundIndex = state.selected.findIndex(s => s.index === index);

    if (foundIndex >= 0) {
        // This part handles deselecting a tile from the main grid
        state.selected.splice(foundIndex, 1);
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
    } else {
        // This part handles selecting a new tile
        state.selected.push({ index, letter, modifier, modifierType });
        createConfetti(el); // Trigger confetti effect on selection
        el.classList.add('selected');
        el.setAttribute('aria-pressed', 'true');
        if (sounds.tileClick) sounds.tileClick.play(); // Play click sound
        unlockAudio(); // Ensure audio is unlocked on the first click
    }
    renderChips();
    updateDevScorePanel();
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
    updateDevScorePanel();
}


async function playWord() {
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

    // --- New Animation Logic ---
    // Get the chips before they are cleared from the DOM
    const chipsToAnimate = document.querySelectorAll('#scoreChips .chip');
    const animationDuration = 400; // Must match CSS animation duration
    const staggerDelay = 75;       // Time between each chip animation start

    // Animate each chip in sequence
    for (let i = 0; i < chipsToAnimate.length; i++) {
        const chip = chipsToAnimate[i];
        setTimeout(() => {
            chip.classList.add('slamming');
        }, i * staggerDelay);
    }

    // Calculate total time needed for the animation to complete
    const totalAnimationTime = (chipsToAnimate.length - 1) * staggerDelay + animationDuration;
    await new Promise(resolve => setTimeout(resolve, totalAnimationTime));
    // --- End of Animation Logic ---

    // Now, proceed with the rest of the game logic
    const score = calculateWordScore(state.selected);
    state.roundScore += score;
    state.wordsRemaining--;

    // Track best word for the round
    if (score > state.bestWord.score) {
        state.bestWord = { word: validatedWord, score: score };
    }

    wordsRemainingEl.textContent = state.wordsRemaining;
    const usedTilesInfo = [...state.selected];

    showSuccess(validatedWord, score); // Show success message
    clearSelection();
    repopulateGrid(usedTilesInfo);
    updateRoundUI();

    // Check for win/loss conditions after every successful word
    if (state.roundScore >= state.target || state.wordsRemaining === 0) {
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
    updateDevScorePanel();
}

function gameOver() {
    // Check for win/loss condition
    const didWin = state.roundScore >= state.target;

    if (didWin) {
        // Delay showing the victory screen to let the last success message fade
        setTimeout(showVictoryScreen, 1200);
    } else {
        // Show the defeat screen
        setTimeout(showDefeatScreen, 1200);
    }
}

function showDefeatScreen() {
    const overlay = document.getElementById('defeatModalOverlay');
    if (!overlay) return;

    // Populate the stats
    document.getElementById('defeatBestWord').textContent = state.bestWord.word ? `${state.bestWord.word} (+${state.bestWord.score})` : 'N/A';
    document.getElementById('defeatWordsPlayed').textContent = `${5 - state.wordsRemaining} / 5`; // Assumes 5 words to start
    document.getElementById('defeatRound').textContent = document.getElementById('roundValue').textContent;
    document.getElementById('defeatReason').textContent = 'Out of words'; // Can be made more dynamic later

    overlay.style.display = 'flex';

    // Wire up buttons
    const newRunBtn = document.getElementById('defeatNewRun');
    const mainMenuBtn = document.getElementById('defeatMainMenu');

    newRunBtn.onclick = () => {
        overlay.style.display = 'none';
        state.round = 1; // Reset to round 1 for a new run
        init(); // Start a new run
    };
    mainMenuBtn.onclick = () => {
        // Navigate to the main menu
        window.location.href = 'index.html';
    }
}

function showVictoryScreen() {
    const overlay = document.getElementById('victoryModalOverlay');
    const wordsCountEl = document.getElementById('victoryWordsCount');
    const wordsValueEl = document.getElementById('victoryWordsValue');
    const bossValueEl = document.getElementById('victoryBossValue');
    const cashOutBtn = document.getElementById('victoryCashOutBtn');

    // --- Calculate Bonuses ---
    // For now, boss bonus is a flat rate. This can be made dynamic later.
    const bossBonus = 3; 
    const wordsBonus = state.wordsRemaining * 2;
    const totalWinnings = bossBonus + wordsBonus;

    // Update player's total money
    state.money += totalWinnings; 

    // --- Populate Modal UI ---
    wordsCountEl.textContent = state.wordsRemaining;
    wordsValueEl.textContent = `+$${wordsBonus}`;
    bossValueEl.textContent = `+$${bossBonus}`;
    cashOutBtn.textContent = `CASH OUT: $${totalWinnings}`;

    overlay.style.display = 'flex';

    // Add a one-time listener to the cash out button
    cashOutBtn.onclick = () => {
        overlay.style.display = 'none';
        // Navigate to the shop screen
        window.location.href = 'shop.html';
    };
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
    updateDevScorePanel();
}


function updateRoundUI() {
    roundScoreEl.textContent = String(state.roundScore);
    targetScoreEl.textContent = String(state.target);
    const pct = Math.max(0, Math.min(1, state.roundScore / state.target));
    progressBarEl.style.width = `${Math.round(pct*100)}%`;
}

function validateWord(word) {
    // If the word has no blanks, check it directly and return the word if valid
    const formattedWord = (word.includes('Q') ? word.replace(/Q/g, 'QU') : word).toUpperCase();
    if (!word.includes('_')) {
        return dictionary.includes(formattedWord) ? formattedWord : false;
    }

    // For words with blanks, create a regex and find the first match in the dictionary.
    // This is much more performant than recursive checks for each letter.
    const regexPattern = '^' + formattedWord.replace(/_/g, '[A-Z]') + '$';
    const regex = new RegExp(regexPattern);

    // Find the first word in the dictionary that matches the pattern
    const foundWord = dictionary.find(dictWord => regex.test(dictWord));

    return foundWord || false;
}

function calculateWordScore(selectedTiles) {
    let score = 0;
    const wordLength = selectedTiles.length;

    // Calculate base score from letters
    selectedTiles.forEach(tile => {
        score += TILE_VALUES[tile.letter] || 0;

        // --- MODIFIER EFFECT LOGIC ---
        // Apply bonus points for specific modifiers
        if (tile.modifier === 'enhanced') {
            if (tile.modifierType === 'booster') {
                score += 5; // Add +5 for the Booster effect
            }
        }
        // Future modifier effects can be added here
    });

    // Apply word length multiplier
    const lengthMultiplier = WORD_LENGTH_MULTIPLIERS[wordLength] || 1;
    score *= lengthMultiplier;

    return score;
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
        animation: errorShake 0.5s ease-in-out;`;
    document.body.appendChild(errorEl);
    if (sounds.error) sounds.error.play(); // Play error sound
    setTimeout(() => { errorEl.remove(); }, 2000);
}

function showSuccess(word, score) {
    const successEl = document.createElement('div');
    successEl.className = 'success-container';

    const wordEl = document.createElement('div');
    wordEl.className = 'success-word';
    wordEl.textContent = `${word} +${score}`; // Display the validated word and score
    
    // --- Create and add sparkles ---
    const sparklePositions = [
        { x: 0, y: 20, s: 1.1, d: 1 },
        { x: 15, y: 80, s: 1.25, d: 2 },
        { x: 45, y: 40, s: 1.1, d: 3 },
        { x: 75, y: 60, s: 0.9, d: 2 },
        { x: 100, y: 30, s: 0.8, d: 4 },
    ];
    const sparklePath = "M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z";

    sparklePositions.forEach(pos => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 96 96");
        svg.setAttribute("fill", "none");
        svg.innerHTML = `<path d="${sparklePath}" fill="white"/>`;
        svg.style.setProperty('--x', pos.x);
        svg.style.setProperty('--y', pos.y);
        svg.style.setProperty('--s', pos.s);
        svg.style.setProperty('--d', pos.d);
        wordEl.appendChild(svg);
    });

    successEl.appendChild(wordEl);
    document.body.appendChild(successEl);
    
    if (sounds.success) sounds.success.play(); // Play success sound
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

function createConfetti(element) {
    // Get the position of the clicked tile to originate the particles from
    const rect = element.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const particleCount = 15 + Math.floor(Math.random() * 10); // Randomize count (15-24)
    const colors = ['#fd8c1f', '#ff5f4f', '#1f8df2', '#56a67a', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        
        // Start particles at the center of the clicked element
        confetti.style.left = `${originX}px`;
        confetti.style.top = `${originY}px`;
        
        // Randomize properties for each particle
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;
        
        const angle = Math.random() * 360;
        const distance = 60 + Math.random() * 60; // Fly out 60px to 120px
        const translateX = Math.cos(angle * Math.PI / 180) * distance;
        const translateY = Math.sin(angle * Math.PI / 180) * distance;
        const rotation = Math.random() * 720 - 360; // Random rotation
        const duration = 600 + Math.random() * 400; // Random duration

        // Set CSS variables for the animation
        confetti.style.setProperty('--x', `${translateX}px`);
        confetti.style.setProperty('--y', `${translateY}px`);
        confetti.style.setProperty('--r', `${rotation}deg`);
        
        document.body.appendChild(confetti);
        // Remove the particle after its animation is complete
        setTimeout(() => confetti.remove(), duration);
    }
}

function shakeScreen() {
    const screen = document.querySelector('.screen');
    screen.style.animation = 'screenShake 0.5s ease-in-out';
    setTimeout(() => { screen.style.animation = ''; }, 500);
}

// --- BAG MODAL FUNCTIONS ---

function openBagModal() {
    const tilesRemainingInfo = document.getElementById('tilesRemainingInfo');
    if (tilesRemainingInfo) {
        tilesRemainingInfo.textContent = `Tiles remaining: ${state.tilePool.length}`;
    }

    state.bagTiles = [...state.tilePool]; // Create a copy of the remaining tiles in the pool
    sortBagTiles(state.currentBagSort, false); // Apply current sort without re-rendering yet
    renderBagTiles();
    bagModalOverlay.style.display = 'flex';
}

function closeBagModal() {
    bagModalOverlay.style.display = 'none';
}

function sortBagTiles(sortBy, shouldRender = true) {
    state.currentBagSort = sortBy;

    // Update the active class on the sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortBy);
    });

    if (sortBy === 'alpha') {
        state.bagTiles.sort((a, b) => a.localeCompare(b));
    } else if (sortBy === 'value') {
        // Sort by value descending, then by letter ascending for ties
        state.bagTiles.sort((a, b) => TILE_VALUES[b] - TILE_VALUES[a] || a.localeCompare(b));
    } else if (sortBy === 'type') {
        // This is a placeholder as requested. For now, it defaults to alphabetical.
        // You could later sort by Vowel vs. Consonant here.
        state.bagTiles.sort((a, b) => a.localeCompare(b));
    }
    
    if (shouldRender) {
        renderBagTiles();
    }
}

function renderBagTiles() {
    bagGrid.innerHTML = ''; // Clear previous tiles
    state.bagTiles.forEach(letter => {
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

function updateDevScorePanel() {
    const detailsEl = document.getElementById('devScoreDetails');
    if (!detailsEl) return;

    if (state.selected.length === 0) {
        detailsEl.textContent = 'Select tiles...';
        return;
    }

    let breakdown = '';
    let baseScore = 0;

    state.selected.forEach(tile => {
        const letter = tile.letter;
        const baseValue = TILE_VALUES[letter] || 0;
        let line = `${letter}: ${baseValue} pts`;
        baseScore += baseValue;

        if (tile.modifier === 'enhanced' && tile.modifierType === 'booster') {
            line += ' (+5 Booster)';
            baseScore += 5;
        }
        breakdown += line + '\n';
    });

    const wordLength = state.selected.length;
    const lengthMultiplier = WORD_LENGTH_MULTIPLIERS[wordLength] || 1;
    if (lengthMultiplier > 1) {
        breakdown += `Length Bonus (x${lengthMultiplier})\n`;
    }

    const finalScore = Math.round(calculateWordScore(state.selected));
    detailsEl.textContent = `${breakdown}------------------\nTotal: ${finalScore} pts`;
}

function initDevControls() {
    const devRefreshBtn = document.getElementById('devRefresh');
    const devWinBtn = document.getElementById('devWin');
    const devLoseBtn = document.getElementById('devLose');
    const devNavMenuBtn = document.getElementById('devNavMenu');
    const devNavGameBtn = document.getElementById('devNavGame');
    const devNavShopBtn = document.getElementById('devNavShop');
    const devNavEventBtn = document.getElementById('devNavEvent');
    const devNavWordleBtn = document.createElement('button');


    if (!devRefreshBtn) return; // Assume panel doesn't exist if one button is missing

    // Refresh Board: Simply call generateGrid to create a new set of tiles.
    devRefreshBtn.addEventListener('click', () => {
        clearSelection();
        generateGrid();
    });

    // Auto Win: Set the score to the target and call gameOver.
    devWinBtn.addEventListener('click', () => {
        state.roundScore = state.target;
        updateRoundUI();
        gameOver();
    });

    // Auto Lose: Set words remaining to 0 and call gameOver.
    devLoseBtn.addEventListener('click', () => {
        state.wordsRemaining = 0;
        updateRoundUI();
        gameOver();
    });

    // Navigate to the main menu
    devNavMenuBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Reload the gameplay screen
    devNavGameBtn.addEventListener('click', () => {
        window.location.reload();
    });

    // Navigate to the shop screen
    devNavShopBtn.addEventListener('click', () => {
        window.location.href = 'shop.html';
    });

    // Navigate to the event screen
    devNavEventBtn.addEventListener('click', () => {
        window.location.href = 'event.html';
    });

    // Add a new button for the Wordle event specifically
    devNavWordleBtn.id = 'devNavWordle';
    devNavWordleBtn.textContent = 'Wordle Event';
    devNavEventBtn.after(devNavWordleBtn); // Place it after the generic event button
    devNavWordleBtn.addEventListener('click', () => {
        window.location.href = 'wordle.html';
    });
}

function initAudioUnlock() {
    const unlock = () => {
        if (state.audioUnlocked || !Howler.ctx) return;
        if (Howler.ctx.state === 'suspended') {
            Howler.ctx.resume();
        }
        state.audioUnlocked = true;
        // Once unlocked, we don't need these listeners anymore.
        document.body.removeEventListener('click', unlock);
        document.body.removeEventListener('touchend', unlock);
    };
    document.body.addEventListener('click', unlock);
    document.body.addEventListener('touchend', unlock);
}

function unlockAudio() {
    if (state.audioUnlocked) return;
    // Howler.js uses a single AudioContext. Resuming it allows all sounds to play.
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
    }
    state.audioUnlocked = true;
    console.log('Audio context unlocked.');
}

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

function initTileHoverEffects() {
    const tiles = document.querySelectorAll('.tile');
    const MAX_ROTATION = 12; // Exaggerated rotation for a more dramatic tilt.
    // The scale is now handled in CSS via the .hovering class
    const HOVER_TRANSLATE_Z = 40; // Increased "spring up" distance.

    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            // Add the hovering class to trigger the wobble animation and base scale.
            if (sounds.tileHover) sounds.tileHover.play();
            tile.classList.add('hovering');
        });

        tile.addEventListener('mousemove', (e) => {
            if (!tile.classList.contains('hovering')) return;

            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate the rotation amount based on mouse position relative to the center
            const rotateY = ((x - centerX) / centerX) * MAX_ROTATION;
            const rotateX = -1 * ((y - centerY) / centerY) * MAX_ROTATION;

            // Apply a transform to lift and rotate the tile. Scale is handled by CSS.
            tile.style.transform = `perspective(1000px) translateZ(${HOVER_TRANSLATE_Z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            tile.style.zIndex = '10';
        });

        tile.addEventListener('mouseleave', () => {
            // Remove the class to stop the wobble and reset the scale
            tile.classList.remove('hovering');
            // Reset the transform and z-index smoothly
            tile.style.transform = `perspective(1000px) translateZ(0) rotateX(0) rotateY(0)`;

            setTimeout(() => {
                tile.style.zIndex = '1';
            }, 150); // Delay z-index change to prevent flickering with adjacent tiles
        });
    });
}

function initBlobEffect() {
    const blob = document.getElementById("blob");
    if (!blob) return;

    document.body.onpointermove = event => {
        const { clientX, clientY } = event;

        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
    }
}

function initHowToPlayModal() {
    const hasPlayedBefore = localStorage.getItem('alphaBossPlayedBefore');
    if (hasPlayedBefore) {
        return; // Don't show the modal if they've played before
    }

    const overlay = document.getElementById('howToPlayModalOverlay');
    const gotItBtn = document.getElementById('howToPlayGotIt');

    overlay.style.display = 'flex';

    gotItBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        unlockAudio(); // Unlock audio after the user interacts with the modal
        localStorage.setItem('alphaBossPlayedBefore', 'true');
    }, { once: true }); // Ensure the listener only fires once
}

async function init() {
    // Initialize game state object
    Object.assign(state, {
        selected: [],
        roundScore: 0,
        // Set target score based on the current round.
        // If we go past the defined rounds, it keeps the last target.
        target: ROUND_TARGETS[Math.min(state.round - 1, ROUND_TARGETS.length - 1)],
        wordsRemaining: 5,
        discards: 5,
        // Money should persist between rounds, so we don't reset it here.
        money: 4,
        bestWord: {
            word: '',
            score: 0,
        }
    });
    // 1. Create and shuffle the tile pool for the game session
    // Only reset money if it's the first round of a new game.
    if (state.round === 1) {
        state.money = 4;
    }

    state.tilePool = [...TILE_DISTRIBUTION];
    shuffleArray(state.tilePool);

    // 2. Load the dictionary
    await loadDictionary();

    // 3. Generate the initial grid from the pool
    generateGrid();

    // 4. Initialize UI components
    document.getElementById('roundValue').textContent = state.round;
    renderChips();
    updateRoundUI();
    initGooglyEyes();
    initBlobEffect(); // Initialize the new background effect
    initDevControls(); // Initialize the developer control panel
    initHowToPlayModal(); // Check if we need to show the tutorial
    initAudioUnlock(); // Set up the listener to unlock audio on first interaction
}

// Start the game
init();