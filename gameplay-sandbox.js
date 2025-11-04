document.addEventListener('DOMContentLoaded', () => {
    const showcase = document.getElementById('gameplay-showcase');
    if (!showcase) return;
    if (typeof TILE_DISTRIBUTION === 'undefined') return; // Ensure definitions are loaded

    // --- MOCK GAME STATE ---
    const mockState = {
        round: 1,
        stage: 'QUIZ',
        currentScore: 0,
        targetScore: 120,
        wordsLeft: 5,
        refreshesLeft: 5,
        money: 4,
        grid: [], // For the playable tiles
        selected: [], // For the tiles in the scoring area
    };
    mockState.glyphs = [];

    // --- DOM ELEMENT REFERENCES ---
    const roundEl = document.getElementById('gs-round');
    const stageEl = document.getElementById('gs-stage');
    const currentScoreEl = document.getElementById('gs-current-score');
    const targetScoreEl = document.getElementById('gs-target-score');
    const progressFillEl = document.getElementById('gs-progress-fill');
    const wordsLeftEl = document.getElementById('gs-words-left');
    const refreshesLeftEl = document.getElementById('gs-refreshes-left');
    const moneyEl = document.getElementById('gs-money');
    const glyphSlotsContainer = document.getElementById('gs-glyph-slots');
    const consumableSlotsContainer = document.getElementById('gs-consumable-slots');
    const sandboxGridEl = document.getElementById('sandboxTileGrid');
    const playedTilesArea = document.getElementById('playedTilesArea');
    const calcValueEl = document.getElementById('calcValue');
    const calcMultEl = document.getElementById('calcMult');
    const calcMultMultEl = document.getElementById('calcMultMult');
    const calcTotalEl = document.getElementById('calcTotal');

    /**
     * Renders the game state information into the UI panel.
     */
    function renderGameState() {
        if (!roundEl) return; // Guard to ensure elements exist

        roundEl.textContent = mockState.round;
        stageEl.textContent = mockState.stage;
        currentScoreEl.textContent = mockState.currentScore;
        targetScoreEl.textContent = mockState.targetScore;
        wordsLeftEl.textContent = mockState.wordsLeft;
        refreshesLeftEl.textContent = mockState.refreshesLeft;
        moneyEl.textContent = `$${mockState.money}`;

        // Calculate and update the progress bar
        const progressPercentage = (mockState.currentScore / mockState.targetScore) * 100;
        progressFillEl.style.width = `${Math.min(100, progressPercentage)}%`;
    }

    /**
     * Renders the glyph and consumable slots into the UI.
     */
    function renderItemSlots() {
        // Render Glyphs
        if (glyphSlotsContainer) {
            glyphSlotsContainer.innerHTML = '';
            const maxGlyphSlots = 5;
            for (let i = 0; i < maxGlyphSlots; i++) {
                const slot = document.createElement('div');
                slot.className = 'glyph-slot'; // Use existing style from gameplay.css
                glyphSlotsContainer.appendChild(slot);
            }
        }

        // Render Consumables
        if (consumableSlotsContainer) {
            consumableSlotsContainer.innerHTML = '';
            const maxConsumableSlots = 4;
            for (let i = 0; i < maxConsumableSlots; i++) {
                const slot = document.createElement('div');
                slot.className = 'consumable-slot'; // Use existing style from gameplay.css
                consumableSlotsContainer.appendChild(slot);
            }
        }
    }

    /**
     * Renders the scoring area, which now acts as a drop zone.
     */
    function renderScoringArea() {
        // Render the chips based on the selected tiles
        if (playedTilesArea) {
            playedTilesArea.innerHTML = '';
            const numSlots = 8; // Always show 8 slots
            playedTilesArea.style.gridTemplateColumns = `repeat(${numSlots}, 1fr)`;

            for (let i = 0; i < numSlots; i++) {
                const slot = document.createElement('div');
                slot.className = 'chip-slot';
                const tile = mockState.selected[i];
                if (tile) {
                    const chip = document.createElement('div');
                    chip.className = 'chip';
                    chip.textContent = tile.letter === 'Q' ? 'Qu' : tile.letter;
                    slot.appendChild(chip);
                }
                playedTilesArea.appendChild(slot);
            }
        }
        // In a real game, you would recalculate the score here.
    }

    /**
     * Generates the playable tile grid for the sandbox.
     */
    function generateSandboxGrid() {
        if (!sandboxGridEl) return;
        sandboxGridEl.innerHTML = '';
        mockState.grid = [];

        const rows = 4;
        const cols = 4;
        sandboxGridEl.style.setProperty('--grid-rows', rows);
        sandboxGridEl.style.setProperty('--grid-cols', cols);

        for (let i = 0; i < rows * cols; i++) {
            const tileObject = new Tile(TILE_DISTRIBUTION[i % TILE_DISTRIBUTION.length], i);
            mockState.grid.push(tileObject);

            const tileEl = document.createElement('button');
            tileEl.className = 'tile';
            tileEl.dataset.index = i;
            tileEl.setAttribute('draggable', true);

            const tileAnimator = document.createElement('div');
            tileAnimator.className = 'tile-animator';
            tileEl.appendChild(tileAnimator);

            const tileContent = document.createElement('div');
            tileContent.className = 'tile-content';
            tileContent.innerHTML = `${tileObject.letter}<span class="val">${tileObject.value}</span>`;
            tileAnimator.appendChild(tileContent);

            sandboxGridEl.appendChild(tileEl);
        }
    }

    /**
     * Initializes all drag and drop functionality.
     */
    function initDragAndDrop() {
        const tiles = document.querySelectorAll('#sandboxTileGrid .tile');
        tiles.forEach(tile => {
            tile.addEventListener('dragstart', (e) => {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.index);
            });
            tile.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        playedTilesArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            playedTilesArea.classList.add('drag-over');
        });

        playedTilesArea.addEventListener('dragleave', () => {
            playedTilesArea.classList.remove('drag-over');
        });

        playedTilesArea.addEventListener('drop', (e) => {
            e.preventDefault();
            playedTilesArea.classList.remove('drag-over');
            const tileIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const tileObject = mockState.grid[tileIndex];
            if (tileObject && !mockState.selected.includes(tileObject)) {
                mockState.selected.push(tileObject);
                renderScoringArea(); // Re-render the chips
            }
        });
    }

    // --- INITIALIZATION ---
    console.log('Gameplay Sandbox Initialized.');
    renderGameState();
    renderItemSlots();
    renderScoringArea();
    generateSandboxGrid();
    initDragAndDrop();
});