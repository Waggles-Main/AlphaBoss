/**
 * =============================================================================
 * SHARED LOGIC
 * Contains utility functions and state management used across multiple files.
 * =============================================================================
 */

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
    const sellBtn = document.getElementById('glyphSellBtn');
    const sellValueEl = document.getElementById('glyphSellValue');
    const graphicEl = document.getElementById('glyphActionGraphic');
    const nameEl = document.getElementById('glyphActionName');
    const descEl = document.getElementById('glyphActionDescription');
    const rarityEl = document.getElementById('glyphActionRarity');

    let currentSellHandler = null;

    const closeTooltip = () => {
        tooltip.classList.remove('visible');
        overlay.style.display = 'none';
        if (currentSellHandler) {
            sellBtn.removeEventListener('click', currentSellHandler);
            currentSellHandler = null;
        }
    };

    glyphsContainer.addEventListener('click', (e) => {
        const slot = e.target.closest('.glyph-slot');
        if (!slot || !slot.classList.contains('filled')) return;

        const glyphIndex = parseInt(slot.dataset.glyphIndex, 10);
        const glyph = stateObject.glyphs[glyphIndex];
        if (!glyph) return;

        // Populate tooltip
        graphicEl.textContent = glyph.name.substring(0, 2).toUpperCase();
        nameEl.textContent = glyph.name;
        descEl.innerHTML = colorizeTooltipText(glyph.description);
        rarityEl.textContent = glyph.rarity;
        sellValueEl.textContent = `$${glyph.sellValue}`;

        // Position tooltip
        const rect = slot.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

        // Show tooltip and overlay
        overlay.style.display = 'block';
        tooltip.classList.add('visible');

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
}