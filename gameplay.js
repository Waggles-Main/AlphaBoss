// Minimal placeholder gameplay logic to render a 4x4 grid and basic interactions
const gridEl = document.getElementById('tileGrid');
const chipsEl = document.getElementById('playedTilesArea');
const calcValueEl = document.getElementById('calcValue');
const playedTilesArea = document.getElementById('playedTilesArea');
const calcMultMultEl = document.getElementById('calcMultMult');
const calcTotalEl = document.getElementById('calcTotal');
const roundScoreEl = document.getElementById('roundScore');
const targetScoreEl = document.getElementById('targetScore');
const progressBarEl = document.getElementById('progressBar');
const wordsRemainingEl = document.getElementById('wordsRemaining');
const discardsEl = document.getElementById('discards');
const bossDialogLineEl = document.querySelector('.dialog-line');

// Bag Modal Element Selectors
const bagModalOverlay = document.getElementById('bagModalOverlay');
const closeBagBtn = document.getElementById('btnCloseBagModal');
const bagGrid = document.getElementById('bagGrid');
const sortControls = document.querySelector('.sort-controls');

// Options Modal Element Selectors
const optionsModalOverlay = document.getElementById('optionsModalOverlay');
const closeOptionsBtn = document.getElementById('btnCloseOptionsModal');
const musicVolumeSlider = document.getElementById('musicVolume');
const sfxVolumeSlider = document.getElementById('sfxVolume');


// Centralized constants to avoid magic strings
const CONSTANTS = {
    MODIFIER_TYPES: {
        ENHANCEMENT: 'enhancement',
        SEAL: 'seal',
    },
    MODIFIERS: {
        BOOSTER: 'booster',
        MULTIPLIER: 'multiplier',
    },
};

// New round-based score targets
const ROUND_TARGETS = [20, 50, 125, 300, 650, 1200, 2100, 3000];

// New word length multipliers
// This is now an additive bonus, not a multiplier.
const WORD_LENGTH_MULTIPLIERS = {
    5: 1,  6: 2,    7: 3,    8: 5,
    9: 8,  10: 13,  11: 21,  12: 34,
    13: 55, 14: 89, 15: 144, 16: 233,
};

const DIALOGUE = {
    start: [
        "Let's see what you've got.",
        "Try to impress me.",
        "Another challenger? Don't waste my time.",
        "Show me your best words.",
    ],
    longWord: [
        "Impressive! '{word}' is quite a find.",
        "A long word! You might be a worthy opponent.",
        "Not bad. '{word}'... I'll remember that.",
    ],
    highScore: [
        "{score} points? You're getting stronger.",
        "A powerful move! That's {score} points!",
        "That one stung a little. Well played.",
    ],
    lowScore: [
        "Only {score} points? Pathetic.",
        "Is that all? My grandmother could do better.",
        "You call that a word? Barely worth {score} points.",
    ],
    shortWord: [
        "A short word. How quaint.",
        "We're starting small, are we?",
        "That's a word, I suppose.",
    ],
    invalid: [
        "That's not a word!",
        "Are you just making things up now?",
        "Gibberish. Try again.",
        "Consult a dictionary, perhaps?",
    ],
    idle: [
        "Thinking, are we?",
        "Don't take all day.",
        "The clock is ticking...",
        "I'm waiting.",
    ],
    refresh: [
        "Don't like your letters?",
        "Running away from a challenge?",
        "A fresh start won't save you.",
    ]
};

let dictionary = [];
let dragStartIndex;

// --- GAME STATE & LOGIC ---

const state = {
    grid: [], // This will hold the 16 Tile objects for the grid.
    masterTileSet: [], // All 84 tiles for the entire run.
    availableTiles: [], // Tiles available to be drawn in the current round.
    bagTiles: [],
    glyphs: [],
    upgrades: {},
    currentBagSort: 'alpha',
    round: 1, // Start at round 1
    currentBossId: null,
    devControlsEnabled: false, // Dev controls are always disabled by default on page load
    showGlyphInfo: false, // New state for glyph info toggle
    audioUnlocked: false,
};

// --- UTILITY FUNCTIONS ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateBossDialog(category, options = {}) {
    if (!bossDialogLineEl || !DIALOGUE[category]) return;

    const lines = DIALOGUE[category];
    let line = lines[Math.floor(Math.random() * lines.length)];

    // Replace placeholders like {word} or {score}
    if (options.word) {
        line = line.replace('{word}', options.word);
    }
    if (options.score) {
        line = line.replace('{score}', options.score);
    }

    bossDialogLineEl.textContent = line;
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
    // Draw from the pool of tiles available for the current round.
    if (state.availableTiles.length === 0) {
        console.log("Tile pool is empty!");
        return new Tile('_'); // Return a blank Tile object if the pool is empty
    }
    return state.availableTiles.pop();
}

function generateGrid() {
    gridEl.innerHTML = '';
    state.grid = []; // Clear the state grid

    for (let idx = 0; idx < 16; idx++) {
        const tileObject = drawTile();
        tileObject.index = idx; // Assign grid index to the drawn tile
        state.grid.push(tileObject);

        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.dataset.index = String(idx);
        tile.setAttribute('aria-pressed', 'false');

        // Create a new wrapper for animation to avoid conflicts with JS transform
        const tileAnimator = document.createElement('div');
        tileAnimator.className = 'tile-animator';
        tile.appendChild(tileAnimator); // Append animator to the tile early

        tileAnimator.classList.add('fly-in');
        tileAnimator.style.animationDelay = `${idx * 40}ms`;

        tileAnimator.addEventListener('animationend', () => {
            tileAnimator.classList.remove('fly-in');
            tile.style.pointerEvents = 'auto';
        }, { once: true });

        // Apply Top Row enhancement visual if purchased
        if (state.upgrades.topRow && idx < 4) {
            tile.classList.add('top-row-enhanced');
        }

        // Apply visual class and modifiers to the correct elements
        if (tileObject.modifier === CONSTANTS.MODIFIERS.BOOSTER) {
            tile.classList.add('enhanced-booster');
        } else if (tileObject.modifier === CONSTANTS.MODIFIERS.MULTIPLIER) {
            // Add a visual indicator for the multiplier inside the animator
            const multIcon = document.createElement('div');
            multIcon.className = 'mult-icon';
            multIcon.textContent = '×';
            tileAnimator.appendChild(multIcon);
        }


        // Create an inner wrapper for the content and gelatine effect
        const tileContent = document.createElement('div');
        tileContent.className = 'tile-content';

        const displayLetter = tileObject.letter === 'Q' ? 'Qu' : tileObject.letter === '_' ? '' : tileObject.letter;
        const displayValue = tileObject.value + tileObject.mult;
        tileContent.innerHTML = `${displayLetter}<span class="val">${displayValue}</span>`;
        tileAnimator.appendChild(tileContent);
        tile.addEventListener('click', () => toggleTile(idx, tile));
        gridEl.appendChild(tile);
    }
    initTileHoverEffects(); // Add this call to initialize the new hover effects
}

function repopulateGrid(usedTiles, delayStart = 0) {
    usedTiles.forEach(usedTile => {
        const index = usedTile.index;

        const newTileObject = drawTile();
        newTileObject.index = index; // Assign grid index
        state.grid[index] = newTileObject;

        const tileElement = gridEl.querySelector(`[data-index="${index}"]`);
        if (tileElement) {
            // Clear old modifiers and classes
            tileElement.className = 'tile'; // Reset classes

            const tileAnimator = tileElement.querySelector('.tile-animator');
            // Clear any old modifier icons
            const oldIcon = tileAnimator.querySelector('.mult-icon');
            if (oldIcon) oldIcon.remove();

            // Apply Top Row enhancement visual if purchased
            if (state.upgrades.topRow && index < 4) {
                tileElement.classList.add('top-row-enhanced');
            }

            // Apply new visual class based on the new tile object
            if (newTileObject.modifier === CONSTANTS.MODIFIERS.BOOSTER) {
                tileElement.classList.add('enhanced-booster');
            } else if (newTileObject.modifier === CONSTANTS.MODIFIERS.MULTIPLIER) {
                // Add a visual indicator for the multiplier
                const multIcon = document.createElement('div');
                multIcon.className = 'mult-icon';
                multIcon.textContent = '×';
                tileAnimator.appendChild(multIcon);
            } else if (newTileObject.modifier === 'Stone') {
                tileElement.classList.add('debuff-stone');
            }

            const tileContent = tileAnimator.querySelector('.tile-content');
            const displayLetter = newTileObject.letter === 'Q' ? 'Qu' : newTileObject.letter === '_' ? '' : newTileObject.letter;
            const displayValue = newTileObject.value + newTileObject.mult;
            tileContent.innerHTML = `${displayLetter}<span class="val">${displayValue}</span>`;

            // Re-trigger the fly-in animation for the new tile
            if (tileAnimator) {
                // Force a reflow before re-adding the class
                void tileAnimator.offsetWidth;
                tileAnimator.classList.add('fly-in');
                tileAnimator.style.animationDelay = `${delayStart}ms`;

                // Add a new one-time listener to clean up after this specific animation
                tileAnimator.addEventListener('animationend', () => {
                    tileAnimator.classList.remove('fly-in');
                    tileElement.style.pointerEvents = 'auto';
                }, { once: true });
            }
        }
    });
}


function toggleTile(index, el) {
    const tileObject = state.grid[index];
    const foundIndex = state.selected.findIndex(selectedTile => selectedTile.index === index);

    if (foundIndex >= 0) {
        // Prevent deselecting a locked tile
        if (tileObject.isLocked) {
            shakeScreen(); // Give feedback that it's locked
            return;
        }
        // This part handles deselecting a tile from the main grid
        state.selected.splice(foundIndex, 1);
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
    } else {
        // This part handles selecting a new tile
        state.selected.push(tileObject);
        createConfetti(el); // Trigger confetti effect on selection
        el.classList.add('selected');
        el.setAttribute('aria-pressed', 'true');
        if (sounds.tileClick) sounds.tileClick.play(); // Play click sound
        unlockAudio(); // Ensure audio is unlocked on the first click
    }
    renderChips();
    updateDevScorePanel();
    updateScoreCalculation();
    updateScoringJuice();
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
    updateScoreCalculation();
    updateScoringJuice();
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
    const chipsToAnimate = chipsEl.querySelectorAll('.chip');
    const animationDuration = 400; // Must match CSS animation duration
    const staggerDelay = 75;       // Time between each chip animation start

    // --- Handle Boss Effects on Word Play ---
    if (state.activeBossEffect) {
        const effect = state.activeBossEffect;
        if (effect.type === 'ForceDiscardHand') {
            // "The Snag" effect
            // This is a placeholder; a better implementation would show which tiles were discarded.
            console.log(`Boss forces discard of ${effect.details.count} tiles from hand.`);
            // We'll implement the actual discard logic after repopulating the grid.
        }
        if (effect.type === 'ForceDiscardGrid') {
            // "The Hook" effect
            // Discard random tiles from the main grid
            const gridTiles = state.grid.filter(t => !state.selected.includes(t));
            shuffleArray(gridTiles);
            repopulateGrid(gridTiles.slice(0, effect.details.count));
        }
    }

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
    const { finalScore: score } = calculateWordScore(state.selected);
    const wordLength = validatedWord.length;

    // --- Update Boss Dialogue based on performance ---
    if (wordLength >= 8) {
        updateBossDialog('longWord', { word: validatedWord });
    } else if (score >= 50) {
        updateBossDialog('highScore', { score });
    } else if (score < 10) {
        updateBossDialog('lowScore', { score });
    } else {
        updateBossDialog('shortWord');
    }

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
    repopulateGrid(usedTilesInfo, 500); // Delay repopulation to not clash with success animation
    updateRoundUI();

    // Check for win/loss conditions after every successful word
    if (state.roundScore >= state.target || state.wordsRemaining === 0) {
        gameOver();
    }
}


function clearSelection() {
    state.selected = [];
    updateBossDialog('idle');
    document.querySelectorAll('.tile.selected').forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('aria-pressed', 'false');
    });
    renderChips();
    updateDevScorePanel();
    updateScoreCalculation();
    updateScoringJuice();
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
        // Clear the main run state object to ensure a fresh start.
        localStorage.removeItem('alphaBossRun');
        // Navigate to the between-rounds screen to start a new run.
        window.location.href = 'between-rounds.html';
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
    const runState = getRunState();

    // --- Calculate Bonuses ---
    // For now, boss bonus is a flat rate. This can be made dynamic later.
    const bossBonus = 3; 
    const wordsBonus = state.wordsRemaining * 2;
    const totalWinnings = bossBonus + wordsBonus;
    
    // --- Update and Save Run State ---
    runState.money += totalWinnings;
    runState.stageIndex++; // Move to the next stage (e.g., from Quiz to Event)

    // Check if the round is over
    if (runState.stageIndex >= 5) { // 5 stages: 0, 1, 2, 3, 4
        runState.round++;
        runState.stageIndex = 0; // Reset to the first stage (Quiz) for the new round
    }

    // Save the entire updated state
    saveRunState(runState);
    state.money = runState.money; // Update local state for display

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
        // Navigate to the shop, then the shop will navigate to the between-rounds screen
        window.location.href = 'shop.html';
    };
}

// --- UI, DRAGGING, & VALIDATION ---

function renderChips() {
    playedTilesArea.innerHTML = '';

    // Determine the maximum number of slots to show (min 8, or number of selected tiles)
    const numSlots = Math.max(8, state.selected.length);
    playedTilesArea.style.gridTemplateColumns = `repeat(${numSlots}, 1fr)`;

    for (let i = 0; i < numSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'chip-slot';

        const bonusDisplay = document.createElement('div');
        bonusDisplay.className = 'chip-bonus-display';

        const chipContainer = document.createElement('div');
        chipContainer.className = 'chip-container';

        const positionDisplay = document.createElement('div');
        positionDisplay.className = 'chip-position-display';
        positionDisplay.textContent = i + 1; // Always show the 1-based position

        // Create a new element for the word length bonus
        const lengthBonusDisplay = document.createElement('div');
        lengthBonusDisplay.className = 'chip-length-bonus-display';
        const potentialBonus = WORD_LENGTH_MULTIPLIERS[i + 1]; // Check for bonus at this position
        if (potentialBonus) {
            lengthBonusDisplay.textContent = `${potentialBonus}x`;
        }

        const tile = state.selected[i];
        if (tile) {
            // --- Populate Bonus Display (Above) ---
            const bonusValueEl = document.createElement('div');
            bonusValueEl.className = 'chip-bonus-value';
            // Show the tile's score contribution.
            if (tile.mult > 0) {
                // If it has an additive bonus (e.g., Booster), show the boosted total
                bonusValueEl.textContent = `+${tile.value + tile.mult}`;
            } else {
                // For basic tiles or multiplier-only tiles, show the base value.
                bonusValueEl.textContent = `+${tile.value}`;
            }

            const bonusMultEl = document.createElement('div');
            bonusMultEl.className = 'chip-bonus-mult';
            if (tile.mult_mult > 1) {
                bonusMultEl.textContent = `x${tile.mult_mult}`;
            }

            bonusDisplay.append(bonusMultEl, bonusValueEl);

            // --- Populate Tile Chip ---
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.setAttribute('draggable', true);
            chip.dataset.selectedIndex = i;
            chip.textContent = tile.letter === 'Q' ? 'Qu' : tile.letter;
            chip.addEventListener('click', () => deselectChip(i));
            chip.addEventListener('dragstart', dragStart);
            chip.addEventListener('dragend', dragEnd);
            chip.addEventListener('dragover', dragOver);
            chip.addEventListener('drop', dragDrop);
            chipContainer.appendChild(chip);
        }
        slot.append(bonusDisplay, chipContainer, positionDisplay, lengthBonusDisplay);
        playedTilesArea.appendChild(slot);
    }
}

function renderGlyphs() {
    const slotsContainer = document.getElementById('glyphSlots');
    const counterEl = document.getElementById('glyphCounter');
    const maxSlots = 5; // Default number of glyph slots

    slotsContainer.innerHTML = ''; // Clear existing slots

    for (let i = 0; i < maxSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'glyph-slot';

        const glyph = state.glyphs[i];
        if (glyph) {
            slot.classList.add('filled');
            slot.dataset.glyphIndex = i; // Store index for selling
            slot.style.backgroundImage = `url('images/glyphs/${glyph.imageName}')`;
        }
        slotsContainer.appendChild(slot);
    }

    counterEl.textContent = `${state.glyphs.length}/${maxSlots}`;
}

function updateScoreCalculation() {
    const { baseScore, glyphBonusScore, tileMultiplier, glyphBonusMult, lengthMultiplier, finalScore } = calculateWordScore(state.selected);

    calcValueEl.textContent = baseScore + (glyphBonusScore || 0);
    document.getElementById('calcMult').textContent = `${tileMultiplier + glyphBonusMult}x`;
    calcMultMultEl.textContent = `${lengthMultiplier}x`; // This seems to be the word length multiplier
    calcTotalEl.textContent = finalScore;
}

function updateScoringJuice() {
    const playBtn = document.getElementById('btnPlay');
    if (!playBtn) return;
    const wordLength = state.selected.length;

    // Remove classes to reset state
    playBtn.classList.remove('wobble-play', 'glow-play');

    // Apply new classes based on word length
    if (wordLength >= 5) {
        // 5+ letters: Glow (which includes the wobble)
        playBtn.classList.add('glow-play');
    } else if (wordLength >= 4) {
        // 4 letters: Just wobble
        playBtn.classList.add('wobble-play');
    }
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
    const dragEndIndex = +e.target.closest('.chip-slot').querySelector('.chip-container .chip').dataset.selectedIndex;
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
    wordsRemainingEl.textContent = state.wordsRemaining;
    discardsEl.textContent = state.discards;
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
    let baseScore = 0;
    let tileMultiplier = 1;
    let lengthMultiplier = 1; // For word length bonus
    let glyphBonusMult = 0;
    let glyphBonusScore = 0;
    const wordLength = selectedTiles.length;

    // 1. Calculate base score and tile-specific multipliers
    selectedTiles.forEach(tile => {
        // Stone tiles from "The Wheel" boss contribute nothing
        if (tile.modifier === 'Stone') {
            return;
        }
        baseScore += tile.value + tile.mult;
        tileMultiplier *= tile.mult_mult;
    });

    // 2. Calculate Glyph bonuses
    state.glyphs.forEach(glyphData => { // glyphData is a plain object from localStorage
        const GlyphClass = GLYPH_MAP[glyphData.id];
        if (!GlyphClass) return;
        const glyph = new GlyphClass();
        if (glyph && typeof glyph.onScoring === 'function') {
            const result = glyph.onScoring(state, { playedTiles: selectedTiles });
            if (result && result.bonusMult) {
                glyphBonusMult += result.bonusMult;
            }
            if (result && result.bonusScore) {
                glyphBonusScore += result.bonusScore;
            }
        }
    });

    // 3. Get the word length multiplier. Default to 1 if not found.
    lengthMultiplier = WORD_LENGTH_MULTIPLIERS[wordLength] || 1;

    // 4. Calculate the final score.
    const finalScore = Math.round((baseScore + glyphBonusScore) * (tileMultiplier + glyphBonusMult) * lengthMultiplier);

    // Return a detailed object for use in different UI components
    return {
        baseScore,
        glyphBonusScore,
        tileMultiplier,
        glyphBonusMult,
        lengthMultiplier,
        finalScore
    };
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
        animation: errorShake 0.5s ease-in-out;`;
    document.body.appendChild(errorEl);
    updateBossDialog('invalid');
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
    const availableTileIds = new Set(state.availableTiles.map(t => t.id));

    if (tilesRemainingInfo) {
        tilesRemainingInfo.textContent = `Tiles remaining: ${state.availableTiles.length}`;
    }

    // The bag now shows the master set, with a flag for availability.
    state.bagTiles = state.masterTileSet.map(tile => ({
        ...tile,
        isAvailable: availableTileIds.has(tile.id)
    }));
    sortBagTiles(state.currentBagSort, false); // Apply current sort without re-rendering yet

    // Render purchased upgrades
    const upgradesGrid = document.getElementById('bagUpgradesGrid');
    upgradesGrid.innerHTML = '';
    const purchasedUpgradeIds = Object.keys(state.upgrades);
    if (purchasedUpgradeIds.length > 0) {
        purchasedUpgradeIds.forEach(upgradeId => {
            const upgradeDef = ALL_UPGRADES.find(u => u.id === upgradeId);
            if (upgradeDef) {
                const upgradeEl = document.createElement('div');
                upgradeEl.className = 'bag-upgrade-item';
                upgradeEl.textContent = upgradeDef.name;
                upgradesGrid.appendChild(upgradeEl);
            }
        });
    } else {
        const emptyText = document.createElement('p');
        emptyText.className = 'bag-empty-text';
        emptyText.textContent = 'No upgrades purchased';
        upgradesGrid.appendChild(emptyText);
    }

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
        state.bagTiles.sort((a, b) => a.letter.localeCompare(b.letter));
    } else if (sortBy === 'value') {
        // Sort by availability first, then value
        state.bagTiles.sort((a, b) => {
            if (a.isAvailable !== b.isAvailable) return b.isAvailable - a.isAvailable;
            return (b.value + b.mult) - (a.value + a.mult) || a.letter.localeCompare(b.letter);
        });
    } else if (sortBy === 'type') {
        // Sort by availability first, then modifier type
        const MODIFIER_SORT_ORDER = {
            [CONSTANTS.MODIFIERS.MULTIPLIER]: 3,
            [CONSTANTS.MODIFIERS.BOOSTER]: 2,
        };
        state.bagTiles.sort((a, b) => {
            if (a.isAvailable !== b.isAvailable) return b.isAvailable - a.isAvailable;
            const aOrder = MODIFIER_SORT_ORDER[a.modifier] || 1;
            const bOrder = MODIFIER_SORT_ORDER[b.modifier] || 1;
            // Sort by modifier order descending, then alphabetically for ties
            return bOrder - aOrder || a.letter.localeCompare(b.letter);
        });
    }
    
    if (shouldRender) {
        renderBagTiles();
    }
}

function renderBagTiles() {
    bagGrid.innerHTML = ''; // Clear previous tiles
    state.bagTiles.forEach(tileObject => {
        const tile = document.createElement('div');
        tile.className = 'bag-tile';
        if (!tileObject.isAvailable) {
            tile.classList.add('used');
        }

        const displayLetter = tileObject.letter === 'Q' ? 'Qu' : tileObject.letter === '_' ? '' : tileObject.letter;
        const displayValue = tileObject.value + tileObject.mult;
        tile.innerHTML = `${displayLetter}<span class="val">${displayValue}</span>`;

        // If the tile has a modifier, add the corresponding class
        if (tileObject.modifier === CONSTANTS.MODIFIERS.BOOSTER) {
            tile.classList.add('enhanced-booster');
        } else if (tileObject.modifier === CONSTANTS.MODIFIERS.MULTIPLIER) {
            const multIcon = document.createElement('div');
            multIcon.className = 'mult-icon';
            multIcon.textContent = '×';
            tile.appendChild(multIcon);
        }
        
        bagGrid.appendChild(tile);
    });
}

function refreshBoard() {
    if (state.discards <= 0) {
        return; // No discards left, do nothing.
    }

    // 1. Decrement discards and update UI
    state.discards--;
    updateBossDialog('refresh');
    discardsEl.textContent = state.discards;

    // 2. Clear any currently selected tiles
    clearSelection();

    // 3. Generate a new grid of tiles
    generateGrid();

    // 4. If no discards are left, disable the button
    if (state.discards === 0) {
        const refreshBtn = document.getElementById('btnRefreshBoard');
        if (refreshBtn) {
            refreshBtn.disabled = true;
        }
    }
}

// --- OPTIONS MODAL FUNCTIONS ---
function openOptionsModal() {
    // Set slider values to current volumes
    musicVolumeSlider.value = sounds.background ? sounds.background.volume() : 0.3;
    sfxVolumeSlider.value = sounds.tileClick ? sounds.tileClick.volume() : 0.7; // Use one SFX as reference

    optionsModalOverlay.style.display = 'flex';

    // Set the dev controls toggle state based on localStorage, but don't immediately show the panel
    const devControlsToggle = document.getElementById('devControlsToggle');
    if (devControlsToggle) devControlsToggle.checked = localStorage.getItem('alphaBossDevControlsEnabled') === 'true';

    // Set the glyph info toggle state
    const glyphInfoToggle = document.getElementById('glyphInfoToggle');
    if (glyphInfoToggle) glyphInfoToggle.checked = state.showGlyphInfo;
}

function closeOptionsModal() {
    optionsModalOverlay.style.display = 'none';
}

function updateDevPanelVisibility() {
    const devPanel = document.getElementById('devPanel');
    if (devPanel) {
        if (state.devControlsEnabled) {
            devPanel.classList.add('enabled');
        } else {
            devPanel.classList.remove('enabled');
        }
    }
}

function setMusicVolume(volume) {
    if (sounds.background) {
        sounds.background.volume(volume);
    }
    localStorage.setItem('alphaBossMusicVolume', volume);
}

// --- EVENT LISTENERS & INITIALIZATION ---
document.getElementById('btnClear').addEventListener('click', clearSelection);
document.getElementById('btnOptions').addEventListener('click', openOptionsModal);
document.getElementById('btnRefreshBoard').addEventListener('click', refreshBoard);
document.getElementById('btnPlay').addEventListener('click', playWord);

function setSfxVolume(volume) {
    // Apply volume to all sound effects, but not the background music
    for (const key in sounds) {
        if (key !== 'background') {
            sounds[key].volume(volume);
        }
    }
    localStorage.setItem('alphaBossSfxVolume', volume);
}

// Options Modal Listeners
closeOptionsBtn.addEventListener('click', closeOptionsModal);
optionsModalOverlay.addEventListener('click', (e) => {
    if (e.target === optionsModalOverlay) closeOptionsModal();
});
musicVolumeSlider.addEventListener('input', (e) => setMusicVolume(parseFloat(e.target.value)));
sfxVolumeSlider.addEventListener('input', (e) => setSfxVolume(parseFloat(e.target.value)));

// New Dev Controls Toggle Listener
const devControlsToggle = document.getElementById('devControlsToggle');
if (devControlsToggle) {
    devControlsToggle.addEventListener('change', (e) => {
        state.devControlsEnabled = e.target.checked; // Update state
        localStorage.setItem('alphaBossDevControlsEnabled', state.devControlsEnabled);
        updateDevPanelVisibility();
    });
}

// New Glyph Info Toggle Listener
const glyphInfoToggle = document.getElementById('glyphInfoToggle');
if (glyphInfoToggle) {
    glyphInfoToggle.addEventListener('change', (e) => {
        state.showGlyphInfo = e.target.checked;
        const runState = getRunState();
        runState.showGlyphInfo = state.showGlyphInfo;
        saveRunState(runState);
    });
}

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

// Add a right-click listener to the grid to clear the current selection
gridEl.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent the default browser right-click menu
    if (state.selected.length > 0) {
        clearSelection();
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
        const baseValue = tile.value;
        let line = `${letter}: ${baseValue} pts`;
        baseScore += baseValue;

        if (tile.modifier === CONSTANTS.MODIFIERS.BOOSTER && tile.mult > 0) {
            line += ` (+${tile.mult} Booster)`;
            baseScore += tile.mult;
        }
        breakdown += line + '\n';
    });

    // Add Glyph breakdown
    let glyphBonus = 0;
    let glyphScoreBonus = 0;
    state.glyphs.forEach(glyphData => { // glyphData is a plain object from localStorage
        const GlyphClass = GLYPH_MAP[glyphData.id];
        if (!GlyphClass) return;
        const glyph = new GlyphClass();
        if (glyph && typeof glyph.onScoring === 'function') {
            const result = glyph.onScoring(state, { playedTiles: state.selected });
            if (result && result.bonusScore) {
                glyphScoreBonus += result.bonusScore;
                breakdown += `${glyph.name}: +${result.bonusScore} Pts\n`;
            }
            if (result && result.bonusMult) {
                breakdown += `${glyph.name}: +${result.bonusMult} Mult\n`;
            }
        }
    });


    const wordLength = state.selected.length;
    const lengthMultiplier = WORD_LENGTH_MULTIPLIERS[wordLength] || 1;
    if (lengthMultiplier > 1) {
        breakdown += `Length Multiplier (x${lengthMultiplier})\n`;
    }

    // Check for Stone tiles
    if (state.selected.some(t => t.modifier === 'Stone')) {
        breakdown += `Stone Tile(s): No score contribution\n`;
    }

    const { finalScore } = calculateWordScore(state.selected);
    detailsEl.textContent = `${breakdown}------------------\nTotal: ${finalScore} pts`;
}

function resetForNewBoss() {
    // Reset round-specific state that a boss might affect
    const runState = getRunState();
    state.wordsRemaining = runState.wordsPerRound || 5;
    state.discards = runState.refreshesPerRound || 5;
    state.target = runState.stageTarget || ROUND_TARGETS[Math.min(runState.round - 1, ROUND_TARGETS.length - 1)];

    // Re-apply the new boss effect if one is active
    if (state.activeBossEffect?.type === 'SetRefreshes') {
        state.discards = state.activeBossEffect.details.count;
    }
    if (state.activeBossEffect?.type === 'ModifyScoreTarget') {
        state.target = Math.round(state.target * state.activeBossEffect.details.multiplier);
    }
}

function initializePageDevControls() {
    // Define the win/lose conditions specific to this page
    const gameState = {
      winCondition: () => {
        state.roundScore = state.target;
        updateRoundUI();
        gameOver();
      },
      loseCondition: () => {
        state.wordsRemaining = 0;
        updateRoundUI();
        gameOver();
      },
      updateDevPanel: updateDevScorePanel,
    };
    initDevControls(gameState);
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

    let centerX, centerY;

    const moveEyes = (e) => {
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
    };

    bossPortrait.addEventListener('mouseenter', (e) => {
        const rect = bossPortrait.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        document.addEventListener('mousemove', moveEyes);
    });

    bossPortrait.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', moveEyes);
        pupils.forEach(pupil => { pupil.style.transform = 'translate(-50%, -50%)'; });
    });

    document.addEventListener('mouseleave', () => {
        pupils.forEach(pupil => { pupil.style.transform = 'translate(-50%, -50%)'; });
    });
}

function initTileHoverEffects() {
    const tiles = document.querySelectorAll('.tile');
    const MAX_ROTATION = 20; // Max degrees of rotation for the tilt effect.
    const HOVER_TRANSLATE_Z = 40; // How much the tile "pops up" on hover.

    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            // Add the hovering class to trigger the wobble animation on the child.
            if (sounds.tileHover) sounds.tileHover.play();
            tile.classList.add('hovering');
            tile.style.zIndex = '10';
        });

        tile.addEventListener('mousemove', (e) => {
            // This effect only runs while the tile is being hovered.
            if (!tile.classList.contains('hovering')) return;

            const rect = tile.getBoundingClientRect();
            // Calculate mouse position relative to the tile's center.
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation values. The further from the center, the more it tilts.
            const rotateY = (x / centerX) * MAX_ROTATION;
            const rotateX = -1 * (y / centerY) * MAX_ROTATION;

            // Apply a 3D transform to lift and rotate the tile.
            // This inline style on the parent `.tile` won't conflict with the
            // CSS animation on the child `.tile-animator`.
            tile.style.transform = `perspective(1000px) translateZ(${HOVER_TRANSLATE_Z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        tile.addEventListener('mouseleave', () => {
            // Remove the class to stop the wobble.
            tile.classList.remove('hovering');
            // Reset the transform to its original state.
            tile.style.transform = `perspective(1000px) translateZ(0) rotateX(0) rotateY(0)`;

            // Delay the z-index change to prevent the tile from clipping under
            // adjacent tiles before the transition animation is complete.
            setTimeout(() => {
                tile.style.zIndex = '1';
            }, 150);
        });
    });
}

function initTooltips() {
    const tooltipEl = document.getElementById('tileTooltip');
    const tooltipLetterEl = tooltipEl.querySelector('.tooltip-letter');
    const tooltipValueEl = tooltipEl.querySelector('.tooltip-value');
    const tooltipInfoEl = tooltipEl.querySelector('.tooltip-info');
    const tooltipTileEl = tooltipEl.querySelector('.tooltip-tile');

    let tooltipTimer;

    // --- Touch Event Handling for Mobile Tooltips ---
    gridEl.addEventListener('touchstart', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile) return;

        // Start a timer for the long press
        tooltipTimer = setTimeout(() => {
            showTooltipForTile(tile);
        }, 500); // 500ms for a long press
    }, { passive: true });

    gridEl.addEventListener('touchend', () => {
        clearTimeout(tooltipTimer);
        hideTooltip();
    });

    gridEl.addEventListener('touchmove', () => {
        // If the user starts dragging their finger, cancel the tooltip
        clearTimeout(tooltipTimer);
        hideTooltip();
    });

    gridEl.addEventListener('mouseover', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile) return;

        // Clear any existing timer
        clearTimeout(tooltipTimer);

        // Start a new timer to show the tooltip
        tooltipTimer = setTimeout(() => {
            showTooltipForTile(tile);
        }, 300); // 300ms delay
    });

    gridEl.addEventListener('mouseout', () => {
        clearTimeout(tooltipTimer);
        hideTooltip();
    });

    function showTooltipForTile(tile) {
        const index = parseInt(tile.dataset.index, 10);
        const tileObject = state.grid[index];

        // 1. Populate tooltip content
        tooltipLetterEl.textContent = tileObject.letter === 'Q' ? 'Qu' : tileObject.letter;
        tooltipValueEl.textContent = tileObject.value;

        let infoHTML = `Base Value: <span class="tooltip-value-color">${tileObject.value}</span>`;
        if (tileObject.mult > 0) {
            infoHTML += `\n<span class="tooltip-value-color">+${tileObject.mult}</span> (Booster)`;
        }
        if (tileObject.mult_mult > 1) {
            infoHTML += `\n<span class="tooltip-mult-color">×${tileObject.mult_mult}</span> Multiplier`;
        }
        if (state.upgrades.topRow && tileObject.index < 4) {
            infoHTML += `\n<span class="tooltip-mult-mult-color">+1x</span> Word Multiplier`;
        }
        tooltipInfoEl.innerHTML = infoHTML;

        // 2. Handle visual enhancements
        tooltipTileEl.className = 'tooltip-tile'; // Reset classes
        if (tileObject.modifier === CONSTANTS.MODIFIERS.BOOSTER) {
            tooltipTileEl.classList.add('enhanced-booster');
        }
        if (state.upgrades.topRow && tileObject.index < 4) {
            tooltipTileEl.classList.add('top-row-enhanced');
        }
        const oldIcon = tooltipTileEl.querySelector('.mult-icon');
        if (oldIcon) oldIcon.remove();
        if (tileObject.modifier === CONSTANTS.MODIFIERS.MULTIPLIER) {
            const multIcon = document.createElement('div');
            multIcon.className = 'mult-icon';
            multIcon.textContent = '×';
            tooltipTileEl.appendChild(multIcon);
        }

        // 3. Position and show the tooltip
        const rect = tile.getBoundingClientRect();
        tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
        tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
        tooltipEl.classList.add('visible');
    }

    function hideTooltip() {
        clearTimeout(tooltipTimer);
        tooltipEl.classList.remove('visible');
    }
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

function getRunState() {
    const savedRun = localStorage.getItem('alphaBossRun');
    if (savedRun) {
        return JSON.parse(savedRun);
    }
    // This should ideally not be hit if starting from the menu, but is a safe fallback.
    return {
        round: 1,
        stageIndex: 0,
        money: 4,
        upgrades: {},
        masterTileSet: null,
        stageTarget: 20,
    };
}

function saveRunState(runState) {
    localStorage.setItem('alphaBossRun', JSON.stringify(runState));
}

async function init() {
    // --- New State Management ---
    // Load the saved run state and merge it into the current game state.
    // This is safer than manually copying each property.
    Object.assign(state, getRunState());

    // --- Apply Boss Effect if it's an Exam round ---
    if (state.stageIndex === 4 && state.currentBossId) { // 4 is the index for 'exam'
        const BossClass = BOSS_MAP[state.currentBossId];
        if (BossClass) {
            const boss = new BossClass();
            boss.applyEffect(state); // The 'state' object is the gameplay state.
            state.activeBossEffect.constructorName = BossClass.name; // Store constructor name
        }
    }

    // Set the stage indicator text
    const stageIndicatorEl = document.getElementById('stageIndicator');
    if (stageIndicatorEl) {
        const stageNames = {
            0: 'Quiz',
            1: 'Event',
            2: 'Test',
            3: 'Event',
            4: 'Exam'
        };
        stageIndicatorEl.textContent = stageNames[state.stageIndex] ?? 'Unknown';
    }

    // Load and apply saved volume settings
    const savedMusicVolume = localStorage.getItem('alphaBossMusicVolume');
    const savedSfxVolume = localStorage.getItem('alphaBossSfxVolume');

    if (savedMusicVolume !== null) {
        setMusicVolume(parseFloat(savedMusicVolume));
    } else {
        setMusicVolume(0.3); // Default
    }
    if (savedSfxVolume !== null) {
        setSfxVolume(0.7); // Default
    }

    const wordsPerRound = state.wordsPerRound || 5;
    const refreshesPerRound = state.refreshesPerRound || 5;

    // Initialize game state object
    state.selected = [];
    state.roundScore = 0;
    state.wordsRemaining = wordsPerRound;
    state.discards = refreshesPerRound;
    state.bestWord = {
        word: '',
        score: 0,
    };

    // Apply boss effects that modify starting state
    if (state.activeBossEffect?.type === 'SetRefreshes') {
        state.discards = state.activeBossEffect.details.count;
    }

    // 1. Create or load the master tile set for the run.
    if (state.masterTileSet) {
        state.masterTileSet = state.masterTileSet;
    } else {
        // First time loading for this run, create the set.
        state.masterTileSet = TILE_DISTRIBUTION.map(letter => new Tile(letter));
        state.masterTileSet = state.masterTileSet;
        saveRunState(state);
    }


    // For every round, create a fresh, shuffled pool of available tiles from the master set.
    state.availableTiles = [...state.masterTileSet];
    shuffleArray(state.availableTiles);

    // 2. Load the dictionary
    await loadDictionary();

    // Update the money display
    document.getElementById('money').textContent = `$${state.money}`;
    discardsEl.textContent = state.discards;
    wordsRemainingEl.textContent = state.wordsRemaining;
    // 3. Generate the initial grid from the pool
    generateGrid();

    // Apply boss effects that modify the grid after it's generated
    if (state.activeBossEffect?.type === 'LockFirstTile') {
        state.grid[0].isLocked = true;
        gridEl.querySelector('[data-index="0"]').classList.add('locked');
    }

    // 4. Initialize UI components
    document.getElementById('roundValue').textContent = state.round;
    renderChips();
    renderGlyphs();
    updateBossDialog('start');
    updateDevPanelVisibility(); // Set initial visibility of dev panel
    updateRoundUI();
    initGooglyEyes();
    initBlobEffect(); // Initialize the new background effect
    initializePageDevControls(); // Initialize the developer control panel
    initHowToPlayModal(); // Check if we need to show the tutorial
    initTooltips(); // Initialize the new tooltip functionality
    // Use the shared implementation for glyph interactions
    initGlyphInteractions(state, saveRunState, () => {
        document.getElementById('money').textContent = `$${state.money}`;
        renderGlyphs();
    });
    initAudioUnlock(); // Set up the listener to unlock audio on first interaction

    // Attempt to play background music after user interaction
    document.body.addEventListener('click', () => {
        if (sounds.background && !sounds.background.playing()) {
            sounds.background.play();
        }
    }, { once: true });
}

// Start the game
init();