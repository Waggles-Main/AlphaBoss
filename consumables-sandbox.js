document.addEventListener('DOMContentLoaded', () => {
    const consumableShowcase = document.getElementById('consumable-showcase');
    const playerConsumablesContainer = document.getElementById('playerConsumablesContainer');
    const tileSelectionModal = document.getElementById('tileSelectionModalOverlay');
    const tileSelectionGrid = document.getElementById('tileSelectionGrid');
    const tileSelectionTitle = document.getElementById('tileSelectionTitle');
    const tileSelectionSubtitle = document.getElementById('tileSelectionSubtitle');
    const tileSelectionConfirmBtn = document.getElementById('tileSelectionConfirmBtn');

    if (typeof ALL_CONSUMABLES === 'undefined') return;

    // --- MOCK DATA FOR SANDBOX TESTING ---
    const mockPlayerBag = TILE_DISTRIBUTION.map((letter, i) => new Tile(letter, i));
    // Simulate the player having the first two consumables in their inventory.
    const mockPlayerConsumables = [ALL_CONSUMABLES[0], ALL_CONSUMABLES[1]];

    /**
     * Creates a DOM element for a single consumable card.
     * This is a reusable factory function to keep the code DRY.
     * @param {Consumable} item - The consumable object.
     * @returns {HTMLElement} - The created card element.
     */
    function createConsumableCard(item) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'sandbox-glyph-item';

        const imageEl = document.createElement('div');
        imageEl.className = 'sandbox-glyph-image';
        imageEl.style.backgroundImage = `url('images/glyphs/${item.imageName}')`;

        const overlay = document.createElement('div');
        overlay.className = 'sandbox-glyph-overlay';

        const nameEl = document.createElement('div');
        nameEl.className = 'overlay-name';
        nameEl.textContent = item.name;

        const descEl = document.createElement('div');
        descEl.className = 'overlay-description';
        descEl.textContent = item.description;

        const sellBtn = document.createElement('button');
        sellBtn.className = 'btn-sandbox-sell';
        sellBtn.textContent = `SELL $${item.sellValue}`;
        sellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`Sell action for ${item.name}`);
            itemContainer.classList.remove('active');
        });

        let useBtn = null;
        if (item.hasAction) {
            useBtn = document.createElement('button');
            useBtn.className = 'btn-sandbox-use';
            useBtn.textContent = 'USE';
            useBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                itemContainer.classList.remove('active');
                if (item.id === 'tarot_magician') {
                    handleTheMagician();
                } else {
                    console.log(`Use action for ${item.name} (no sandbox handler implemented).`);
                }
            });
        }

        itemContainer.addEventListener('click', () => {
            const wasActive = itemContainer.classList.contains('active');
            document.querySelectorAll('.sandbox-glyph-item.active').forEach(el => el.classList.remove('active'));
            if (!wasActive) itemContainer.classList.add('active');
        });

        itemContainer.addEventListener('mouseleave', () => {
            itemContainer.classList.remove('active');
        });

        overlay.append(nameEl, descEl);
        const elementsToAppend = [imageEl, overlay, sellBtn, useBtn].filter(Boolean);
        itemContainer.append(...elementsToAppend);
        return itemContainer;
    }

    /**
     * Handles the logic for "The Magician" effect.
     */
    function handleTheMagician() {
        const effectDetails = { enhancement: 'Lucky', targetCount: 2 };
        const tilesToDisplay = [...mockPlayerBag].sort(() => 0.5 - Math.random()).slice(0, 8);
        let selectedTiles = [];

        tileSelectionTitle.textContent = 'The Magician';
        tileSelectionSubtitle.textContent = `Select ${effectDetails.targetCount} tiles to make Lucky.`;
        tileSelectionConfirmBtn.disabled = true;
        tileSelectionGrid.innerHTML = '';
        tileSelectionModal.style.display = 'flex';

        tilesToDisplay.forEach(tile => {
            const tileEl = document.createElement('div');
            tileEl.className = 'tile-selection-item';
            tileEl.textContent = tile.letter === 'Q' ? 'Qu' : tile.letter;
            tileEl.dataset.tileId = tile.id;
            tileEl.addEventListener('click', () => {
                if (selectedTiles.includes(tile)) {
                    selectedTiles = selectedTiles.filter(t => t !== tile);
                    tileEl.classList.remove('selected');
                } else if (selectedTiles.length < effectDetails.targetCount) {
                    selectedTiles.push(tile);
                    tileEl.classList.add('selected');
                }
                tileSelectionConfirmBtn.disabled = selectedTiles.length !== effectDetails.targetCount;
            });
            tileSelectionGrid.appendChild(tileEl);
        });

        tileSelectionConfirmBtn.onclick = () => {
            selectedTiles.forEach(tile => {
                console.log(`Applying '${effectDetails.enhancement}' to tile: ${tile.letter}`);
            });
            tileSelectionModal.style.display = 'none';
        };
    }

    /**
     * Renders all available consumables into the main showcase.
     */
    function renderConsumables() {
        if (!consumableShowcase) return;
        consumableShowcase.innerHTML = '';
        ALL_CONSUMABLES.forEach(item => {
            const cardElement = createConsumableCard(item);
            consumableShowcase.appendChild(cardElement);
        });
    }

    /**
     * Renders the player's current consumables into the 3 inventory slots.
     */
    function renderPlayerConsumables() {
        if (!playerConsumablesContainer) return;
        playerConsumablesContainer.innerHTML = '';
        const numSlots = 3;

        for (let i = 0; i < numSlots; i++) {
            const item = mockPlayerConsumables[i];
            if (item) {
                const cardElement = createConsumableCard(item);
                playerConsumablesContainer.appendChild(cardElement);
            } else {
                // Render an empty slot
                const emptySlot = document.createElement('div');
                emptySlot.className = 'sandbox-glyph-item empty-slot';
                playerConsumablesContainer.appendChild(emptySlot);
            }
        }
    }

    // --- INITIALIZATION ---
    renderPlayerConsumables();
    renderConsumables();
});