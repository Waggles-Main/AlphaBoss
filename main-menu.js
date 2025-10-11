document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT ---
    // Make sure your "New Run" button in index.html has the id="newRunBtn"
    const newRunBtn = document.getElementById('newRunBtn');

    if (newRunBtn) {
        newRunBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an <a> tag

            // Clear all run-specific data from localStorage to ensure a fresh start.
            localStorage.removeItem('alphaBossRound');
            localStorage.removeItem('alphaBossMoney');
            localStorage.removeItem('alphaBossMasterTileSet');

            // Now, navigate to the gameplay screen for a new run.
            window.location.href = 'gameplay.html';
        });
    }
});