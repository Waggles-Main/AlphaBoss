/**
 * Parses a description string and wraps keywords in color-coded spans.
 * @param {string} text - The description text to parse.
 * @returns {string} - The HTML string with color-coded keywords.
 */
function colorizeTooltipText(text) {
    let html = text;
    // Colorize +X Mult (red)
    html = html.replace(/(\+\d+\s*Mult)/gi, '<span class="tooltip-mult-color">$1</span>');
    // Colorize +X Value/Points (blue)
    html = html.replace(/(\+\d+\s*(Value|Points|Chips))/gi, '<span class="tooltip-value-color">$1</span>');
    // Colorize xX Mult Mult (purple)
    html = html.replace(/(x\d+\s*Mult Mult)/gi, '<span class="tooltip-mult-mult-color">$1</span>');

    return html;
}

/**
 * Initializes custom tooltips for a given container.
 * @param {string} containerSelector - The selector for the parent element containing the items.
 * @param {string} itemSelector - The selector for the items that should trigger a tooltip.
 */
function initializeGenericTooltips(containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    const tooltipEl = document.getElementById('genericTooltip');
    const tooltipTitleEl = document.getElementById('tooltipTitle');
    const tooltipTextEl = document.getElementById('tooltipText');

    if (!container || !tooltipEl) return;

    let tooltipTimer;

    container.addEventListener('mouseover', (e) => {
        const item = e.target.closest(itemSelector);
        if (!item || !item.dataset.tooltipTitle) return;

        // Clear any existing timer
        clearTimeout(tooltipTimer);

        // Start a new timer to show the tooltip after a short delay
        tooltipTimer = setTimeout(() => {
            // 1. Populate tooltip content from data attributes
            tooltipTitleEl.textContent = item.dataset.tooltipTitle;
            tooltipTextEl.innerHTML = colorizeTooltipText(item.dataset.tooltipText);

            // 2. Make the tooltip visible to calculate its dimensions
            tooltipEl.classList.add('visible');

            // 3. Position the tooltip
            const rect = item.getBoundingClientRect();
            const tooltipRect = tooltipEl.getBoundingClientRect();

            // Position above the item, centered horizontally
            let top = rect.top - tooltipRect.height - 10; // 10px above
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            // Adjust if it goes off-screen
            if (top < 0) top = rect.bottom + 10;
            if (left < 5) left = 5;
            if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - 5;

            tooltipEl.style.top = `${top}px`;
            tooltipEl.style.left = `${left}px`;
        }, 500); // 0.5 second delay
    });

    container.addEventListener('mouseout', () => {
        clearTimeout(tooltipTimer);
        tooltipEl.classList.remove('visible');
    });
}