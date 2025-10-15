document.addEventListener('DOMContentLoaded', () => {
    const STAGES = ['quiz', 'event1', 'test', 'event2', 'exam'];
    const ROUND_TARGETS = [20, 50, 125, 300, 650, 1200, 2100, 3000]; // From gameplay.js

    function init() {
        const runState = getRunState();

        // Set the round number at the top of the screen
        const roundNumberEl = document.getElementById('roundNumber');
        if (roundNumberEl) {
            roundNumberEl.textContent = runState.round;
        }
        const stageCards = {
            quiz: document.querySelector('.quiz-card'),
            event1: document.querySelector('.event-card-1'),
            test: document.querySelector('.test-card'),
            event2: document.querySelector('.event-card-2'),
            exam: document.querySelector('.exam-card'),
        };

        // --- Dynamically update card content ---
        // This can be expanded with more complex logic later
        const quizScoreEl = stageCards.quiz.querySelector('.detail-value');
        const testScoreEl = stageCards.test.querySelector('.detail-value');
        const examScoreEl = stageCards.exam.querySelector('.detail-value');
        const examTitleEl = stageCards.exam.querySelector('.card-title');
        const examBossNameEl = stageCards.exam.querySelector('.boss-name');
        const examModifierEl = stageCards.exam.querySelector('.boss-modifier');
        let examScoreMultiplier = 2; // Default exam score multiplier

        // --- Select and display the boss for the exam ---
        const currentAnte = Math.ceil(runState.round / 3); // e.g., Rounds 1-3 are Ante 1
        const availableBosses = ALL_BOSSES.filter(boss => boss.ante <= currentAnte);
        const currentBoss = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        
        if (currentBoss) {
            runState.currentBossId = currentBoss.id; // Save the boss for the gameplay screen
            examBossNameEl.textContent = currentBoss.name;
            examModifierEl.textContent = currentBoss.description;

            // Special handling for The Wall boss
            if (currentBoss.id === 'boss_the_wall') {
                examScoreMultiplier = currentBoss.effect.details.multiplier;
            }
        } else {
            // Handle case where no boss is selected for the round
            runState.currentBossId = null;
            examBossNameEl.textContent = "Standard Exam";
            examModifierEl.textContent = "No special modifiers.";
        }

        const target = ROUND_TARGETS[Math.min(runState.round - 1, ROUND_TARGETS.length - 1)];
        if (quizScoreEl) quizScoreEl.textContent = target;
        if (testScoreEl) testScoreEl.textContent = Math.round(target * 1.5); // Test is harder
        if (examScoreEl) examScoreEl.textContent = Math.round(target * examScoreMultiplier);

        if (runState.round === 8 && examTitleEl) {
            examTitleEl.textContent = 'FINAL EXAM';
        }

        // --- Render card states (completed/active) ---
        STAGES.forEach((stage, index) => {
            const card = stageCards[stage];
            if (!card) return;

            // Remove any existing continue buttons

            if (index < runState.stageIndex) {
                // This stage is completed
                card.classList.add('completed');
                card.href = '#'; // Prevent clicking
            } else if (index === runState.stageIndex) {
                // This is the active stage, add the continue button
                card.classList.remove('completed');
                card.href = '#'; // Disable navigation on the card itself

                // Find the pre-existing hidden buttons and show them.
                const hiddenElements = card.querySelectorAll('.hidden-button');
                hiddenElements.forEach(el => el.style.display = 'block');
                const continueButton = card.querySelector('.card-button');

                if (continueButton) {
                    continueButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent any other clicks on the card
                        
                        runState.stageIndex = index; // Set the correct stage index before saving
                        // Set the target score for the upcoming gameplay session
                        let stageTarget = target;
                        if (stage === 'test') stageTarget = Math.round(target * 1.5);
                        if (stage === 'exam') stageTarget = Math.round(target * examScoreMultiplier);
                        runState.stageTarget = stageTarget;
                        saveRunState(runState);

                        // Navigate to the correct screen
                        if (stage.includes('event')) {
                            window.location.href = 'event.html';
                        } else {
                            window.location.href = 'gameplay.html';
                        }
                    });
                }
            } else {
                // This stage is upcoming
                card.classList.remove('completed');
                card.href = '#'; // Prevent clicking future stages
            }
        });
    }

    init();
});