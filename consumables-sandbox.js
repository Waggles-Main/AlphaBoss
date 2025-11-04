document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const consumableShowcase = document.getElementById('consumable-showcase');
    const playerConsumablesContainer = document.getElementById('playerConsumablesContainer');
    const testGridEl = document.getElementById('consumableTestGrid');
    const wildTileProgressBar = document.getElementById('wildTileProgressBar');
    const playerGlyphsContainer = document.getElementById('playerGlyphsContainer');
    const mockMoneyDisplay = document.getElementById('mockMoneyDisplay');
    const tileSelectionModal = document.getElementById('tileSelectionModalOverlay');
    const tileSelectionGrid = document.getElementById('tileSelectionGrid');
    const tileSelectionTitle = document.getElementById('tileSelectionTitle');
    const tileSelectionSubtitle = document.getElementById('tileSelectionSubtitle');
    const tileSelectionConfirmBtn = document.getElementById('tileSelectionConfirmBtn');

    // --- MOCK DATA FOR SANDBOX TESTING ---
    const mockPlayerBag = TILE_DISTRIBUTION.map((letter, i) => new Tile(letter, i));
    let mockPlayerConsumables = [];
    if (typeof ALL_CONSUMABLES !== 'undefined') {
        mockPlayerConsumables = [
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_fool')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_magician')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_priestess')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_empress')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_emperor')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_hierophant')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_lovers')),
            new TarotTile(ALL_CONSUMABLES.find(c => c.id === 'tarot_justice')),
        ];
    }

    // Simulate the player having a few glyphs with different sell values.
    const mockPlayerGlyphs = [
        ALL_GLYPHS.find(g => g.id === 'glyph_a'),       // Sell value: 2
        ALL_GLYPHS.find(g => g.id === 'glyph_ampersand'), // Sell value: 3
        ALL_GLYPHS.find(g => g.id === 'glyph_star'),      // Sell value: 5
    ];

    const mockGameState = {
        money: 15, // Start with some money to test the doubling effect.
        wildTilePieces: 0, // For The Lovers effect
        lastConsumableUsedId: null, // Start with no consumable having been used.
    };
    // Create a mock grid of 16 tiles for testing effects.
    const mockGridState = Array.from({ length: 16 }, (_, i) => new Tile(TILE_DISTRIBUTION[i], i));

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
                // Use the new handler map to call the correct function
                const handler = consumableHandlers[item.id];
                if (handler) {
                    handler(item);
                } else {
                    console.log(`Use action for ${item.name} (no sandbox handler implemented).`);
                }
            });

            // Special logic for The Fool: disable its button if no consumable has been used.
            if (item.id === 'tarot_fool' && mockGameState.lastConsumableUsedId === null) {
                useBtn.disabled = true;
            }
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
    function handleTheMagician(item) {
        const effectDetails = { enhancement: 'Lucky', targetCount: 2 };
        const tilesToDisplay = [...mockPlayerBag].sort(() => 0.5 - Math.random()).slice(0, 8);
        let selectedTiles = [];

        // --- Game State Update ---
        mockGameState.lastConsumableUsedId = item.id;
        console.log(`Set lastConsumableUsedId to: ${item.id}`);

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
     * Handles the logic for "The Magician" effect.
     */
    function handleTheMagician(item) {
        openTileSelectionModal({
            item,
            title: 'The Magician',
            subtitle: `Select ${item.effect.details.targetCount} tiles to make Lucky.`,
            targetCount: item.effect.details.targetCount,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles.forEach(tile => {
                    tile.modifier = 'lucky_tile';
                    console.log(`The Magician applied 'Lucky' to tile '${tile.letter}'.`);
                });
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The High Priestess" effect.
     */
    function handleTheHighPriestess(item) {
        const gemPool = ['Amethyst', 'Emerald', 'Sapphire', 'Garnet', 'Ruby', 'Crystal', 'Diamond'];
        const tilesToEnhance = [...mockGridState].sort(() => 0.5 - Math.random()).slice(0, 2);

        tilesToEnhance.forEach(tile => {
            // Pick a random gem from the pool
            const randomGem = gemPool[Math.floor(Math.random() * gemPool.length)];
            // Apply the enhancement to the tile object
            tile.gemModifier = randomGem;
            console.log(`High Priestess applied '${randomGem}' to tile '${tile.letter}' at index ${tile.index}`);
        });

        consumeCard(item);
        // Re-render the grid to show the visual changes
        renderTestGrid();
        // Re-render the player's inventory to update The Fool's state
        renderPlayerConsumables();
    }

    /**
     * Handles the logic for "The Emperor" effect.
     */
    function handleTheEmperor(item) {
        const MAX_CONSUMABLE_SLOTS = 4;
        const cardsToCreate = 2;
        const emptySlots = MAX_CONSUMABLE_SLOTS - mockPlayerConsumables.length;

        if (emptySlots < cardsToCreate) {
            console.log("Not enough room for The Emperor's effect!");
            // In a real game, you would show a UI error message here.
            return;
        }

        consumeCard(item, false); // Consume the card but don't re-render hand yet
        // Remove The Emperor from the player's inventory
        const emperorIndex = mockPlayerConsumables.findIndex(c => c.id === item.id);
        if (emperorIndex > -1) {
            mockPlayerConsumables.splice(emperorIndex, 1);
        }

        // Create two new random Tarot cards
        for (let i = 0; i < cardsToCreate; i++) {
            const randomCardDef = ALL_CONSUMABLES[Math.floor(Math.random() * ALL_CONSUMABLES.length)];
            mockPlayerConsumables.push(new TarotTile(randomCardDef));
            console.log(`The Emperor created: ${randomCardDef.name}`);
        }

        // Re-render the player's inventory to show the new cards
        renderPlayerConsumables();
    }

    /**
     * Handles the logic for "The Hierophant" effect.
     */
    function handleTheHierophant(item) {
        openTileSelectionModal({
            item,
            title: 'The Hierophant',
            subtitle: 'Select 2 tiles to Boost.',
            targetCount: 2,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles.forEach(tile => {
                    tile.modifier = 'booster';
                    tile.mult = tile.rarity === 'Gold' ? 20 : tile.rarity === 'Silver' ? 10 : 5;
                    console.log(`Hierophant applied 'booster' to tile '${tile.letter}'.`);
                });
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "Strength" effect.
     */
    function handleTheStrength(item) {
        openTileSelectionModal({
            item,
            title: 'Strength',
            subtitle: 'Select 2 tiles to empower.',
            targetCount: 2,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles.forEach(tile => {
                    tile.value += 10;
                    console.log(`Strength applied +10 PTS to tile '${tile.letter}'.`);
                });
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The Chariot" effect.
     */
    function handleTheChariot(item) {
        openTileSelectionModal({
            item,
            title: 'The Chariot',
            subtitle: 'Select 1 tile to make Steel.',
            targetCount: 1,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles[0].modifier = 'steel_tile';
                console.log(`The Chariot applied 'steel_tile' to tile '${selectedTiles[0].letter}'.`);
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The Devil" effect.
     */
    function handleTheDevil(item) {
        openTileSelectionModal({
            item,
            title: 'The Devil',
            subtitle: 'Select 1 tile to make Gold.',
            targetCount: 1,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles[0].modifier = 'gold_tile';
                console.log(`The Devil applied 'gold_tile' to tile '${selectedTiles[0].letter}'.`);
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The Lovers" effect.
     */
    function handleTheLovers(item) {
        mockGameState.wildTilePieces = (mockGameState.wildTilePieces + 1) % 5; // Cycle 0-4
        updateWildTileProgress();
        consumeCard(item);
        console.log(`The Lovers used. Wild tile progress is now ${mockGameState.wildTilePieces}/4.`);
    }

    /**
     * Handles the logic for "Justice" (Glass Tile) effect.
     */
    function handleJustice(item) {
        openTileSelectionModal({
            item,
            title: 'Justice',
            subtitle: 'Select 1 tile to make Glass.',
            targetCount: 1,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles[0].modifier = 'glass_tile';
                console.log(`Justice applied 'glass_tile' to tile '${selectedTiles[0].letter}'.`);
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The Tower" (Stone Tile) effect.
     */
    function handleTheTower(item) {
        openTileSelectionModal({
            item,
            title: 'The Tower',
            subtitle: 'Select 1 tile to make Stone.',
            targetCount: 1,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles[0].modifier = 'Stone'; // Note: 'Stone' is a debuff
                console.log(`The Tower applied 'Stone' to tile '${selectedTiles[0].letter}'.`);
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The Wheel of Fortune" effect.
     */
    function handleTheWheel(item) {
        if (Math.random() < 0.25) {
            const randomGlyph = mockPlayerGlyphs[Math.floor(Math.random() * mockPlayerGlyphs.length)];
            const editions = ['Foil', 'Holographic', 'Polychrome'];
            const randomEdition = editions[Math.floor(Math.random() * editions.length)];
            randomGlyph.edition = { type: randomEdition };
            console.log(`The Wheel of Fortune triggered! Applied '${randomEdition}' to ${randomGlyph.name}.`);
            renderPlayerGlyphs();
        } else {
            console.log("The Wheel of Fortune spun, but nothing happened.");
        }
        consumeCard(item);
    }

    /**
     * Handles the logic for "The Hanged Man" (Destroy) effect.
     */
    function handleTheHangedMan(item) {
        openTileSelectionModal({
            item,
            title: 'The Hanged Man',
            subtitle: 'Select up to 2 tiles to destroy.',
            targetCount: 2,
            allowPartial: true, // Allow selecting 1 or 2
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                selectedTiles.forEach(tile => {
                    const indexInBag = mockPlayerBag.findIndex(t => t.id === tile.id);
                    if (indexInBag > -1) {
                        mockPlayerBag.splice(indexInBag, 1);
                        console.log(`The Hanged Man destroyed tile '${tile.letter}'.`);
                    }
                });
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "Death" (Convert) effect.
     */
    function handleDeath(item) {
        openTileSelectionModal({
            item,
            title: 'Death',
            subtitle: 'Select 2 tiles. The first will become a copy of the second.',
            targetCount: 2,
            source: mockPlayerBag,
            onConfirm: (selectedTiles) => {
                const [targetTile, sourceTile] = selectedTiles;
                // Copy properties from source to target
                Object.assign(targetTile, {
                    letter: sourceTile.letter,
                    value: sourceTile.value,
                    rarity: sourceTile.rarity,
                });
                console.log(`Death converted tile to a '${targetTile.letter}'.`);
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "Judgement" (Create Glyph) effect.
     */
    function handleJudgement(item) {
        const MAX_GLYPH_SLOTS = 5;
        if (mockPlayerGlyphs.length >= MAX_GLYPH_SLOTS) {
            console.log("Not enough room for Judgement's effect!");
            return;
        }
        const randomGlyph = ALL_GLYPHS[Math.floor(Math.random() * ALL_GLYPHS.length)];
        mockPlayerGlyphs.push(randomGlyph);
        console.log(`Judgement created a new glyph: ${randomGlyph.name}`);
        renderPlayerGlyphs();
        consumeCard(item);
    }

    /**
     * Handles the logic for "The World" (Diamond) effect.
     */
    function handleTheWorld(item) {
        openTileSelectionModal({
            item,
            title: 'The World',
            subtitle: 'Select 1 tile to make Diamond.',
            targetCount: 1,
            source: mockGridState, // Targets the grid
            onConfirm: (selectedTiles) => {
                selectedTiles[0].gemModifier = 'Diamond';
                console.log(`The World applied 'Diamond' to tile '${selectedTiles[0].letter}'.`);
                renderTestGrid();
                consumeCard(item, true);
            }
        });
    }

    /**
     * A generic, reusable function to open the tile selection modal.
     */
    function openTileSelectionModal({ item, title, subtitle, targetCount, source, onConfirm, allowPartial = false }) {
        const tilesToDisplay = [...source].sort(() => 0.5 - Math.random()).slice(0, 8);
        let selectedTiles = [];

        mockGameState.lastConsumableUsedId = item.id;
        console.log(`Set lastConsumableUsedId to: ${item.id}`);

        tileSelectionTitle.textContent = title;
        tileSelectionSubtitle.textContent = subtitle;
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
                } else if (selectedTiles.length < targetCount) {
                    selectedTiles.push(tile);
                    tileEl.classList.add('selected');
                }
                const requiredCount = allowPartial ? 1 : targetCount;
                tileSelectionConfirmBtn.disabled = selectedTiles.length < requiredCount;
            });
            tileSelectionGrid.appendChild(tileEl);
        });

        tileSelectionConfirmBtn.onclick = () => {
            onConfirm(selectedTiles);
            tileSelectionModal.style.display = 'none';
        };
    }

    /**
     * Handles the logic for "The Empress" effect.
     */
    function handleTheEmpress(item) {
        const effectDetails = { enhancement: 'mult_tile', targetCount: 2 };
        const tilesToDisplay = [...mockPlayerBag].sort(() => 0.5 - Math.random()).slice(0, 8);
        let selectedTiles = [];

        // --- Game State Update ---
        mockGameState.lastConsumableUsedId = item.id;
        console.log(`Set lastConsumableUsedId to: ${item.id}`);

        // Configure and show the modal
        tileSelectionTitle.textContent = 'The Empress';
        tileSelectionSubtitle.textContent = `Select ${effectDetails.targetCount} tiles to enhance with Mult.`;
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
                tile.modifier = effectDetails.enhancement;
                tile.type = 'enhancement';
                // Apply the correct mult bonus based on rarity
                tile.mult = tile.rarity === 'Gold' ? 8 : tile.rarity === 'Silver' ? 4 : 2;
                console.log(`The Empress applied '${effectDetails.enhancement}' to tile '${tile.letter}', giving +${tile.mult} Mult.`);
            });
            renderPlayerConsumables();
            tileSelectionModal.style.display = 'none';
        };
    }

    /**
     * Handles the logic for "Temperance" effect.
     */
    function handleTemperance(item) {
        const maxGain = item.effect.details.max_gain || 50;
        
        // Calculate the total sell value of all held glyphs.
        const totalSellValue = mockPlayerGlyphs.reduce((sum, glyph) => sum + glyph.sellValue, 0);
        const moneyToAdd = Math.min(totalSellValue, maxGain);

        console.log(`Temperance triggered. Total glyph sell value: $${totalSellValue}. Money to add: $${moneyToAdd}.`);

        // Update the game state
        mockGameState.money += moneyToAdd;
        mockGameState.lastConsumableUsedId = item.id;

        console.log(`New money total: $${mockGameState.money}`);

        // Re-render UI elements
        updateMoneyDisplay();
        renderPlayerConsumables(); // To update The Fool's state
        mockPlayerConsumables.splice(mockPlayerConsumables.findIndex(c => c.id === item.id), 1);
    }

    /**
     * Handles the logic for "The Hermit" effect.
     */
    function handleTheHermit(item) {
        const maxGain = item.effect.details.max_gain || 20;
        const moneyToAdd = Math.min(mockGameState.money, maxGain);

        console.log(`The Hermit triggered. Current money: $${mockGameState.money}. Money to add: $${moneyToAdd}.`);

        // Update the game state
        mockGameState.money += moneyToAdd;
        mockGameState.lastConsumableUsedId = item.id;

        console.log(`New money total: $${mockGameState.money}`);

        // Re-render UI elements
        updateMoneyDisplay();
        renderPlayerConsumables(); // To update The Fool's state
        // Remove the used card from the player's inventory
        mockPlayerConsumables.splice(mockPlayerConsumables.findIndex(c => c.id === item.id), 1);
    }

    /**
     * Handles the logic for "The Moon" effect.
     */
    function handleTheMoon(item) {
        openTileSelectionModal({
            item,
            title: 'The Moon',
            subtitle: 'Select 3 tiles to become Sapphire.',
            targetCount: 3,
            source: mockGridState,
            onConfirm: (selectedTiles) => {
                selectedTiles.forEach(t => t.gemModifier = 'Sapphire');
                renderTestGrid();
                consumeCard(item, true);
            }
        });
    }

    /**
     * Handles the logic for "The Sun" effect.
     */
    function handleTheSun(item) {
        // This is nearly identical to The Moon, just with different parameters.
        // In a real game, this could be a single generic function.
        const effectDetails = { gem: 'Ruby', targetCount: 2 };
        
        // For brevity in the sandbox, we'll just call the Moon's logic with Sun's details.
        // This is a good example of how you might refactor later.
        tileSelectionTitle.textContent = 'The Sun';
        tileSelectionSubtitle.textContent = `Select ${effectDetails.targetCount} tiles to become Ruby.`;
        handleTheMoon({ ...item, effect: { details: effectDetails } }); // A bit of a sandbox shortcut
    }

    /**
     * Handles the logic for "The Star" effect.
     */
    function handleTheStar(item) {
        // In the sandbox, we'll assume the "gameplay" context.
        const tilesToEnhance = [...mockGridState].sort(() => 0.5 - Math.random()).slice(0, 4);

        tilesToEnhance.forEach(tile => {
            tile.gemModifier = 'Amethyst';
            console.log(`The Star applied 'Amethyst' to tile '${tile.letter}' at index ${tile.index}`);
        });

        consumeCard(item);
        // Re-render the grid and player inventory to show all changes.
        renderTestGrid();
        renderPlayerConsumables();
    }

    /**
     * Handles the logic for "The Fool" effect.
     */
    function handleTheFool(item) {
        if (!mockGameState.lastConsumableUsedId) return;

        // Find the class of the last used consumable from the map
        const LastUsedClass = CONSUMABLE_MAP[mockGameState.lastConsumableUsedId];
        // Find the definition object for that consumable
        const lastUsedDefinition = ALL_CONSUMABLES.find(c => c.id === mockGameState.lastConsumableUsedId);

        if (LastUsedClass && lastUsedDefinition) {
            // Create a new instance of that consumable
            const newCard = new LastUsedClass(lastUsedDefinition);
            // Find where The Fool is in the player's inventory and replace it
            const foolIndex = mockPlayerConsumables.findIndex(c => c.id === item.id);
            if (foolIndex > -1) mockPlayerConsumables.splice(foolIndex, 1, newCard);
            renderPlayerConsumables(); // Re-render the inventory to show the transformation
        }
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
        playerConsumablesContainer.innerHTML = ''; // Clear existing cards
        const numSlots = 8; // Increased to show all test cards

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

    function consumeCard(item, rerenderPlayerHand = true) {
        mockGameState.lastConsumableUsedId = item.id;
        const cardIndex = mockPlayerConsumables.findIndex(c => c.id === item.id);
        if (cardIndex > -1) {
            mockPlayerConsumables.splice(cardIndex, 1);
        }
        if (rerenderPlayerHand) renderPlayerConsumables();
    }

    function updateWildTileProgress() {
        if (wildTileProgressBar) {
            const percentage = (mockGameState.wildTilePieces / 4) * 100;
            wildTileProgressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Renders the mock player glyphs into their container.
     */
    function renderPlayerGlyphs() {
        if (!playerGlyphsContainer) return;
        playerGlyphsContainer.innerHTML = '';

        mockPlayerGlyphs.forEach(glyph => {
            // We can reuse the consumable card factory, as it's generic enough.
            // We just need to make sure the object has the right properties.
            const glyphCard = createConsumableCard({
                ...glyph,
                hasAction: false // Glyphs in this view aren't usable.
            });
            glyphCard.classList.add('is-glyph', glyph.edition?.type.toLowerCase());
            glyphCard.classList.add('is-glyph');
            playerGlyphsContainer.appendChild(glyphCard);
        });
    }

    /**
     * Updates the mock money display on the page.
     */
    function updateMoneyDisplay() {
        if (mockMoneyDisplay) {
            mockMoneyDisplay.textContent = `$${mockGameState.money}`;
        }
    }

    /**
     * Renders the 4x4 test grid.
     */
    function renderTestGrid() {
        if (!testGridEl) return;
        testGridEl.innerHTML = '';

        mockGridState.forEach(tileObject => {
            const tileEl = document.createElement('div');
            // Use the same classes as the main gameplay tiles for consistent styling
            tileEl.className = 'tile';
            tileEl.dataset.index = tileObject.index;

            const tileAnimator = document.createElement('div');
            tileAnimator.className = 'tile-animator';

            const tileContent = document.createElement('div');
            tileContent.className = 'tile-content';
            tileContent.innerHTML = `${tileObject.letter}<span class="val">${tileObject.value}</span>`;

            // Apply gem styling if the tile has a gem modifier
            if (tileObject.gemModifier) {
                tileEl.classList.add('gem-tile', `gem-${tileObject.gemModifier.toLowerCase()}`);
            }

            tileAnimator.appendChild(tileContent);
            tileEl.appendChild(tileAnimator);
            testGridEl.appendChild(tileEl);
        });
    }

    // --- HANDLER MAP ---
    const consumableHandlers = {
        'tarot_fool': handleTheFool,
        'tarot_magician': handleTheMagician,
        'tarot_priestess': handleTheHighPriestess,
        'tarot_empress': handleTheEmpress,
        'tarot_emperor': handleTheEmperor,
        'tarot_hierophant': handleTheHierophant,
        'tarot_lovers': handleTheLovers,
        'tarot_chariot': handleTheChariot,
        'tarot_justice': handleJustice,
        'tarot_hermit': handleTheHermit,
        'tarot_wheel': handleTheWheel,
        'tarot_strength': handleTheStrength,
        'tarot_hanged_man': handleTheHangedMan,
        'tarot_death': handleDeath,
        'tarot_temperance': handleTemperance,
        'tarot_devil': handleTheDevil,
        'tarot_tower': handleTheTower,
        'tarot_star': handleTheStar,
        'tarot_moon': handleTheMoon,
        'tarot_sun': handleTheSun,
        'tarot_judgement': handleJudgement,
        'tarot_world': handleTheWorld,
    };

    // --- INITIALIZATION ---
    updateMoneyDisplay();
    updateWildTileProgress();
    renderPlayerGlyphs();
    renderTestGrid();
    renderPlayerConsumables();
    renderConsumables();
    initDevControls(); // Initialize dev controls
});