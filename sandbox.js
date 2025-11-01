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
                const scoringEffect = glyphInstance.onScoring({}, { playedTiles: [{ letter: 'A' }] });
                if (scoringEffect.bonusScore) {
                    powerEl.textContent = `+${scoringEffect.bonusScore} PTS`;
                    const attr = document.createElement('div');
                    attr.className = 'attribute-line score';
                    attr.textContent = `+${scoringEffect.bonusScore} PTS`;
                    attributesPanel.appendChild(attr);
                }
                if (scoringEffect.bonusMult) {
                    powerEl.textContent = `+${scoringEffect.bonusMult} MULT`;
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
            itemContainer.append(glyphImage, overlay, sellBtn, attributesPanel);
            glyphShowcase.appendChild(itemContainer);
        });
    }
});