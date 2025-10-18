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

// --- UTILITIES ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- SHARED UI INTERACTIONS ---

function initGlyphInteractions(stateObject, saveStateCallback, updateUICallback) {
    const glyphsContainer = document.getElementById('glyphsSection');
    const tooltip = document.getElementById('glyphActionTooltip');
    const overlay = document.getElementById('glyphActionOverlay');
    if (!glyphsContainer || !tooltip || !overlay) return;

    // Tooltip elements
    const sellInfo = document.getElementById('glyphSellInfo');
    const sellBtn = document.getElementById('glyphSellBtn');
    const sellValueEl = document.getElementById('glyphSellValue');
    const graphicEl = document.getElementById('glyphActionGraphic');
    const nameEl = document.getElementById('glyphActionName');
    const descEl = document.getElementById('glyphActionDescription');
    const rarityEl = document.getElementById('glyphActionRarity');

    let tooltipHoverTimer = null;
    let currentSellHandler = null;

    const closeTooltip = () => {
        tooltip.classList.remove('visible');
        overlay.style.display = 'none';
        tooltip.classList.remove('interactive');
        if (currentSellHandler) {
            sellBtn.removeEventListener('click', currentSellHandler);
            currentSellHandler = null;
        }
    };

    const populateTooltip = (glyph) => {
        graphicEl.textContent = glyph.name.substring(0, 2).toUpperCase();
        nameEl.textContent = glyph.name;
        descEl.innerHTML = colorizeTooltipText(glyph.description);
        rarityEl.textContent = glyph.rarity;
        sellValueEl.textContent = `$${glyph.sellValue}`;
    };

    glyphsContainer.addEventListener('click', (e) => {
        const slot = e.target.closest('.glyph-slot');
        if (!slot || !slot.classList.contains('filled')) return;

        const glyphIndex = parseInt(slot.dataset.glyphIndex, 10);
        const glyph = stateObject.glyphs[glyphIndex];
        if (!glyph) return;

        // Populate tooltip
        populateTooltip(glyph);
        sellInfo.style.display = 'flex'; // Ensure sell info is visible on click

        // Position tooltip
        const rect = slot.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`; // Position above
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

        // Show tooltip and overlay
        overlay.style.display = 'block';
        tooltip.classList.add('visible');
        tooltip.classList.add('interactive'); // Make it clickable

        // Define and attach the sell handler
        currentSellHandler = () => {
            // 1. Add money
            stateObject.money += glyph.sellValue;
            // 2. Remove glyph
            stateObject.glyphs.splice(glyphIndex, 1);
            // 3. Save state and update UI
            saveStateCallback(stateObject);
            updateUICallback(); // This will call renderGlyphs() and updateMoneyDisplay()
            closeTooltip();
        };
        sellBtn.addEventListener('click', currentSellHandler, { once: true });
    });

    overlay.addEventListener('click', closeTooltip);

    // --- New Hover Logic ---
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

            populateTooltip(glyph);
            sellInfo.style.display = 'none'; // Hide sell info for hover preview

            tooltip.classList.add('visible'); // Make it visible to calculate its height

            const rect = slot.getBoundingClientRect();
            // Position tooltip ABOVE the slot for hover
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        }, 300); // 300ms delay
    });

    glyphsContainer.addEventListener('mouseout', () => {
        clearTimeout(tooltipHoverTimer);
        if (overlay.style.display !== 'block') { // Only hide if it's a hover tooltip
            tooltip.classList.remove('visible');
            tooltip.classList.remove('interactive');
        }
    });
}