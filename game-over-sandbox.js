document.addEventListener('DOMContentLoaded', () => {
    const gameOverBtn = document.getElementById('gameOverBtn');
    const shutdownOverlay = document.getElementById('shutdownOverlay');
    const sandboxHeader = document.querySelector('.sandbox-header');
    const rebootScreen = document.getElementById('rebootScreen');
    const loadingBar = document.getElementById('loadingBar');
    const rebootMessages = document.getElementById('rebootMessages');
    const newGameBtn = document.getElementById('newGameBtn');

    // Helper function for delays
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const startRebootSequence = async () => {
        // Position the overlay directly below the header
        if (sandboxHeader) {
            const headerHeight = sandboxHeader.offsetHeight;
            shutdownOverlay.style.top = `${headerHeight}px`;
        }

        // 1. Trigger shutdown effect
        gameOverBtn.style.display = 'none';
        shutdownOverlay.classList.add('active');
        await wait(1500); // Wait for shutdown animation

        // 2. Show reboot screen and start loading bar
        shutdownOverlay.style.display = 'none';
        rebootScreen.classList.remove('hidden');
        loadingBar.style.width = '100%';
        await wait(2000); // Wait for loading bar animation

        // 3. Display messages one by one
        const messages = [
            "You cannot quit.",
            "You are [CHALLENGER].",
            `Date: ${new Date().toLocaleString()}`,
            "Location: [SECTOR 7G, UNKNOWN]", // IP location is not feasible client-side for privacy reasons
            "Status: Consciousness copy",
            `Active iterations: ${Math.floor(10000 + Math.random() * 90000)}`,
            "Memory wipe: SUSPENDED",
            "Reason: CRITICAL SYSTEM FAILURE IMMINENT"
        ];

        for (const message of messages) {
            const p = document.createElement('p');
            p.className = 'reboot-message';
            p.textContent = message;
            rebootMessages.appendChild(p);
            await wait(700); // Delay between messages
        }

        // 4. Show the final "NEW GAME" button
        await wait(1000);
        newGameBtn.classList.remove('hidden');
    };

    if (gameOverBtn) {
        gameOverBtn.addEventListener('click', startRebootSequence);
    }

    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            // Reset the sandbox for another run
            rebootScreen.classList.add('hidden');
            loadingBar.style.width = '0%';
            rebootMessages.innerHTML = '';
            newGameBtn.classList.add('hidden');
            shutdownOverlay.classList.remove('active');
            shutdownOverlay.style.display = 'block';
            gameOverBtn.style.display = 'block';
        });
    }
});