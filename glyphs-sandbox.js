document.addEventListener('DOMContentLoaded', () => {
    const glyphShowcase = document.getElementById('glyph-showcase');

    if (glyphShowcase && typeof ALL_GLYPHS !== 'undefined') {
        glyphShowcase.innerHTML = ''; // Clear placeholder text

        ALL_GLYPHS.forEach(glyph => {
            // Create the main container for the glyph item
            const itemContainer = document.createElement('div');
            itemContainer.className = 'sandbox-glyph-item';
            itemContainer.classList.add(glyph.rarity.toLowerCase());

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
            rarityEl.classList.add(glyph.rarity.toLowerCase());

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
                powerEl.textContent = 'UTILITY';
                powerEl.classList.add('utility');
            }

            // --- Create the new SELL button ---
            const sellBtn = document.createElement('button');
            sellBtn.className = 'btn-sandbox-sell';
            sellBtn.textContent = `SELL $${glyph.sellValue}`;
            sellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                itemContainer.classList.remove('active');
            });

            let useBtn = null;
            if (glyph.hasAction) {
                useBtn = document.createElement('button');
                useBtn.className = 'btn-sandbox-use';
                useBtn.textContent = 'USE';
                useBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    itemContainer.classList.remove('active');
                });
            }

            overlay.append(nameEl, powerEl, descEl, rarityEl);

            itemContainer.addEventListener('click', () => {
                const wasActive = itemContainer.classList.contains('active');
                document.querySelectorAll('.sandbox-glyph-item.active').forEach(el => el.classList.remove('active'));
                if (!wasActive) itemContainer.classList.add('active');
            });

            itemContainer.addEventListener('mouseleave', () => {
                itemContainer.classList.remove('active');
            });

            const elementsToAppend = [glyphImage, overlay, sellBtn, attributesPanel];
            if (useBtn) {
                elementsToAppend.push(useBtn);
            }
            itemContainer.append(...elementsToAppend);
            glyphShowcase.appendChild(itemContainer);
        });
    }
});