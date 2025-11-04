document.addEventListener('DOMContentLoaded', () => {
    const packShowcase = document.getElementById('pack-showcase');
    const mockMoneyDisplay = document.getElementById('mockMoneyDisplay');

    // --- Modal UI Elements ---
    const packOpenOverlay = document.getElementById('packOpenOverlay');
    const packOpenTitle = document.getElementById('packOpenTitle');
    const packOpenSubtitle = document.getElementById('packOpenSubtitle');
    const packTargetGrid = document.getElementById('packTargetGrid');
    const packChoiceGrid = document.getElementById('packChoiceGrid');
    const packOpenSkipBtn = document.getElementById('packOpenSkipBtn');

    // --- Game & UI State ---
    let gameState = 'SHOP'; // Can be 'SHOP' or 'CONSUMABLE_CHOICE'
    const mockGameState = { money: 20 };
    const mockPlayerBag = TILE_DISTRIBUTION.map((letter, i) => new Tile(letter, i));
    let activeTarotCard = null;
    let selectedTargetTiles = [];

    // --- UI Update Functions ---
    function updateMoneyDisplay() {
        if (mockMoneyDisplay) mockMoneyDisplay.textContent = `$${mockGameState.money}`;
    }

    /**
     * The "Game Manager" function to open a pack.
     */
    function openArcanaPack(pack) {
        if (gameState !== 'SHOP' || mockGameState.money < pack.purchaseCost) return;

        // 1. Update State
        gameState = 'CONSUMABLE_CHOICE';
        mockGameState.money -= pack.purchaseCost;
        updateMoneyDisplay();

        // 2. Generate Data for UI
        const lootPool = ALL_CONSUMABLES.filter(c => c.type === 'Tarot');
        const tarotChoices = [...lootPool].sort(() => 0.5 - Math.random()).slice(0, pack.packSize);
        const playerTiles = [...mockPlayerBag].sort(() => 0.5 - Math.random()).slice(0, 8);

        // 3. Render UI
        renderPackUI(pack, playerTiles, tarotChoices);
        packOpenOverlay.style.display = 'flex';
    }

    /**
     * The "Game Manager" function to close the pack modal.
     */
    function closeArcanaPack() {
        gameState = 'SHOP';
        activeTarotCard = null;
        selectedTargetTiles = [];
        packOpenOverlay.style.display = 'none';
        renderPacks(); // Re-render packs in case one was consumed
    }

    /**
     * The "UI" function to draw the pack opening screen.
     */
    function renderPackUI(pack, playerTiles, tarotChoices) {
        packOpenTitle.textContent = pack.name;
        packOpenSubtitle.textContent = `Choose a card to use, or skip.`;
        packTargetGrid.innerHTML = '';
        packChoiceGrid.innerHTML = '';

        // Render Player's Tiles (Targets)
        playerTiles.forEach(tile => {
            const tileEl = document.createElement('div');
            tileEl.className = 'tile-selection-item';
            tileEl.textContent = tile.letter === 'Q' ? 'Qu' : tile.letter;
            tileEl.onclick = () => onTileTargetSelected(tile, tileEl, playerTiles);
            packTargetGrid.appendChild(tileEl);
        });

        // Render Tarot Cards (Choices)
        tarotChoices.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'sandbox-glyph-item';
            cardEl.innerHTML = `<div class="sandbox-glyph-image" style="background-image: url('images/glyphs/${card.imageName}')"></div>`;
            cardEl.onclick = () => onTarotSelected(card, cardEl, tarotChoices);
            packChoiceGrid.appendChild(cardEl);
        });
    }

    /**
     * "UI" function called when a Tarot card is clicked.
     */
    function onTarotSelected(tarotCard, cardEl, allChoices) {
        activeTarotCard = tarotCard;
        selectedTargetTiles = []; // Clear previous targets

        // Update visuals
        document.querySelectorAll('#packChoiceGrid .sandbox-glyph-item').forEach(el => el.classList.remove('active'));
        cardEl.classList.add('active');

        if (tarotCard.effect.target === 'NONE') {
            // No target needed, apply immediately.
            applyTarotEffect(tarotCard, []);
        } else {
            // Target is needed, update UI prompt.
            packOpenSubtitle.textContent = `Select ${tarotCard.effect.details.targetCount} tile(s) to enhance.`;
        }
    }

    /**
     * "UI" function called when a player tile is clicked.
     */
    function onTileTargetSelected(tile, tileEl) {
        if (!activeTarotCard || activeTarotCard.effect.target === 'NONE') return;

        const requiredCount = activeTarotCard.effect.details.targetCount;

        // Handle selection/deselection
        if (selectedTargetTiles.includes(tile)) {
            selectedTargetTiles = selectedTargetTiles.filter(t => t !== tile);
            tileEl.classList.remove('selected');
        } else if (selectedTargetTiles.length < requiredCount) {
            selectedTargetTiles.push(tile);
            tileEl.classList.add('selected');
        }

        // If we have enough targets, apply the effect.
        if (selectedTargetTiles.length === requiredCount) {
            applyTarotEffect(activeTarotCard, selectedTargetTiles);
        }
    }

    /**
     * The "Game Manager" function to apply the effect.
     */
    function applyTarotEffect(tarotCard, targets) {
        console.log(`Applying effect of ${tarotCard.name}...`);
        const effectType = tarotCard.effect.type;

        if (effectType === 'ADD_MONEY') {
            const moneyToAdd = Math.min(mockGameState.money, tarotCard.effect.details.max_gain);
            mockGameState.money += moneyToAdd;
            updateMoneyDisplay();
            console.log(`Added $${moneyToAdd}.`);
        } else if (effectType === 'MODIFY_TILE') {
            targets.forEach(tile => {
                tile.modifier = tarotCard.effect.details.enhancement;
                console.log(`Applied '${tile.modifier}' to tile '${tile.letter}'.`);
            });
        }
        // ... other effect types would go here ...

        // Close the pack modal after the effect is applied.
        setTimeout(closeArcanaPack, 500); // Small delay for visual feedback
    }

    /**
     * Renders the available packs in the main showcase.
     */
    function renderPacks() {
        if (!packShowcase || typeof ALL_GRAB_BAGS === 'undefined') return;
        packShowcase.innerHTML = '';

        ALL_GRAB_BAGS.filter(p => p.type === 'Arcana').forEach(pack => {
            const packContainer = document.createElement('div');
            packContainer.className = 'pack-item';
            packContainer.innerHTML = `
                <h3 class="pack-name">${pack.name}</h3>
                <p class="pack-description">${pack.description}</p>
                <div class="pack-cost">$${pack.purchaseCost}</div>
            `;
            packContainer.addEventListener('click', () => openArcanaPack(pack));
            packShowcase.appendChild(packContainer);
        });
    }

    // --- INITIALIZATION ---
    packOpenSkipBtn.addEventListener('click', closeArcanaPack);
    updateMoneyDisplay();
    renderPacks();
});