document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    // --- Add Listeners to Draggable Items ---
    draggables.forEach(draggable => {
        // Fired when the user starts dragging the item
        draggable.addEventListener('dragstart', () => {
            // Add a 'dragging' class to style the item being moved
            draggable.classList.add('dragging');
        });

        // Fired when the user stops dragging the item (whether it was dropped or not)
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    // --- Add Listeners to Drop Zones ---
    dropZones.forEach(zone => {
        // Fired continuously as a draggable item is dragged OVER the zone
        zone.addEventListener('dragover', e => {
            e.preventDefault(); // This is crucial to allow a 'drop' event
            zone.classList.add('drag-over'); // Add highlight style

            // Determine where to place the dragged item relative to other items
            const afterElement = getDragAfterElement(zone, e.clientY);
            const draggable = document.querySelector('.dragging');

            if (afterElement == null) {
                zone.appendChild(draggable); // Append to the end if no element is below
            } else {
                zone.insertBefore(draggable, afterElement); // Insert before the element below
            }
        });

        // Fired when a draggable item leaves the drop zone's boundaries
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over'); // Remove highlight style
        });

        // Fired when a draggable item is dropped onto the zone
        zone.addEventListener('drop', () => {
            zone.classList.remove('drag-over'); // Remove highlight style on drop
        });
    });

    /**
     * Helper function to determine the correct position to insert a dragged item
     * within a list, allowing for reordering.
     * @param {HTMLElement} container - The drop zone container.
     * @param {number} y - The current vertical mouse position.
     * @returns {HTMLElement|null} - The element the dragged item should be inserted before.
     */
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            // Find the element whose center is just below the mouse cursor
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});