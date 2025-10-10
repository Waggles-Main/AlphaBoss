// For now, all event choices will just lead to the next round.
// This can be expanded later with actual event logic.

document.querySelectorAll('.event-choice-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Navigate to the gameplay screen to start the next round
        window.location.href = 'gameplay.html';
    });
});