document.addEventListener('DOMContentLoaded', () => {
    /**
     * =========================================================================
     * CODE-READY SCORING MODEL (ES6 JavaScript)
     * =========================================================================
     * This function acts as the central scoring engine. It takes the played
     * tiles and active glyphs as input and returns a detailed breakdown of the
     * final score. It is a "pure function," meaning it doesn't rely on any
     * external state, which makes it easy to test and reuse.
     */
    function calculateWordScore(playedTiles, activeGlyphs = []) {
        // Define constants for scoring directly in the model for clarity.
        const WORD_LENGTH_MULTIPLIERS = {
            5: 1,  6: 2,    7: 3,    8: 5,
            9: 8,  10: 13,  11: 21,  12: 34,
            13: 55, 14: 89, 15: 144, 16: 233,
        };

        let baseScore = 0;
        let tileMultiplier = 1;
        let glyphBonusScore = 0;
        let glyphBonusMult = 0;

        // 1. Calculate base score and multipliers from the tiles themselves.
        playedTiles.forEach(tile => {
            baseScore += tile.value + (tile.mult || 0);
            tileMultiplier *= (tile.mult_mult || 1);
        });

        // 2. Calculate bonuses from active glyphs.
        activeGlyphs.forEach(glyph => {
            if (typeof glyph.onScoring === 'function') {
                const result = glyph.onScoring({}, { playedTiles });
                if (result) {
                    glyphBonusScore += (result.bonusScore || 0);
                    glyphBonusMult += (result.bonusMult || 0);
                }
            }
        });

        // 3. Determine the word length multiplier.
        const wordLength = playedTiles.length;
        const lengthMultiplier = WORD_LENGTH_MULTIPLIERS[wordLength] || 1;

        // 4. Calculate the final score.
        const finalScore = Math.round(
            (baseScore + glyphBonusScore) * (tileMultiplier + glyphBonusMult) * lengthMultiplier
        );

        // 5. Return a detailed breakdown.
        return {
            baseScore,
            glyphBonusScore,
            tileMultiplier,
            glyphBonusMult,
            lengthMultiplier,
            finalScore,
        };
    }

    // --- SANDBOX DEMONSTRATION ---

    // 1. Create sample data to simulate a played word.
    const sampleTiles = [
        { letter: 'Q', value: 10, mult: 0, mult_mult: 1 },
        { letter: 'U', value: 1, mult: 0, mult_mult: 1 },
        { letter: 'I', value: 1, mult: 10, mult_mult: 1 }, // e.g., a "Booster" tile
        { letter: 'C', value: 3, mult: 0, mult_mult: 2 }, // e.g., a "Multiplier" tile
        { letter: 'K', value: 5, mult: 0, mult_mult: 1 },
    ];

    // Create a sample glyph for testing.
    const sampleGlyph = {
        name: 'Sample Word Length Glyph',
        onScoring: (gameState, handInfo) => {
            if (handInfo.playedTiles.length >= 5) {
                return { bonusMult: 2 }; // Add +2 Mult for words of 5+ letters
            }
            return {};
        }
    };

    // 2. Run the scoring model with the sample data.
    const score = calculateWordScore(sampleTiles, [sampleGlyph]);

    // 3. Update the UI with the results.
    document.getElementById('calcValue').textContent = score.baseScore + score.glyphBonusScore; // This is now the main value
    document.getElementById('calcMult').textContent = `${score.tileMultiplier + score.glyphBonusMult}x`;
    document.getElementById('calcMultMult').textContent = `${score.lengthMultiplier}x`;
    document.getElementById('calcTotal').textContent = score.finalScore;

    // 4. Render the sample tiles as chips in the scoring area.
    const playedTilesArea = document.getElementById('playedTilesArea');
    if (playedTilesArea) {
        playedTilesArea.innerHTML = ''; // Clear existing chips
        const numSlots = Math.max(8, sampleTiles.length);
        playedTilesArea.style.gridTemplateColumns = `repeat(${numSlots}, 1fr)`;

        for (let i = 0; i < numSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'chip-slot';
            if (sampleTiles[i]) {
                const chip = document.createElement('div');
                chip.className = 'chip';
                chip.textContent = sampleTiles[i].letter === 'Q' ? 'Qu' : sampleTiles[i].letter;
                slot.appendChild(chip);
            }
            playedTilesArea.appendChild(slot);
        }
    }
});