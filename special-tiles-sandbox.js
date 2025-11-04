document.addEventListener('DOMContentLoaded', () => {
    const showcase = document.getElementById('special-tile-showcase');
    if (!showcase || typeof ALL_SPECIAL_TILES === 'undefined') return;

    showcase.innerHTML = ''; // Clear placeholder content

    ALL_SPECIAL_TILES.forEach(tile => {
        // We can reuse the 'sandbox-glyph-item' class for a consistent look.
        const itemContainer = document.createElement('div');
        itemContainer.className = 'sandbox-glyph-item';

        // The main image for the tile
        const imageEl = document.createElement('div');
        imageEl.className = 'sandbox-glyph-image';
        // Assuming special tile images are in the same folder as glyphs for now
        imageEl.innerHTML = `<div class="special-tile-symbol">${tile.letter}</div>`;

        // The hover overlay with details
        const overlay = document.createElement('div');
        overlay.className = 'sandbox-glyph-overlay';

        const nameEl = document.createElement('div');
        nameEl.className = 'overlay-name';
        nameEl.textContent = tile.name;

        const descEl = document.createElement('div');
        descEl.className = 'overlay-description';
        descEl.textContent = tile.description;

        // Assemble the card
        overlay.append(nameEl, descEl);
        itemContainer.append(imageEl, overlay);
        showcase.appendChild(itemContainer);
    });
});