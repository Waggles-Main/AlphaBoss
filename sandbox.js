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
            const powerInfo = glyphInstance.getPowerText();

            if (powerInfo) {
                powerEl.textContent = powerInfo.text;
                powerEl.classList.add(powerInfo.class);

                const attr = document.createElement('div');
                attr.className = `attribute-line ${powerInfo.class}`;
                attr.textContent = powerInfo.text;
                attributesPanel.appendChild(attr);
            } else {
                // Handle glyphs that might not have a simple power text (like Pilcrow)
                powerEl.textContent = 'UTILITY';
                powerEl.classList.add('utility');
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

            // Apply Frequency class
            if (tileData.frequency) {
                tileItem.classList.add(`tile-frequency-${tileData.frequency.toLowerCase()}`);
            }

            // --- Create the new attributes panel (for hover state) ---
            const attributesPanel = document.createElement('div');
            attributesPanel.className = 'sandbox-tile-attributes';

            let attributesHTML = '';
            attributesHTML += `<div class="attribute-line score">Base Value: ${tileData.value}</div>`;

            if (tileData.stamp) {
                attributesHTML += `<div class="attribute-line stamp-${tileData.stamp.type}">Stamp: ${tileData.stamp.type}</div>`;
            }
            if (tileData.enhancement) {
                // Assuming enhancement might have a value, e.g., { type: 'boosted', value: 10 }
                let enhancementText = `Enhancement: ${tileData.enhancement.type}`;
                if (tileData.enhancement.value) {
                    enhancementText += ` (+${tileData.enhancement.value})`;
                }
                attributesHTML += `<div class="attribute-line enhancement">${enhancementText}</div>`;
            }
            if (tileData.edition) {
                attributesHTML += `<div class="attribute-line edition">Edition: ${tileData.edition.type}</div>`;
            }
            if (tileData.frequency) {
                attributesHTML += `<div class="attribute-line frequency-${tileData.frequency.toLowerCase()}">Frequency: ${tileData.frequency}</div>`;
            }

            attributesPanel.innerHTML = attributesHTML;
            tileItem.appendChild(attributesPanel);

            // Add hover listeners to show/hide the panel
            tileItem.addEventListener('mouseenter', () => {
                // Deactivate any active glyphs to prevent overlap
                document.querySelectorAll('.sandbox-glyph-item.active').forEach(el => el.classList.remove('active'));
                tileItem.classList.add('hover');
            });
            tileItem.addEventListener('mouseleave', () => {
                tileItem.classList.remove('hover');
            });
            // Add a click listener for a "pressed" state
            tileItem.addEventListener('click', () => {
                tileItem.classList.toggle('pressed');
            });


            return tileItem;
        };

        // --- Define the tiles you want to create ---
        const tilesToCreate = [
            { letter: 'E', value: 1, frequency: 'Bronze' }, // Bronze
            { letter: 'B', value: 3, frequency: 'Silver' }, // Silver
            { letter: 'K', value: 5, frequency: 'Gold' },   // Gold
            { letter: 'T', value: 1, frequency: 'Bronze', stamp: { type: 'red' }, enhancement: { type: 'boosted', value: 10 } },
            { letter: 'S', value: 1, stamp: { type: 'blue' }, edition: { type: 'foil' } },
            { letter: 'H', value: 4, enhancement: { type: 'bold' }, edition: { type: 'holographic' } }
        ];

        // Create and append each tile to the showcase
        tilesToCreate.forEach(tileData => {
            const tileElement = createTileElement(tileData);
            tileShowcase.appendChild(tileElement);
        });
    }

    // --- 4x4 GRID GENERATION ---
    const sandboxGridEl = document.getElementById('sandboxTileGrid');
    if (sandboxGridEl) {
        // Create a temporary tile set for the sandbox grid
        const sandboxTileSet = TILE_DISTRIBUTION.map(letter => new Tile(letter));
        for (let i = sandboxTileSet.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sandboxTileSet[i], sandboxTileSet[j]] = [sandboxTileSet[j], sandboxTileSet[i]];
        }

        const drawSandboxTile = () => {
            if (sandboxTileSet.length === 0) return new Tile('_');
            return sandboxTileSet.pop();
        };

        for (let idx = 0; idx < 16; idx++) {
            const tileObject = drawSandboxTile();
            const tile = document.createElement('button');
            tile.className = 'tile';
            tile.dataset.index = String(idx);

            const tileAnimator = document.createElement('div');
            tileAnimator.className = 'tile-animator';
            tile.appendChild(tileAnimator);

            const tileContent = document.createElement('div');
            tileContent.className = 'tile-content';

            const displayLetter = tileObject.letter === 'Q' ? 'Qu' : tileObject.letter;
            const displayValue = tileObject.value + tileObject.mult;
            tileContent.innerHTML = `${displayLetter}<span class="val">${displayValue}</span>`;
            tileAnimator.appendChild(tileContent);
            sandboxGridEl.appendChild(tile);
        }

        initSandboxGridHoverEffects();
    }

    /**
     * Initializes the 3D tilt hover effects for the sandbox grid.
     * This is adapted from gameplay.js.
     */
    function initSandboxGridHoverEffects() {
        const tiles = sandboxGridEl.querySelectorAll('.tile');
        const MAX_ROTATION = 20;
        const HOVER_TRANSLATE_Z = 40;

        tiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => {
                tile.classList.add('hovering');
                tile.style.zIndex = '10';
            });

            tile.addEventListener('mousemove', (e) => {
                if (!tile.classList.contains('hovering')) return;

                const rect = tile.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = (x / centerX) * MAX_ROTATION;
                const rotateX = -1 * (y / centerY) * MAX_ROTATION;

                tile.style.transform = `perspective(1000px) translateZ(${HOVER_TRANSLATE_Z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            tile.addEventListener('mouseleave', () => {
                tile.classList.remove('hovering');
                tile.style.transform = `perspective(1000px) translateZ(0) rotateX(0) rotateY(0)`;
                setTimeout(() => {
                    tile.style.zIndex = '1';
                }, 150);
            });

            // Add a simple click effect for selection feedback
            tile.addEventListener('click', () => {
                tile.classList.toggle('selected');
            });
        });
    }
});