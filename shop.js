document.addEventListener('DOMContentLoaded', () => {
    const moneyValueEl = document.getElementById('shopMoney');
    const shopScreenEl = document.querySelector('.shop-screen');
    const itemsGridEl = document.getElementById('items-grid');
    const upgradesGridEl = document.getElementById('upgrades-grid');
    const grabBagsGridEl = document.getElementById('grabbags-grid');
    const rerollBtn = document.querySelector('.btn-reroll');

    const bagBtn = document.querySelector('.btn-bag');

    // Bag Modal Element Selectors
    const bagModalOverlay = document.getElementById('bagModalOverlay');
    const closeBagBtn = document.getElementById('btnCloseBagModal');
    const bagGrid = document.getElementById('bagGrid');
    const sortControls = document.querySelector('.sort-controls');
    const tilesRemainingInfo = document.getElementById('tilesRemainingInfo');

    // Pack Opening Modal Element Selectors
    const packOpenOverlay = document.getElementById('packOpenOverlay');
    const packOpenTitle = document.getElementById('packOpenTitle');
    const packOpenSubtitle = document.getElementById('packOpenSubtitle');
    const packOpenGrid = document.getElementById('packOpenGrid');
    const packOpenConfirmBtn = document.getElementById('packOpenConfirm');
    const packOpenSkipBtn = document.getElementById('packOpenSkip');

    const state = {
        runState: {},
        masterTileSet: [],
        bagTiles: [],
        currentBagSort: 'alpha',
        shopItems: [],
        shopUpgrades: [],
        shopGrabBags: [],
    };

    function updateMoneyDisplay() {
        moneyValueEl.textContent = `$${state.runState.money}`;
    }

    function updateRerollButton() {
        const baseRerollCost = 5;
        const rerollCost = Math.max(0, baseRerollCost - (state.runState.rerollCostModifier || 0));
        rerollBtn.textContent = `REROLL $${rerollCost}`;
        rerollBtn.disabled = state.runState.money < rerollCost;
    }

    function generateItemStock() {
        const purchasedGlyphIds = new Set(state.runState.glyphs.map(g => g.id));
        const itemPool = ALL_GLYPHS.filter(glyph => !purchasedGlyphIds.has(glyph.id));
        shuffleArray(itemPool);
        const itemSlots = state.runState.shopItemSlots || 2;
        state.shopItems = itemPool.slice(0, itemSlots);
    }

    function generateUpgradeStock() {
        const purchasedUpgradeIds = new Set(Object.keys(state.runState.upgrades));
        const upgradePool = ALL_UPGRADES.filter(upgrade => {
            if (purchasedUpgradeIds.has(upgrade.id)) return false;
            return !upgrade.prerequisiteId || purchasedUpgradeIds.has(upgrade.prerequisiteId);
        });
        shuffleArray(upgradePool);
        state.shopUpgrades = upgradePool.slice(0, 2);
    }

    function generateGrabBagStock() {
        const grabBagPool = [...ALL_GRAB_BAGS];
        shuffleArray(grabBagPool);
        state.shopGrabBags = grabBagPool.slice(0, 2);
    }

    function generateShopStock(isReroll = false) {
        // Generate items (always happens on initial load and reroll)
        generateItemStock();

        // Only generate upgrades and grab bags on the initial load, not on reroll
        if (!isReroll) {
            generateUpgradeStock();
            generateGrabBagStock();
        }

        renderShop();
    }

    function renderGlyphs() {
        const slotsContainer = document.getElementById('glyphSlots');
        const counterEl = document.getElementById('glyphCounter');
        const maxSlots = 5; // Default number of glyph slots

        slotsContainer.innerHTML = ''; // Clear existing slots

        for (let i = 0; i < maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'glyph-slot';

            const glyph = state.runState.glyphs[i];
            if (glyph) {
                slot.classList.add('filled');
                slot.textContent = glyph.name.substring(0, 2).toUpperCase();
                slot.dataset.glyphIndex = i; // Store index for selling
            }
            slotsContainer.appendChild(slot);
        }
        counterEl.textContent = `${state.runState.glyphs.length}/${maxSlots}`;
    }

    function renderShop() {
        renderSection(itemsGridEl, state.shopItems, 'item');
        renderSection(upgradesGridEl, state.shopUpgrades, 'upgrade');
        renderSection(grabBagsGridEl, state.shopGrabBags, 'grab-bag');
    }

    function renderSection(gridEl, items, type) {
        gridEl.innerHTML = '';
        if (!items || items.length === 0) {
            // Optionally, display a "Sold Out" message
            return;
        }

        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'shop-item';
            itemEl.dataset.id = item.id;
            itemEl.dataset.cost = item.purchaseCost;
            itemEl.dataset.tooltipTitle = item.name;
            itemEl.dataset.tooltipText = item.description;

            // Check if this item has already been purchased
            const isPurchased = state.runState.glyphs.some(g => g.id === item.id) || state.runState.upgrades[item.id];

            itemEl.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-graphic">${item.name.substring(0, 2).toUpperCase()}</div>
                <div class="item-price">${isPurchased ? 'OWNED' : `$${item.purchaseCost}`}</div>
            `;

            if (isPurchased) {
                itemEl.classList.add('purchased');
            } else {
                itemEl.addEventListener('click', () => purchaseItem(item, itemEl));
            }

            gridEl.appendChild(itemEl);
        });
    }

    function purchaseItem(item, element) {
        const cost = item.purchaseCost;
        if (state.runState.money >= cost) {
            // Check if the player has room for a new glyph
            if (item instanceof Glyph && state.runState.glyphs.length >= 5) {
                showError("NO ROOM");
                shakeScreen();
                return; // Stop the purchase
            }

            // 1. Deduct cost
            state.runState.money -= cost;

            // 2. Add item to player's state
            if (item.type === 'Upgrade') {
                const UpgradeClass = UPGRADE_MAP[item.id];
                if (UpgradeClass) {
                    const upgradeInstance = new UpgradeClass();
                    upgradeInstance.onPurchase(state.runState); // Apply the effect
                    state.runState.upgrades[item.id] = true; // Mark as purchased
                }
            } else if (item instanceof GrabBag) {
                // Handle Grab Bag purchase by opening the pack modal
                openGrabBag(item);
            } else { // It's a Glyph
                const plainGlyphObject = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    rarity: item.rarity,
                    tags: item.tags,
                    purchaseCost: item.purchaseCost,
                    sellValue: item.sellValue,
                };
                state.runState.glyphs.push(plainGlyphObject);
            }

            // 3. Save the updated state
            saveRunState(state.runState);

            // 4. Update UI
            updateMoneyDisplay();
            updateRerollButton(); // Update reroll cost in case an upgrade was bought
            renderGlyphs(); // Update the glyph display
            element.classList.add('purchased');
            element.querySelector('.item-price').textContent = 'OWNED';
            
            // Clone and replace to remove the event listener
            element.replaceWith(element.cloneNode(true));
        } else {
            showError("NOT ENOUGH MONEY");
            shakeScreen();
        }
    }

    function rerollItems() {
        const baseRerollCost = 5;
        const rerollCost = Math.max(0, baseRerollCost - (state.runState.rerollCostModifier || 0));
        if (state.runState.money >= rerollCost) {
            state.runState.money -= rerollCost;
            saveRunState(state.runState);
            updateMoneyDisplay();
            updateRerollButton(); // Re-check if the player can afford another reroll
            generateShopStock(true); // Reroll only the items
        } else {
            showError("NOT ENOUGH MONEY");
            shakeScreen();
        }
    }

    function init() {
        state.runState = getRunState();
        
        // Ensure glyphs array exists
        if (!state.runState.glyphs) {
            state.runState.glyphs = [];
        }

        // Load master tile set from the run state object
        state.masterTileSet = state.runState.masterTileSet || [];

        updateMoneyDisplay();
        updateRerollButton();
        renderGlyphs();
        generateShopStock();

        initializeGenericTooltips('.shop-main', '.shop-item'); // For hover tooltips on shop items
        initGlyphInteractions(state.runState, saveRunState, () => {
            renderGlyphs();
            updateMoneyDisplay();
        });
        // Add event listeners
        rerollBtn.addEventListener('click', rerollItems);
        bagBtn.addEventListener('click', openBagModal);
        closeBagBtn.addEventListener('click', closeBagModal);
        bagModalOverlay.addEventListener('click', (e) => {
            if (e.target === bagModalOverlay) closeBagModal();
        });
        sortControls.addEventListener('click', (e) => {
            const sortBtn = e.target.closest('.sort-btn');
            if (sortBtn && sortBtn.dataset.sort) {
                sortBagTiles(sortBtn.dataset.sort);
            }
        });
    }


    // --- GRAB BAG (PACK OPENING) MODAL LOGIC ---

    function generateLoot(grabBag) {
        const loot = [];
        let sourcePool = [];

        // Determine the source pool based on the loot table
        if (grabBag.lootTable.itemType === 'Glyph') {
            const purchasedGlyphIds = new Set(state.runState.glyphs.map(g => g.id));
            sourcePool = ALL_GLYPHS.filter(glyph => !purchasedGlyphIds.has(glyph.id));
        }
        // TODO: Add cases for Tarot, Spectral, etc.
        else if (grabBag.lootTable.itemType === 'PlayingTile') {
            // For tile bags, we generate new random tiles
            for (let i = 0; i < grabBag.packSize; i++) {
                const letter = TILE_DISTRIBUTION[Math.floor(Math.random() * TILE_DISTRIBUTION.length)];
                loot.push(new Tile(letter));
            }
            return loot;
        }

        shuffleArray(sourcePool);
        return sourcePool.slice(0, grabBag.packSize);
    }

    function openGrabBag(grabBag) {
        shopScreenEl.style.display = 'none'; // Hide shop
        packOpenOverlay.style.display = 'flex'; // Show modal

        // 1. Set modal titles
        packOpenTitle.textContent = grabBag.name;
        packOpenSubtitle.textContent = grabBag.description;

        // 2. Generate and display loot
        const lootItems = generateLoot(grabBag);
        let selectedItems = [];

        packOpenGrid.innerHTML = '';
        lootItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'pack-open-item';
            itemEl.dataset.itemId = item.id;

            // Customize display based on item type
            if (item instanceof Tile) {
                const displayLetter = item.letter === 'Q' ? 'Qu' : item.letter;
                itemEl.innerHTML = `${displayLetter}<span class="val">${item.value}</span>`;
                itemEl.style.fontFamily = 'm6x11plus';
                itemEl.style.fontSize = '36px';
            } else { // Glyphs, Upgrades, etc.
                itemEl.innerHTML = `
                    <div class="item-name">${item.name}</div>
                    <div class="item-graphic">${item.name.substring(0, 2).toUpperCase()}</div>
                `;
            }

            itemEl.addEventListener('click', () => {
                if (selectedItems.includes(item)) {
                    selectedItems = selectedItems.filter(i => i !== item);
                    itemEl.classList.remove('selected');
                } else {
                    if (selectedItems.length < grabBag.picks) {
                        selectedItems.push(item);
                        itemEl.classList.add('selected');
                    }
                }
                packOpenConfirmBtn.textContent = `CONFIRM (${selectedItems.length}/${grabBag.picks})`;
                packOpenConfirmBtn.disabled = selectedItems.length !== grabBag.picks;
            });
            packOpenGrid.appendChild(itemEl);
        });
        
        // 3. Set up action buttons
        packOpenConfirmBtn.textContent = `CONFIRM (0/${grabBag.picks})`;
        packOpenConfirmBtn.disabled = true;

        packOpenConfirmBtn.onclick = () => {
            // Add selected items to the player's state
            selectedItems.forEach(item => {
                if (item instanceof Tile) {
                    state.runState.masterTileSet.push(item);
                } else if (item instanceof Glyph) {
                    const plainGlyphObject = {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        rarity: item.rarity,
                        tags: item.tags,
                        purchaseCost: item.purchaseCost,
                        sellValue: item.sellValue,
                    };
                    state.runState.glyphs.push(plainGlyphObject);
                }
            });
            saveRunState(state.runState);
            closePackOpenModal();
            renderGlyphs(); // Update glyph display after adding new ones
        };

        packOpenSkipBtn.onclick = () => {
            closePackOpenModal();
        };
    }

    function closePackOpenModal() {
        packOpenOverlay.style.display = 'none';
        shopScreenEl.style.display = 'flex';
        generateShopStock(); // Refresh shop to remove the purchased grab bag
    }

    // --- BAG MODAL FUNCTIONS ---
    function openBagModal() {
        if (tilesRemainingInfo) {
            // In the shop, all tiles are available for the next round.
            tilesRemainingInfo.textContent = `Tiles remaining: ${state.masterTileSet.length}`;
        }

        // In the shop, all tiles are considered available for the next round.
        state.bagTiles = state.masterTileSet.map(tile => ({
            ...tile,
            isAvailable: true
        }));

        // Render purchased upgrades
        const upgradesGrid = document.getElementById('bagUpgradesGrid');
        upgradesGrid.innerHTML = '';
        const purchasedUpgradeIds = Object.keys(state.runState.upgrades);
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

        sortBagTiles(state.currentBagSort, false); // Sort without re-rendering
        renderBagTiles();
        bagModalOverlay.style.display = 'flex';
    }

    function closeBagModal() {
        bagModalOverlay.style.display = 'none';
    }

    function sortBagTiles(sortBy, shouldRender = true) {
        state.currentBagSort = sortBy;

        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === sortBy);
        });

        if (sortBy === 'alpha') {
            state.bagTiles.sort((a, b) => a.letter.localeCompare(b.letter));
        } else if (sortBy === 'value') {
            // Sort by value descending, then alphabetically for ties
            state.bagTiles.sort((a, b) => {
                return (b.value + b.mult) - (a.value + a.mult) || a.letter.localeCompare(b.letter);
            });
        } else if (sortBy === 'type') {
            // Define a sort order for modifiers
            const MODIFIER_SORT_ORDER = {
                'multiplier': 3,
                'booster': 2,
            };
            state.bagTiles.sort((a, b) => {
                const aOrder = MODIFIER_SORT_ORDER[a.modifier] || 1;
                const bOrder = MODIFIER_SORT_ORDER[b.modifier] || 1;
                return bOrder - aOrder || a.letter.localeCompare(b.letter);
            });
        }

        if (shouldRender) {
            renderBagTiles();
        }
    }

    function renderBagTiles() {
        bagGrid.innerHTML = '';
        state.bagTiles.forEach(tileObject => {
            const tile = document.createElement('div');
            tile.className = 'bag-tile';
            if (!tileObject.isAvailable) {
                tile.classList.add('used');
            }

            const displayLetter = tileObject.letter === 'Q' ? 'Qu' : tileObject.letter === '_' ? '' : tileObject.letter;
            const displayValue = tileObject.value + tileObject.mult;
            tile.innerHTML = `${displayLetter}<span class="val">${displayValue}</span>`;

            if (tileObject.modifier === 'booster') {
                tile.classList.add('enhanced-booster');
            } else if (tileObject.modifier === 'multiplier') {
                const multIcon = document.createElement('div');
                multIcon.className = 'mult-icon';
                multIcon.textContent = '×';
                tile.appendChild(multIcon);
            }

            bagGrid.appendChild(tile);
        });
    }

    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.animation = 'errorShake 0.5s ease-in-out';
        document.body.appendChild(errorEl);
        // Assuming sounds are loaded and available
        // if (sounds.error) sounds.error.play();
        setTimeout(() => { errorEl.remove(); }, 2000);
    }

    function shakeScreen() {
        const screen = document.querySelector('.shop-screen');
        if (screen) {
            screen.style.animation = 'screenShake 0.5s ease-in-out';
            setTimeout(() => { screen.style.animation = ''; }, 500);
        }
    }

    // --- UTILITIES ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Initialize the shop
    init();
});