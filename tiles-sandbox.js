document.addEventListener('DOMContentLoaded', () => {
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
            { letter: 'S', value: 1, frequency: 'Bronze', stamp: { type: 'blue' }, edition: { type: 'foil' } },
            { letter: 'H', value: 4, frequency: 'Silver', enhancement: { type: 'bold' }, edition: { type: 'holographic' } }
        ];

        // Create and append each tile to the showcase
        tilesToCreate.forEach(tileData => {
            const tileElement = createTileElement(tileData);
            tileShowcase.appendChild(tileElement);
        });
    }
});