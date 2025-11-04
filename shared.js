/**
 * =============================================================================
 * SHARED LOGIC
 * Contains utility functions and state management used across multiple files.
 * =============================================================================
 */

// --- SHARED STATE & CONSTANTS ---
const sounds = {}; // This will be populated by initSounds() in sound.js

// --- OPTIONS MODAL FUNCTIONS ---
function openOptionsModal() {
    const optionsModalOverlay = document.getElementById('optionsModalOverlay');
    const musicVolumeSlider = document.getElementById('musicVolume');
    const sfxVolumeSlider = document.getElementById('sfxVolume');

    // Set slider values to current volumes
    musicVolumeSlider.value = sounds.background ? sounds.background.volume() : 0.3;
    // Use a common sound effect as a reference for the SFX volume
    sfxVolumeSlider.value = sounds.tileClick ? sounds.tileClick.volume() : 0.7;

    if (optionsModalOverlay) {
        optionsModalOverlay.style.display = 'flex';
    }
}

function closeOptionsModal() {
    const optionsModalOverlay = document.getElementById('optionsModalOverlay');
    if (optionsModalOverlay) {
        optionsModalOverlay.style.display = 'none';
    }
}

function setMusicVolume(volume) {
    if (sounds.background) {
        sounds.background.volume(volume);
    }
    localStorage.setItem('alphaBossMusicVolume', volume);
}

function setSfxVolume(volume) {
    // Apply volume to all sound effects, but not the background music
    for (const key in sounds) {
        if (key !== 'background' && sounds[key]) {
            sounds[key].volume(volume);
        }
    }
    localStorage.setItem('alphaBossSfxVolume', volume);
}

function initOptionsModal() {
    const optionsBtn = document.getElementById('btnOptions');
    const closeOptionsBtn = document.getElementById('btnCloseOptionsModal');
    const optionsModalOverlay = document.getElementById('optionsModalOverlay');
    const musicVolumeSlider = document.getElementById('musicVolume');
    const sfxVolumeSlider = document.getElementById('sfxVolume');

    if (optionsBtn) optionsBtn.addEventListener('click', openOptionsModal);
    if (closeOptionsBtn) closeOptionsBtn.addEventListener('click', closeOptionsModal);
    if (optionsModalOverlay) optionsModalOverlay.addEventListener('click', (e) => {
        if (e.target === optionsModalOverlay) closeOptionsModal();
    });
    if (musicVolumeSlider) musicVolumeSlider.addEventListener('input', (e) => setMusicVolume(parseFloat(e.target.value)));
    if (sfxVolumeSlider) sfxVolumeSlider.addEventListener('input', (e) => setSfxVolume(parseFloat(e.target.value)));
}

// --- STATE MANAGEMENT ---

function getRunState() {
    const savedRun = localStorage.getItem('alphaBossRun');
    if (savedRun) {
        return JSON.parse(savedRun);
    }
    // Default state for a brand new run, consistent with between-rounds.js
    return {
        round: 1,
        stageIndex: 0,
        money: 4,
        upgrades: {},
        glyphs: [],
        masterTileSet: null,
    };
}

function saveRunState(runState) {
    localStorage.setItem('alphaBossRun', JSON.stringify(runState));
}

/**
 * Applies all necessary visual styles and data attributes to a tile element
 * based on its corresponding tile data object.
 * @param {HTMLElement} tileElement - The DOM element for the tile (e.g., the `.tile` div).
 * @param {object} tileObject - The tile data object from the game state.
 */
function applyTileVisuals(tileElement, tileObject) {
    if (!tileElement || !tileObject) return;

    const tileAnimator = tileElement.querySelector('.tile-animator');
    if (!tileAnimator) return;

    // Clear old modifier classes and icons
    tileElement.className = 'tile';
    const oldIcon = tileAnimator.querySelector('.mult-icon');
    if (oldIcon) oldIcon.remove();

    // Apply enhancement visuals
    if (tileObject.modifier === 'booster') tileElement.classList.add('enhanced-booster');
    if (tileObject.modifier === 'mult_tile') {
        tileElement.classList.add('enhanced-mult_tile');
        const multBonus = tileObject.rarity === 'Gold' ? 8 : tileObject.rarity === 'Silver' ? 4 : 2;
        tileAnimator.querySelector('.val').dataset.multBonus = multBonus;
    }
    if (tileObject.modifier === 'glass_tile') tileElement.classList.add('enhanced-glass');
    if (tileObject.modifier === 'gold_tile') tileElement.classList.add('enhanced-gold');
    if (tileObject.modifier === 'lucky_tile') tileElement.classList.add('enhanced-lucky');
    if (tileObject.modifier === 'steel_tile') tileElement.classList.add('enhanced-steel');
    if (tileObject.modifier === 'Stone') tileElement.classList.add('debuff-stone');

    // Apply gem visuals
    if (tileObject.gemModifier) {
        tileElement.classList.add('gem-tile', `gem-${tileObject.gemModifier.toLowerCase()}`);
    }
}

// --- UTILITIES ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showErrorToast(message) {
    const container = document.getElementById('error-container');
    if (!container) {
        console.warn('No error-container found in the DOM for the toast message.');
        return;
    }
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function initDevControls(gameState = {}) {
    const devPanel = document.getElementById('devPanel');
    if (!devPanel) return;

    // --- Visibility ---
    const devControlsEnabled = localStorage.getItem('alphaBossDevControlsEnabled') === 'true';
    if (devControlsEnabled) {
        devPanel.classList.add('enabled');
    }

    const devMinimizeBtn = document.getElementById('devMinimizeBtn');
    if (devMinimizeBtn) {
        devMinimizeBtn.addEventListener('click', () => {
            devPanel.classList.toggle('minimized');
            devMinimizeBtn.textContent = devPanel.classList.contains('minimized') ? '+' : '-';
        });
    }

    // --- Navigation ---
    const navMapping = {
        'devNavMenu': 'index.html',
        'devNavGame': 'gameplay.html',
        'devNavShop': 'shop.html',
        'devNavEvent': 'event.html',
        'devNavWordle': 'wordle.html',
        'devNavScramble': 'word-scramble.html',
        'devNavSandbox': 'sandbox.html',
    };

    for (const [id, url] of Object.entries(navMapping)) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => window.location.href = url);
        }
    }

    // --- Gameplay Specific Dev Controls ---
    const devWinBtn = document.getElementById('devWin');
    const devLoseBtn = document.getElementById('devLose');

    if (devWinBtn && gameState.winCondition) {
        devWinBtn.addEventListener('click', gameState.winCondition);
    }
    if (devLoseBtn && gameState.loseCondition) {
        devLoseBtn.addEventListener('click', gameState.loseCondition);
    }

    // --- Other Dev Panel Initializations (like boss select) would go here ---
    const devScoreDetailsEl = document.getElementById('devScoreDetails');
    if (devScoreDetailsEl && gameState.updateDevPanel) {
        gameState.updateDevPanel();
    }
}
// --- SHARED UI INTERACTIONS ---

function initGlyphInteractions(stateObject, saveStateCallback, updateUICallback) {
    const glyphsContainer = document.getElementById('glyphsSection');
    const tooltip = document.getElementById('glyphActionTooltip');
    const overlay = document.getElementById('glyphActionOverlay');
    if (!glyphsContainer || !tooltip || !overlay) return;

    // --- Tooltip Elements ---
    const sellInfo = document.getElementById('glyphSellInfo');
    const sellBtn = document.getElementById('glyphSellBtn');
    const useBtn = document.getElementById('glyphUseBtn');
    const graphicEl = document.getElementById('glyphActionGraphic');
    const nameEl = document.getElementById('glyphActionName');
    const descEl = document.getElementById('glyphActionDescription');
    const rarityEl = document.getElementById('glyphActionRarity');
    const infoPanelEl = document.getElementById('glyphTooltipInfoPanel');

    let tooltipHoverTimer = null;
    let holdTimer = null;
    let currentSellHandler = null;
    let currentUseHandler = null;

    const closeTooltip = () => {
        tooltip.classList.remove('visible');
        overlay.style.display = 'none';
        // Clean up event listeners to prevent memory leaks
        if (currentSellHandler) {
            sellBtn.removeEventListener('click', currentSellHandler);
            currentSellHandler = null;
        }
        if (currentUseHandler) {
            useBtn.removeEventListener('click', currentUseHandler);
            currentUseHandler = null;
        }
    };

    const populateTooltip = (glyph, state) => {
        graphicEl.textContent = ''; // Clear any old text
        graphicEl.style.backgroundImage = `url('images/glyphs/${glyph.imageName}')`;
        nameEl.textContent = glyph.name;
        rarityEl.textContent = glyph.rarity;
        // Set rarity class for color styling
        rarityEl.className = 'glyph-action-rarity'; // Reset classes first
        rarityEl.classList.add(glyph.rarity.toLowerCase());

        // Handle different states
        if (state === 'HOVER') {
            descEl.innerHTML = `<em>${glyph.description}</em>`; // Placeholder description
            sellInfo.style.display = 'none';
            infoPanelEl.classList.remove('visible');
        } else if (state === 'INFO') {
            // Dynamically build the info panel based on the glyph's effects
            descEl.innerHTML = colorizeTooltipText(glyph.description);
            
            // Re-create a temporary instance to access its methods
            const glyphInstance = new (GLYPH_MAP[glyph.id])();
            let infoContent = '';
            
            // Check for different types of effects and add them to the panel
            if (glyphInstance.onScoring) {
                const scoringEffect = glyphInstance.onScoring(stateObject, { playedTiles: [{ letter: 'A' }] }); // Simulate with a dummy tile
                if (scoringEffect.bonusScore) infoContent += `<span>+${scoringEffect.bonusScore} PTS</span>`;
                if (scoringEffect.bonusMult) infoContent += `<span>+${scoringEffect.bonusMult} MULT</span>`;
            }
            
            infoPanelEl.innerHTML = infoContent || '<span>No Stats</span>';
            infoPanelEl.classList.add('visible');
            sellInfo.style.display = 'none';
        } else if (state === 'HOLD') {
            descEl.innerHTML = `Choose an action for <strong>${glyph.name}</strong>.`;
            sellBtn.textContent = `SELL $${glyph.sellValue}`;
            sellInfo.style.display = 'flex';
            infoPanelEl.classList.remove('visible');
        }
    };

    // --- Event Listeners for Hold, Hover, and Click ---

    glyphsContainer.addEventListener('mousedown', (e) => {
        const slot = e.target.closest('.glyph-slot');
        if (!slot || !slot.classList.contains('filled')) return;

        holdTimer = setTimeout(() => {
            // --- HOLD State ---
            const glyphIndex = parseInt(slot.dataset.glyphIndex, 10);
            const glyph = stateObject.glyphs[glyphIndex];
            if (!glyph) return;

            populateTooltip(glyph, 'HOLD');

            const rect = slot.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

            overlay.style.display = 'block';
            tooltip.classList.add('visible', 'interactive');

            // Attach USE handler (placeholder)
            currentUseHandler = () => {
                console.log(`USE action for ${glyph.name}`);
                closeTooltip();
            };
            useBtn.addEventListener('click', currentUseHandler, { once: true });

            // Attach SELL handler
            currentSellHandler = () => {
                stateObject.money += glyph.sellValue;
                stateObject.glyphs.splice(glyphIndex, 1);
                saveStateCallback(stateObject);
                updateUICallback();
                closeTooltip();
            };
            sellBtn.addEventListener('click', currentSellHandler, { once: true });

        }, 500); // 500ms for long press
    });

    const cancelHold = () => clearTimeout(holdTimer);
    glyphsContainer.addEventListener('mouseup', cancelHold);
    glyphsContainer.addEventListener('mouseleave', cancelHold);

    overlay.addEventListener('click', closeTooltip);

    glyphsContainer.addEventListener('mouseover', (e) => {
        const slot = e.target.closest('.glyph-slot');
        if (!slot || !slot.classList.contains('filled')) return;

        // Don't show hover tooltip if the click-to-sell tooltip is already active
        if (overlay.style.display === 'block') return;

        clearTimeout(tooltipHoverTimer);

        tooltipHoverTimer = setTimeout(() => {
            const glyphIndex = parseInt(slot.dataset.glyphIndex, 10);
            const glyph = stateObject.glyphs[glyphIndex];
            if (!glyph) return;

            // --- HOVER/INFO State ---
            // Decide which tooltip to show based on the options toggle
            const tooltipState = stateObject.showGlyphInfo ? 'INFO' : 'HOVER';
            populateTooltip(glyph, tooltipState);

            tooltip.classList.add('visible'); // Make visible to calculate height

            const rect = slot.getBoundingClientRect();
            // Position tooltip ABOVE the slot for hover
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        }, 300); // 300ms delay
    });

    glyphsContainer.addEventListener('mouseout', () => {
        clearTimeout(tooltipHoverTimer);
        if (!tooltip.classList.contains('interactive')) { // Only hide if it's a non-interactive (hover) tooltip
            tooltip.classList.remove('visible');
        }
    });
}