document.addEventListener('DOMContentLoaded', () => {
    const moneyValueEl = document.getElementById('shopMoney');
    const shopScreenEl = document.querySelector('.shop-screen');
    const bagBtn = document.querySelector('.btn-bag');

    // Bag Modal Element Selectors
    const bagModalOverlay = document.getElementById('bagModalOverlay');
    const closeBagBtn = document.getElementById('btnCloseBagModal');
    const bagGrid = document.getElementById('bagGrid');
    const sortControls = document.querySelector('.sort-controls');
    const tilesRemainingInfo = document.getElementById('tilesRemainingInfo');

    // Booster Pack Modal Element Selectors
    const boosterPackOverlay = document.getElementById('boosterPackOverlay');
    const boosterPackGrid = document.getElementById('boosterPackGrid');
    const boosterPackConfirmBtn = document.getElementById('boosterPackConfirm');
    const boosterPackSkipBtn = document.getElementById('boosterPackSkip');

    const state = {
        masterTileSet: [],
        upgrades: {},
        bagTiles: [],
        currentBagSort: 'alpha',
    };

    // Load money from localStorage
    const savedMoney = localStorage.getItem('alphaBossMoney');
    const money = savedMoney ? parseInt(savedMoney, 10) : 0;

    // Load purchased upgrades
    const savedUpgrades = localStorage.getItem('alphaBossUpgrades');
    state.upgrades = savedUpgrades ? JSON.parse(savedUpgrades) : {};

    // Load tile pool from localStorage
    const savedMasterSet = localStorage.getItem('alphaBossMasterTileSet');
    state.masterTileSet = savedMasterSet ? JSON.parse(savedMasterSet) : [];

    // Display the money
    if (moneyValueEl) {
        moneyValueEl.textContent = `$${money}`;
    }

    // --- SHOP ITEM LOGIC ---
    function initializeShopItems() {
        const boosterPackItem = document.getElementById('item-booster-pack');
        const topRowUpgrade = document.getElementById('upgrade-top-row');

        boosterPackItem.addEventListener('click', () => purchaseBoosterPack(boosterPackItem));

        if (state.upgrades.topRow) {
            topRowUpgrade.classList.add('purchased');
            topRowUpgrade.querySelector('.item-price').textContent = 'OWNED';
        } else {
            topRowUpgrade.addEventListener('click', () => purchaseUpgrade('topRow', topRowUpgrade));
        }

    }

    function purchaseUpgrade(upgradeId, element) {
        const cost = parseInt(element.dataset.cost, 10);
        const currentMoney = parseInt(localStorage.getItem('alphaBossMoney'), 10) || 0;

        if (currentMoney >= cost) {
            // Deduct cost and update state
            const newMoney = currentMoney - cost;
            localStorage.setItem('alphaBossMoney', newMoney);
            moneyValueEl.textContent = `$${newMoney}`;

            // Mark as purchased
            state.upgrades[upgradeId] = true;
            localStorage.setItem('alphaBossUpgrades', JSON.stringify(state.upgrades));

            // Update UI
            element.classList.add('purchased');
            element.querySelector('.item-price').textContent = 'OWNED';
            element.replaceWith(element.cloneNode(true)); // Remove event listener
        } else {
            console.log("Not enough money!"); // Later, show a UI error
        }
    }

    function purchaseBoosterPack(element) {
        const cost = parseInt(element.dataset.cost, 10);
        const currentMoney = parseInt(localStorage.getItem('alphaBossMoney'), 10) || 0;

        if (currentMoney >= cost) {
            const newMoney = currentMoney - cost;
            localStorage.setItem('alphaBossMoney', newMoney);
            moneyValueEl.textContent = `$${newMoney}`;

            // Temporarily disable the button after purchase
            element.classList.add('purchased');
            element.querySelector('.item-price').textContent = 'USED';
            element.replaceWith(element.cloneNode(true));

            showBoosterPackModal();
        } else {
            console.log("Not enough money for Booster Pack!");
        }
    }

    // --- BOOSTER PACK MODAL LOGIC ---
    function showBoosterPackModal() {
        shopScreenEl.style.display = 'none'; // Hide shop
        boosterPackOverlay.style.display = 'flex'; // Show modal

        // Get 16 random tiles that are not already boosters or multipliers
        const eligibleTiles = state.masterTileSet.filter(t => !t.modifier);
        shuffleArray(eligibleTiles);
        const tilesToDisplay = eligibleTiles.slice(0, 16);
        
        let selectedTileIds = new Set();

        boosterPackGrid.innerHTML = '';
        tilesToDisplay.forEach(tileObject => {
            const tileEl = document.createElement('div');
            tileEl.className = 'booster-pack-tile';
            tileEl.dataset.tileId = tileObject.id;
            
            const displayLetter = tileObject.letter === 'Q' ? 'Qu' : tileObject.letter;
            tileEl.innerHTML = `${displayLetter}<span class="val">${tileObject.value}</span>`;

            tileEl.addEventListener('click', () => {
                if (selectedTileIds.has(tileObject.id)) {
                    selectedTileIds.delete(tileObject.id);
                    tileEl.classList.remove('selected');
                } else {
                    if (selectedTileIds.size < 4) {
                        selectedTileIds.add(tileObject.id);
                        tileEl.classList.add('selected');
                    }
                }
                boosterPackConfirmBtn.textContent = `BOOST (${selectedTileIds.size}/4)`;
                boosterPackConfirmBtn.disabled = selectedTileIds.size === 0;
            });

            boosterPackGrid.appendChild(tileEl);
        });

        boosterPackConfirmBtn.onclick = () => {
            // Find the selected tiles in the master set and upgrade them
            selectedTileIds.forEach(id => {
                const tileToUpgrade = state.masterTileSet.find(t => t.id === id);
                if (tileToUpgrade) {
                    tileToUpgrade.modifier = 'booster';
                    tileToUpgrade.mult = 10;
                }
            });

            // Save the updated master set back to localStorage
            localStorage.setItem('alphaBossMasterTileSet', JSON.stringify(state.masterTileSet));
            closeBoosterPackModal();
        };

        boosterPackSkipBtn.onclick = () => {
            closeBoosterPackModal();
        };
    }

    function closeBoosterPackModal() {
        boosterPackOverlay.style.display = 'none';
        shopScreenEl.style.display = 'flex';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
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
            // Sort by value descending, then by letter ascending for ties
            state.bagTiles.sort((a, b) => {
                return (b.value + b.mult) - (a.value + a.mult) || a.letter.localeCompare(b.letter);
            });
        } else if (sortBy === 'type') {
            // Sort by modifier type first, then alphabetically
            state.bagTiles.sort((a, b) => {
                return (b.modifier ? 1 : 0) - (a.modifier ? 1 : 0) || a.letter.localeCompare(b.letter);
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

    // --- EVENT LISTENERS ---
    bagBtn.addEventListener('click', openBagModal);
    closeBagBtn.addEventListener('click', closeBagModal);
    bagModalOverlay.addEventListener('click', (e) => {
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

    // Initialize shop state
    initializeShopItems();
});