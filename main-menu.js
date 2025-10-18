document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT ---
    // Make sure your "New Run" button in index.html has the id="newRunBtn"
    const newRunBtn = document.getElementById('newRunBtn');

    if (newRunBtn) {
        newRunBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an <a> tag

            // Clear the entire run state object from localStorage to ensure a fresh start.
            localStorage.removeItem('alphaBossRun');
            // Remove old individual keys for backward compatibility
            localStorage.removeItem('alphaBossRound');
            localStorage.removeItem('alphaBossMoney');
            localStorage.removeItem('alphaBossMasterTileSet');

            // Now, navigate to the gameplay screen for a new run.
            window.location.href = 'gameplay.html';
        });
    }
});