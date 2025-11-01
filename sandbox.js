// This is the JavaScript file for your sandbox.
// You can add logic here to test interactive components
// without affecting the main gameplay.js file.

document.addEventListener('DOMContentLoaded', () => {
    const glyphShowcase = document.getElementById('glyph-showcase');

    if (glyphShowcase && typeof ALL_GLYPHS !== 'undefined') {
        glyphShowcase.innerHTML = ''; // Clear placeholder text

        ALL_GLYPHS.forEach(glyph => {
            // Create the main container for the glyph item
            const itemContainer = document.createElement('div');
            itemContainer.className = 'sandbox-glyph-item';

            const glyphImage = document.createElement('div');
            glyphImage.className = 'sandbox-glyph-image';
            glyphImage.style.backgroundImage = `url('images/glyphs/${glyph.imageName}')`;

            // --- Create the new overlay ---
            const overlay = document.createElement('div');
            overlay.className = 'sandbox-glyph-overlay';

            const nameEl = document.createElement('div');
            nameEl.className = 'overlay-name';
            nameEl.textContent = glyph.name;

            const powerEl = document.createElement('div');
            powerEl.className = 'overlay-power';

            const descEl = document.createElement('div');
            descEl.className = 'overlay-description';
            descEl.textContent = glyph.description;

            const rarityEl = document.createElement('div');
            rarityEl.className = 'overlay-rarity';
            rarityEl.textContent = glyph.rarity;

            // Create the attributes panel that appears below
            const attributesPanel = document.createElement('div');
            attributesPanel.className = 'sandbox-glyph-attributes';

            // Dynamically get the "power" text
            const glyphInstance = new (GLYPH_MAP[glyph.id])();
            if (glyphInstance.onScoring) {
                // Simulate playing the correct letter to see the effect.
                // Extracts the letter from the glyph's ID (e.g., 'glyph_e' -> 'E').
                const letterToTest = glyph.id.split('_')[1]?.toUpperCase() || 'A';
                const scoringEffect = glyphInstance.onScoring({}, { playedTiles: [{ letter: letterToTest }] });

                if (scoringEffect.bonusScore) {
                    powerEl.textContent = `+${scoringEffect.bonusScore} PTS`;
                    powerEl.classList.add('score'); // Add score class for blue color
                    const attr = document.createElement('div');
                    attr.className = 'attribute-line score';
                    attr.textContent = `+${scoringEffect.bonusScore} PTS`;
                    attributesPanel.appendChild(attr);
                }
                if (scoringEffect.bonusMult) {
                    powerEl.textContent = `+${scoringEffect.bonusMult} MULT`;
                    powerEl.classList.add('mult'); // Add mult class for red color
                    const attr = document.createElement('div');
                    attr.className = 'attribute-line mult';
                    attr.textContent = `+${scoringEffect.bonusMult} MULT`;
                    attributesPanel.appendChild(attr);
                }
            }

            // --- Create the new SELL button ---
            const sellBtn = document.createElement('button');
            sellBtn.className = 'btn-sandbox-sell';
            sellBtn.textContent = `SELL $${glyph.sellValue}`;
            sellBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the card from de-selecting
                console.log(`Sell action for ${glyph.name}`);
                // In a real game, you'd remove the glyph and add money here.
                // For the sandbox, we can just deactivate the card.
                itemContainer.classList.remove('active');
            });

            let useBtn = null;
            // --- Conditionally create the USE button ---
            if (glyph.hasAction) {
                useBtn = document.createElement('button');
                useBtn.className = 'btn-sandbox-use';
                useBtn.textContent = 'USE';
                useBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent the card from de-selecting
                    console.log(`Use action for ${glyph.name}`);
                    itemContainer.classList.remove('active');
                });
            }

            // Append all parts to the overlay
            overlay.append(nameEl, powerEl, descEl, rarityEl);

            // Add click listener to the main container to toggle the active state
            itemContainer.addEventListener('click', () => {
                const wasActive = itemContainer.classList.contains('active');
                // Deactivate all other items first
                document.querySelectorAll('.sandbox-glyph-item.active').forEach(el => el.classList.remove('active'));
                // If it wasn't already active, activate it now.
                if (!wasActive) itemContainer.classList.add('active');
            });

            // Add mouseleave listener to hide the sell button when not hovering
            itemContainer.addEventListener('mouseleave', () => {
                itemContainer.classList.remove('active');
            });

            // Append the image and the new overlay to the main container
            const elementsToAppend = [glyphImage, overlay, sellBtn, attributesPanel];
            if (useBtn) {
                elementsToAppend.push(useBtn);
            }
            itemContainer.append(...elementsToAppend);
            glyphShowcase.appendChild(itemContainer);
        });
    }

    const tileShowcase = document.getElementById('tile-showcase');
    if (tileShowcase) {
        tileShowcase.innerHTML = ''; // Clear existing content

        // Helper function to create a tile element from data
        const createTileElement = (tileData) => {
            const tileItem = document.createElement('div');
            tileItem.className = 'sandbox-tile-item';

            // Add Letter
            const letterEl = document.createElement('span');
            letterEl.className = 'tile-letter';
            letterEl.textContent = tileData.letter;
            tileItem.appendChild(letterEl);

            // Add Value
            const valueEl = document.createElement('span');
            valueEl.className = 'tile-value';
            valueEl.textContent = tileData.value;
            tileItem.appendChild(valueEl);

            // Add Stamp (if it exists)
            if (tileData.stamp) {
                const stampEl = document.createElement('div');
                stampEl.className = `tile-stamp ${tileData.stamp.type}`;
                tileItem.appendChild(stampEl);
            }

            // Apply Enhancement class
            if (tileData.enhancement) {
                tileItem.classList.add(`tile-enhancement-${tileData.enhancement.type}`);
            }

            // Apply Edition class
            if (tileData.edition) {
                tileItem.classList.add(`tile-edition-${tileData.edition.type}`);
            }

            return tileItem;
        };

        // --- Define the tiles you want to create ---
        const tilesToCreate = [
            { letter: 'F', value: 4 },
            { letter: 'A', value: 1 },
            { letter: 'R', value: 1 },
            { letter: 'T', value: 1, stamp: { type: 'red' }, enhancement: { type: 'boosted' } } // Example with attributes
        ];

        // Create and append each tile to the showcase
        tilesToCreate.forEach(tileData => {
            const tileElement = createTileElement(tileData);
            tileShowcase.appendChild(tileElement);
        });
    }
});