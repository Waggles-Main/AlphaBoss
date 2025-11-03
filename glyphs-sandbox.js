document.addEventListener('DOMContentLoaded', () => {
    const glyphShowcase = document.getElementById('glyph-showcase');
    const sortControls = document.querySelector('.sort-buttons');
    const glyphCountSlider = document.getElementById('glyphCountSlider');
    const glyphCountDisplay = document.getElementById('glyphCountDisplay');
    let currentSort = 'name'; // Default sort

    if (glyphShowcase && typeof ALL_GLYPHS !== 'undefined') {
        // --- Sorting Logic ---
        const sortGlyphs = (sortBy) => {
            currentSort = sortBy;
            if (sortBy === 'name') {
                ALL_GLYPHS.sort((a, b) => a.name.localeCompare(b.name));
            }
            renderGlyphs(ALL_GLYPHS);
        };

        // --- Event Listeners for Sort Buttons ---
        if (sortControls) {
            // Since there's only one sort option now, we can simplify this.
            // The listener remains in case you add other sort options later.
            sortControls.addEventListener('click', (e) => {
                const sortBtn = e.target.closest('.sort-btn');
                if (sortBtn && sortBtn.dataset.sort) {
                    const sortBy = sortBtn.dataset.sort;
                    // Update active button
                    document.querySelectorAll('.sort-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.sort === sortBy);
                    });
                    sortGlyphs(sortBy);
                }
            });
        } else {
            // If sort controls don't exist, just do an initial render
            sortGlyphs(currentSort);
        }

        // --- Simulator Logic ---
        if (glyphCountSlider) {
            glyphCountSlider.addEventListener('input', (e) => {
                const count = parseInt(e.target.value, 10);
                glyphCountDisplay.textContent = count;
                // Re-render the glyphs with the new simulated state
                renderGlyphs(ALL_GLYPHS);
            });
        }
    }

    /**
     * Renders the glyphs into the showcase container.
     * @param {Glyph[]} glyphsToRender - The array of glyph objects to render.
     */
    function renderGlyphs(glyphsToRender) {
        glyphShowcase.innerHTML = ''; // Clear placeholder text

        const glyphCount = glyphCountSlider ? parseInt(glyphCountSlider.value, 10) : 1;
        // Create a simulated gameState for dynamic power text
        const simulatedState = {
            glyphs: Array(glyphCount).fill({})
        };

        glyphsToRender.forEach(glyph => {
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
            const powerInfo = glyph.getPowerText(simulatedState);

            if (powerInfo) {
                // Use staticText for the main overlay power display
                powerEl.textContent = powerInfo.staticText || powerInfo.text;
                powerEl.classList.add(powerInfo.class);

                const attr = document.createElement('div');
                attr.className = `attribute-line ${powerInfo.class}`;
                // Use dynamicText for the attribute panel, falling back to static if it doesn't exist
                attr.textContent = powerInfo.dynamicText || powerInfo.staticText || powerInfo.text;
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

            const elementsToAppend = [glyphImage, overlay, sellBtn, useBtn, attributesPanel].filter(Boolean);
            itemContainer.append(...elementsToAppend);
            glyphShowcase.appendChild(itemContainer);
        });
    }
});