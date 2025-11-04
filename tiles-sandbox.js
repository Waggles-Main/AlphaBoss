document.addEventListener('DOMContentLoaded', () => {
    const tileShowcase = document.getElementById('tile-showcase');
    if (!tileShowcase) return;

    // --- [NEW] Descriptions for each stamp type ---
    const STAMP_DESCRIPTIONS = {
        red: "Retriggers this tile an additional time.",
        blue: "When held, enhances a random tile in your bag.",
        yellow: "Earn +$3 when this tile is played.", // Corresponds to Gold Seal
        purple: "Creates a Tarot card when refreshed in the shop.",
        black: "If this is the last letter of a word, x2 word Mult."
    };

    tileShowcase.innerHTML = ''; // Clear existing content

    /**
     * Creates a tile element from a data object.
     * This is a reusable factory function.
     */
    const createTileElement = (tileData) => {
        const tileItem = document.createElement('div');
        tileItem.className = 'sandbox-tile-item';

        const letterEl = document.createElement('span');
        letterEl.className = 'tile-letter';
        // --- [NEW] Apply special tile styling if it's a special tile ---
        if (tileData.isSpecial) {
            letterEl.classList.add('special-tile-symbol');
        }
        letterEl.textContent = tileData.letter;
        tileItem.appendChild(letterEl);

        const valueEl = document.createElement('span');
        valueEl.className = 'tile-value';
        
        let boostValue = 0;
        // If the tile is boosted, we need to get the correct bonus from the Tile class logic
        if (tileData.enhancement?.type === 'boosted') {
            // Create a temporary tile just to get its rarity.
            const tempTileForBoost = new Tile(tileData.letter); 
            // Then, assign the correct boost value based on that rarity.
            switch (tempTileForBoost.rarity) {
                case 'Bronze': boostValue = 5; break;
                case 'Silver': boostValue = 10; break;
                case 'Gold': boostValue = 20; break;
                default: boostValue = 5;
            }
        }

        const currentValue = tileData.value + boostValue;
        valueEl.textContent = currentValue;
        tileItem.appendChild(valueEl);

        if (tileData.stamp) {
            const stampEl = document.createElement('div');
            stampEl.className = `tile-stamp ${tileData.stamp.type}`;
            tileItem.appendChild(stampEl);
        }

        if (tileData.enhancement) {
            tileItem.classList.add(`tile-enhancement-${tileData.enhancement.type}`);
        }

        // If the tile is a mult_tile, calculate its bonus and add the data attribute
        if (tileData.enhancement?.type === 'mult_tile') {
            const tempTileForMult = new Tile(tileData.letter);
            let multBonus = 0;
            switch (tempTileForMult.rarity) {
                case 'Bronze': multBonus = 2; break;
                case 'Silver': multBonus = 4; break;
                case 'Gold': multBonus = 8; break;
            }
            tileItem.querySelector('.tile-value').dataset.multBonus = multBonus;
        }

        if (tileData.edition) {
            tileItem.classList.add(`tile-edition-${tileData.edition.type}`);
        }

        if (tileData.gemModifier) {
            tileItem.classList.add('gem-tile', `gem-${tileData.gemModifier.toLowerCase()}`);
        }

        const attributesPanel = document.createElement('div');
        attributesPanel.className = 'sandbox-tile-attributes';

        let attributesHTML = `<div class="attribute-line score">Base Value: ${tileData.value}</div>`;
        attributesHTML += `<div class="attribute-line rarity">Rarity: ${tileData.rarity}</div>`; // Display rarity
        if (tileData.stamp) {
            attributesHTML += `<div class="attribute-line stamp-${tileData.stamp.type}">Stamp: ${tileData.stamp.type}</div>`;
            const stampDesc = STAMP_DESCRIPTIONS[tileData.stamp.type];
            if (stampDesc) attributesHTML += `<div class="attribute-line description">${stampDesc}</div>`;
        }
        if (tileData.enhancement) attributesHTML += `<div class="attribute-line enhancement">Enhancement: ${tileData.enhancement.type}</div>`;
        
        // --- [NEW] Add description for special tiles ---
        if (tileData.isSpecial && tileData.description) {
            attributesHTML += `<div class="attribute-line description">${tileData.description}</div>`;
        }

        if (tileData.edition) attributesHTML += `<div class="attribute-line edition">Edition: ${tileData.edition.type}</div>`;
        if (tileData.gemModifier) {
            const gemDef = GEM_DEFINITIONS[tileData.gemModifier];
            if (gemDef) {
                const percentage = (gemDef.multiplier - 1) * 100;
                attributesHTML += `<div class="attribute-line gem">Gem: ${tileData.gemModifier} (+${percentage.toFixed(0)}% Mult)</div>`;
            }
        }

        attributesPanel.innerHTML = attributesHTML;
        tileItem.appendChild(attributesPanel);

        tileItem.addEventListener('mouseenter', () => tileItem.classList.add('hover'));
        tileItem.addEventListener('mouseleave', () => tileItem.classList.remove('hover'));
        tileItem.addEventListener('click', () => tileItem.classList.toggle('pressed'));

        return tileItem;
    };

    // --- Define the comprehensive list of tiles to create ---
    const tilesToCreate = [
        // Base Tiles
        { letter: 'A', value: 1, description: 'A standard tile.' },
        { letter: 'K', value: 5, description: 'A high-value standard tile.' },
        { letter: 'Z', value: 10, description: 'The highest value standard tile.' },

        // Stamped Tiles
        { letter: 'S', value: 1, stamp: { type: 'red' }, description: 'A tile with a red stamp.' },
        { letter: 'T', value: 1, stamp: { type: 'blue' }, description: 'A tile with a blue stamp.' },
        { letter: 'A', value: 1, stamp: { type: 'yellow' }, description: 'A tile with a yellow stamp.' },
        { letter: 'M', value: 3, stamp: { type: 'purple' }, description: 'A tile with a purple stamp.' },
        { letter: 'P', value: 3, stamp: { type: 'black' }, description: 'A tile with a black stamp.' },

        // --- [NEW] Specific tiles for testing the "Boosted" enhancement ---
        { letter: 'E', value: 1, enhancement: { type: 'boosted' }, description: 'A Bronze boosted tile (+5).' },
        { letter: 'B', value: 3, enhancement: { type: 'boosted' }, description: 'A Silver boosted tile (+10).' },
        { letter: 'Z', value: 10, enhancement: { type: 'boosted' }, description: 'A Gold boosted tile (+20).' },

        // --- [NEW] Specific tiles for testing the "Mult Tile" enhancement ---
        { letter: 'T', value: 1, enhancement: { type: 'mult_tile' }, description: 'A Bronze Mult tile (+2 Mult).' },
        { letter: 'M', value: 3, enhancement: { type: 'mult_tile' }, description: 'A Silver Mult tile (+4 Mult).' },
        { letter: 'Z', value: 10, enhancement: { type: 'mult_tile' }, description: 'A Gold Mult tile (+8 Mult).' },

        // Other Enhanced Tiles
        { letter: 'O', value: 1, enhancement: { type: 'bold' }, description: 'A bolded tile.' },
        { letter: 'L', value: 1, enhancement: { type: 'italics' }, description: 'An italicized tile.' },
        { letter: 'Y', value: 4, enhancement: { type: 'lucky_tile' }, description: 'A Lucky tile.' },
        { letter: 'G', value: 2, enhancement: { type: 'gold_tile' }, description: 'A Gold tile (+$3 if held).' },
        { letter: 'S', value: 1, enhancement: { type: 'steel_tile' }, description: 'A Steel tile (x1.2 Mult while in grid).' },
        { letter: 'G', value: 2, enhancement: { type: 'glass_tile' }, description: 'A Glass tile (x2 Mult).' },
        { letter: 'D', value: 2, enhancement: { type: 'underline' }, description: 'An underlined tile.' },

        // Edition Tiles
        { letter: 'F', value: 4, edition: { type: 'foil' }, description: 'A foil edition tile.' },
        { letter: 'H', value: 4, edition: { type: 'holographic' }, description: 'A holographic edition tile.' },

        // Gem Tiles
        { letter: 'G', value: 2, gemModifier: 'Amethyst', description: 'An Amethyst gem tile.' },
        { letter: 'E', value: 1, gemModifier: 'Emerald', description: 'An Emerald gem tile.' },
        { letter: 'M', value: 3, gemModifier: 'Garnet', description: 'A Garnet gem tile.' },
        { letter: 'S', value: 1, gemModifier: 'Sapphire', description: 'A Sapphire gem tile.' },
        { letter: 'R', value: 1, gemModifier: 'Ruby', description: 'A Ruby gem tile.' },
        { letter: 'C', value: 3, gemModifier: 'Crystal', description: 'A Crystal gem tile.' },
        { letter: 'D', value: 2, gemModifier: 'Diamond', description: 'A Diamond gem tile.' },

        // Combination Tile
        { 
            letter: 'X', 
            value: 8, 
            stamp: { type: 'red' }, 
            enhancement: { type: 'boosted' }, 
            edition: { type: 'holographic' },
            gemModifier: 'Ruby',
            description: 'A complex tile with multiple effects.'
        },
    ];

    // --- [NEW] Add the Special Tiles to the list ---
    if (typeof ALL_SPECIAL_TILES !== 'undefined') {
        const specialTilesForSandbox = ALL_SPECIAL_TILES.map(st => ({
            letter: st.letter,
            value: 0, // Special tiles have no base value
            description: st.description,
            name: st.name,
            enhancement: { type: 'special' }, // Use a unique type for identification
            rarity: 'Special', // Assign a custom rarity
            isSpecial: true, // A flag to help the renderer
        }));
        // Add the formatted special tiles to the main list
        tilesToCreate.push(...specialTilesForSandbox);
    }

    // Create and append each tile to the showcase
    tilesToCreate.forEach(tileData => {
        // Only calculate rarity for standard tiles, not special ones.
        if (!tileData.isSpecial) {
            const tempTile = new Tile(tileData.letter);
            tileData.rarity = tempTile.rarity;
        }

        const tileElement = createTileElement(tileData);
        tileShowcase.appendChild(tileElement);
    });
});