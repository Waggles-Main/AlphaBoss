document.addEventListener('DOMContentLoaded', () => {
    /**
     * Generates a grid of placeholder tiles.
     * @param {HTMLElement} container - The DOM element to fill with grid slots.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} cols - The number of columns in the grid.
     * @param {string} prefix - A prefix for the data-location attribute (e.g., 'grid' or 'hold').
     */
    function generateGrid(container, rows, cols, prefix) {
        if (!container) return;

        // Use CSS variables to control grid dimensions for responsiveness
        container.style.setProperty('--grid-cols', cols);
        container.style.setProperty('--grid-rows', rows);
        container.innerHTML = ''; // Clear any existing content

        const totalSlots = rows * cols;
        for (let i = 0; i < totalSlots; i++) {
            // Create the grid slot
            const slot = document.createElement('div');
            slot.className = 'grid-slot';
            // Assign a unique, addressable location to each slot

            // If this is the last column of the main grid, apply the dashed style
            if (prefix === 'grid' && (i + 1) % cols === 0) {
                slot.classList.add('dashed-outline');
            }

            // If this is the FIRST column of the main grid, make it transparent
            if (prefix === 'grid' && i % cols === 0) {
                slot.classList.add('transparent-slot');
            }

            slot.dataset.location = `${prefix}-${i}`;

            // Create a placeholder tile inside the slot
            const tile = document.createElement('div');
            tile.className = 'placeholder-tile';
            tile.textContent = i; // Display index for easy identification

            slot.appendChild(tile);
            container.appendChild(slot);
        }
    }

    // --- CONFIGURATION ---
    const GRID_ROWS = 4;
    const GRID_COLS = 6; // Increased to 6 to add a new left column

    // --- INITIALIZATION ---
    const mainGridContainer = document.getElementById('sandboxTileGrid');

    // 1. Generate the main grid first
    generateGrid(mainGridContainer, GRID_ROWS, GRID_COLS, 'grid');
});