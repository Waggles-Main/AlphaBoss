/**
 * =============================================================================
 * WORD SCORE CALCULATOR
 * A self-contained module for calculating word scores based on game rules.
 * =============================================================================
 */

// --- Part 1: Enums (Simulated as Objects) ---

const EffectType = Object.freeze({
    ADD_POINTS: "ADD_POINTS",
    ADD_MULT: "ADD_MULT",
    MULT_MULT: "MULT_MULT",
    ADD_XMULT: "ADD_XMULT",
    MULT_XMULT: "MULT_XMULT"
});

const TriggerType = Object.freeze({
    PERMANENT: "PERMANENT",
    PER_LETTER: "PER_LETTER",
    ON_WORD_CONDITION: "ON_WORD_CONDITION",
    ON_GRID_CONDITION: "ON_GRID_CONDITION"
});

const LetterEnhancement = Object.freeze({
    BONUS_POINTS: "BONUS_POINTS",
    MULT_TILE: "MULT_TILE",
    GLASS_TILE: "GLASS_TILE",
    STEEL_TILE: "STEEL_TILE",
    GOLD_TILE: "GOLD_TILE"
});

const Edition = Object.freeze({
    FOIL: "FOIL",
    HOLOGRAPHIC: "HOLOGRAPHIC",
    POLYCHROME: "POLYCHROME"
});

const StampType = Object.freeze({
    GOLD: "GOLD",
    RED: "RED",
    BLUE: "BLUE",
    PURPLE: "PURPLE",
    BLACK: "BLACK"
});


// --- Part 2: The Calculator Class ---

class WordScoreCalculator {

    // --- MAIN PUBLIC METHOD ---
    calculateScore(playedTiles, heldTiles, activeGlyphs, wordProperties, gridState, availableTileCount = 0) {

        // Part A: Calculate Points (blue) and Mult (red)
        const { totalPoints, totalMult, goldBonus } = this.calculatePointsAndMult(
            playedTiles,
            heldTiles,
            activeGlyphs,
            wordProperties,
            gridState,
            availableTileCount
        );

        // Part B: Calculate Xmult (purple)
        const totalXmult = this.calculateXmult(
            playedTiles,
            activeGlyphs,
            wordProperties,
            gridState
        );

        // Part C: Final Calculation
        const finalScore = Math.round(totalPoints) * Math.round(totalMult) * Math.round(totalXmult);
        
        // Return an object so the game loop can get the score AND the gold bonus.
        return {
            finalScore: finalScore,
            goldBonus: (finalScore > 0) ? goldBonus : 0 // Only grant gold if the word scored
        };
    }


    // --- PART A CALCULATION ---
    calculatePointsAndMult(playedTiles, heldTiles, activeGlyphs, wordProperties, gridState, availableTileCount) {
        let runningPoints = 0;
        let runningMult = 1;
        let goldBonus = 0; // For Gold Stamp

        // Step 2: Score Played Tiles (Left-to-Right)
        playedTiles.forEach((tile, index) => {
            
            // Check for Gold Stamp (only triggers once per tile)
            if (tile.stamp === StampType.GOLD) {
                goldBonus += 3;
            }

            // Check for Red Stamp
            let tileRuns = 1;
            if (tile.stamp === StampType.RED) {
                tileRuns = 2; // This tile will score twice
            }

            // --- [NEW] Anchor Tile Logic ---
            // If the previous tile was an Anchor, this tile's points are tripled.
            if (index > 0 && playedTiles[index - 1].letter === '#') {
                tileRuns *= 3;
            }

            // --- [NEW] Mirror Tile Logic ---
            let mirroredEnhancements = [];
            if (tile.letter === '||') {
                const leftTile = playedTiles[index - 1];
                const rightTile = playedTiles[index + 1];
                if (leftTile?.enhancement) mirroredEnhancements.push(leftTile.enhancement);
                if (rightTile?.enhancement) mirroredEnhancements.push(rightTile.enhancement);
            }

            for (let i = 0; i < tileRuns; i++) {
                // 1. Add Tile Points
                // Anchor and Mirror tiles are worth 0 points themselves
                if (tile.letter !== '#' && tile.letter !== '||') {
                    runningPoints += tile.pointValue;
                }

                // Apply mirrored enhancements
                mirroredEnhancements.forEach(enh => this.applyEnhancement(enh, runningPoints, runningMult));

                // 2. Trigger Enhancements
                switch (tile.enhancement) {
                    case LetterEnhancement.BONUS_POINTS: runningPoints += 30; break;
                    case LetterEnhancement.MULT_TILE: runningMult += 4; break;
                    case LetterEnhancement.GLASS_TILE: runningMult *= 2; break;
                }

                // --- [NEW] Lucky Tile Mult Bonus ---
                if (tile.modifier === 'lucky_tile' && Math.random() < 0.20) { // 1 in 5 chance
                    runningMult += 20;
                }

                // 3. Trigger Editions
                switch (tile.edition) {
                    case Edition.FOIL: runningPoints += 50; break;
                    case Edition.HOLOGRAPHIC: runningMult += 10; break;
                    case Edition.POLYCHROME: runningMult *= 1.5; break;
                }

                // 4. Trigger "Per-Letter" Glyphs
                for (const glyph of activeGlyphs) {
                    if (glyph.trigger === TriggerType.PER_LETTER) {
                        // TODO: Implement per-letter glyph logic
                    }
                }
            }
        });

        // --- [NEW] Exclamation Tile Logic ---
        const lastTile = playedTiles[playedTiles.length - 1];
        if (lastTile && lastTile.letter === '!') {
            runningPoints += availableTileCount;
        }
        
        // Step 2.5: Check for passive effects from Held Tiles
        for (const tile of heldTiles) {
            // Steel Tile: Grants a x1.2 multiplier for each Steel tile left on the grid
            if (tile.modifier === 'steel_tile') {
                runningMult *= 1.2;
            }
        }

        // Step 3: Score Glyphs (Left-to-Right) - Points & Mult
        for (const glyph of activeGlyphs) {
            if (glyph.trigger === TriggerType.PERMANENT) {
                if (glyph.effectType === EffectType.ADD_POINTS) runningPoints += glyph.value;
                if (glyph.effectType === EffectType.ADD_MULT) runningMult += glyph.value;
                if (glyph.effectType === EffectType.MULT_MULT) runningMult *= glyph.value;
            }

            switch (glyph.edition) {
                case Edition.FOIL: runningPoints += 50; break;
                case Edition.HOLOGRAPHIC: runningMult += 10; break;
                case Edition.POLYCHROME: runningMult *= 1.5; break;
            }
        }

        return { totalPoints: runningPoints, totalMult: runningMult, goldBonus: goldBonus };
    }

    // Helper to apply enhancement logic (to support Mirror tile)
    applyEnhancement(enhancement, points, mult) {
        switch (enhancement) {
            case LetterEnhancement.BONUS_POINTS: points += 30; break;
            case LetterEnhancement.MULT_TILE: mult += 4; break;
            case LetterEnhancement.GLASS_TILE: mult *= 2; break;
        }
    }


    // --- PART B CALCULATION ---
    calculateXmult(playedTiles, activeGlyphs, wordProperties, gridState) {
        let runningXmult = 1;

        // Step 5: Score Word & Grid Triggers
        if (wordProperties.length > 6) {
            runningXmult *= 2;
        }
        if (gridState.crossedDoubleWord) {
            runningXmult *= 2;
        }
        if (wordProperties.isPalindrome) {
            runningXmult *= 1.5;
        }

        // Step 5.5: Check for Black Stamp
        if (playedTiles.length > 0) {
            const lastTile = playedTiles[playedTiles.length - 1];
            if (lastTile.stamp === StampType.BLACK) {
                runningXmult *= 2;
            }
        }

        // Step 6: Score Glyphs (Left-to-Right) - Xmult Only
        for (const glyph of activeGlyphs) {
            if (glyph.trigger === TriggerType.PERMANENT) {
                if (glyph.effectType === EffectType.ADD_XMULT) runningXmult += glyph.value;
                if (glyph.effectType === EffectType.MULT_XMULT) runningXmult *= glyph.value;
            }

            if (glyph.trigger === TriggerType.ON_WORD_CONDITION) {
                if (glyph.triggerCondition === 6 && wordProperties.length > 6) {
                    if (glyph.effectType === EffectType.MULT_XMULT) runningXmult *= glyph.value;
                }
            }
        }

        return runningXmult;
    }
}