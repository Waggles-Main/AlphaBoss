document.addEventListener('DOMContentLoaded', () => {
    const packShowcase = document.getElementById('pack-showcase');
    const mockMoneyDisplay = document.getElementById('mockMoneyDisplay');
    
    // --- Modal UI Elements ---
    const packOpenOverlay = document.getElementById('packOpenOverlay');
    const packOpenTitle = document.getElementById('packOpenTitle');
    const packOpenSubtitle = document.getElementById('packOpenSubtitle');
    const packTargetGrid = document.getElementById('packTargetGrid');
    const packChoiceGrid = document.getElementById('packChoiceGrid');
    const packOpenActions = document.querySelector('.pack-open-actions');
    const packOpenSkipBtn = document.getElementById('packOpenSkipBtn'); // Assuming this exists

    // --- Game & UI State ---
    let gameState = 'SHOP'; // Can be 'SHOP' or 'CONSUMABLE_CHOICE'
    const mockGameState = { money: 20 };
    const mockPlayerBag = TILE_DISTRIBUTION.map((letter, i) => new Tile(letter, i));
    let activeTarotCard = null;
    let selectedTargetTiles = [];
    let selectedChoiceItems = [];

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
        let lootPool = [];
        if (pack.lootTable.itemType === 'Tarot') {
            lootPool = ALL_CONSUMABLES.filter(c => c.type === 'Tarot');
        } else if (pack.lootTable.itemType === 'Special') {
            lootPool = ALL_SPECIAL_TILES;
        }

        const choices = [...lootPool].sort(() => 0.5 - Math.random()).slice(0, pack.packSize);
        const playerTiles = [...mockPlayerBag].sort(() => 0.5 - Math.random()).slice(0, 8);

        // 3. Render UI
        renderPackUI(pack, playerTiles, choices);
        packOpenOverlay.style.display = 'flex';
    }

    /**
     * The "Game Manager" function to close the pack modal.
     */
    function closeArcanaPack() {
        gameState = 'SHOP';
        activeTarotCard = null;
        selectedChoiceItems = [];
        selectedTargetTiles = [];
        packOpenOverlay.style.display = 'none';
        renderPacks(); // Re-render packs in case one was consumed
    }

    /**
     * The "UI" function to draw the pack opening screen.
     */
    function renderPackUI(pack, playerTiles, choices) {
        // Reset UI
        packOpenTitle.textContent = pack.name;
        packTargetGrid.innerHTML = '';
        packChoiceGrid.innerHTML = '';
        packOpenActions.innerHTML = ''; // Clear old buttons

        if (pack.type === 'Arcana') {
            // For Arcana packs, show the target tiles and a skip button
            packOpenSubtitle.textContent = `Choose a card to use, or skip.`;
            packTargetGrid.parentElement.style.display = 'block'; // Show target section
            playerTiles.forEach(tile => {
                const tileEl = document.createElement('div');
                tileEl.className = 'tile-selection-item';
                tileEl.textContent = tile.letter === 'Q' ? 'Qu' : tile.letter;
                tileEl.onclick = () => onTileTargetSelected(tile, tileEl, playerTiles);
                packTargetGrid.appendChild(tileEl);
            });
            const skipBtn = document.createElement('button');
            skipBtn.id = 'packOpenSkipBtn';
            skipBtn.className = 'btn-secondary';
            skipBtn.textContent = 'Skip';
            skipBtn.onclick = closeArcanaPack;
            packOpenActions.appendChild(skipBtn);
        } else if (pack.type === 'Special') {
            // For Special packs, hide the target tiles and show a confirm button
            packOpenSubtitle.textContent = `Choose ${pack.picks} to add to your bag.`;
            packTargetGrid.parentElement.style.display = 'none'; // Hide target section
            const confirmBtn = document.createElement('button');
            confirmBtn.id = 'packOpenConfirmBtn';
            confirmBtn.className = 'btn-confirm';
            confirmBtn.textContent = 'Confirm';
            confirmBtn.disabled = true;
            confirmBtn.onclick = () => {
                selectedChoiceItems.forEach(item => {
                    mockPlayerBag.push(item); // Simulate adding to bag
                    console.log(`Added Special Tile '${item.name}' to bag.`);
                });
                closeArcanaPack();
            };
            packOpenActions.appendChild(confirmBtn);
        }

        // Render the choices (Tarot or Special)
        choices.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'sandbox-glyph-item';
            // Special tiles use a symbol, others use an image
            if (card.id.startsWith('special_')) {
                cardEl.innerHTML = `<div class="sandbox-glyph-image"><div class="special-tile-symbol">${card.letter}</div></div>`;
            } else {
                cardEl.innerHTML = `<div class="sandbox-glyph-image" style="background-image: url('images/glyphs/${card.imageName}')"></div>`;
            }
            cardEl.onclick = () => onChoiceSelected(card, cardEl, pack);
            packChoiceGrid.appendChild(cardEl);
        });
    }

    /**
     * "UI" function called when a Tarot card is clicked.
     */
    function onChoiceSelected(item, itemEl, pack) {
        if (pack.type === 'Arcana') {
            activeTarotCard = item;
            selectedTargetTiles = []; // Clear previous targets

            // Update visuals for Arcana selection
            document.querySelectorAll('#packChoiceGrid .sandbox-glyph-item').forEach(el => el.classList.remove('active'));
            itemEl.classList.add('active');

            if (item.effect.target === 'NONE') {
                applyTarotEffect(item, []);
            } else {
                packOpenSubtitle.textContent = `Select ${item.effect.details.targetCount} tile(s) to enhance.`;
            }
        } else if (pack.type === 'Special') {
            // Handle multi-selection for Special Tile packs
            const confirmBtn = document.getElementById('packOpenConfirmBtn');
            if (selectedChoiceItems.includes(item)) {
                selectedChoiceItems = selectedChoiceItems.filter(i => i !== item);
                itemEl.classList.remove('selected');
            } else if (selectedChoiceItems.length < pack.picks) {
                selectedChoiceItems.push(item);
                itemEl.classList.add('selected');
            }
            if (confirmBtn) {
                confirmBtn.disabled = selectedChoiceItems.length !== pack.picks;
            }
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

        ALL_GRAB_BAGS.filter(p => ['Arcana', 'Special'].includes(p.type)).forEach(pack => {
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
    updateMoneyDisplay();
    renderPacks();
});