document.addEventListener('DOMContentLoaded', () => {
    const eventChoices = [
        { text: "A moment of peace...", href: "gameplay.html" },
        { text: "A test of wits!", href: "wordle.html" },
        { text: "A stroke of luck?", href: "gameplay.html" },
        { text: "The boss hesitates...", href: "gameplay.html" },
    ];

    // Shuffle the choices to make them random
    const shuffledChoices = eventChoices.sort(() => 0.5 - Math.random());

    const buttons = document.querySelectorAll('.event-choice-btn');
    
    buttons.forEach((button, index) => {
        if (shuffledChoices[index]) {
            const choice = shuffledChoices[index];
            button.textContent = choice.text;
            button.onclick = () => {
                // When an event is chosen, navigate to its corresponding page
                window.location.href = choice.href;
            };
        } else {
            // Hide button if there are not enough choices
            button.style.display = 'none';
        }
    });
});