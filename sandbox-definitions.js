/**
 * =============================================================================
 * ITEM & UPGRADE DEFINITIONS
 * Central repository for all purchasable/collectible items in the game.
 * =============================================================================
 */

// --- GLYPH DEFINITIONS ---

class GlyphA extends Glyph {
    constructor() {
        super({
            id: 'glyph_a',
            name: 'A Glyph',
            description: 'Played tiles with A give +3 Mult when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'big-a.png',
            hasAction: true,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'A') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }

    getPowerText() {
        return { text: '+3 MULT', class: 'mult' };
    }
}

class GlyphE extends Glyph {
    constructor() {
        super({
            id: 'glyph_e',
            name: 'E Glyph',
            description: 'Played tiles with E give +3 Mult when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'big-e.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'E') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }

    getPowerText() {
        return { text: '+3 MULT', class: 'mult' };
    }
}

class GlyphI extends Glyph {
    constructor() {
        super({
            id: 'glyph_i',
            name: 'I Glyph',
            description: 'Played tiles with I give +3 Mult when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'big-i.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'I') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }

    getPowerText() {
        return { text: '+3 MULT', class: 'mult' };
    }
}

class GlyphO extends Glyph {
    constructor() {
        super({
            id: 'glyph_o',
            name: 'O Glyph',
            description: 'Played tiles with O give +3 Mult when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'big-o.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'O') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }

    getPowerText() {
        return { text: '+3 MULT', class: 'mult' };
    }
}

class GlyphU extends Glyph {
    constructor() {
        super({
            id: 'glyph_u',
            name: 'U Glyph',
            description: 'Played tiles with U give +3 Mult when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'big-u.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'U') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }

    getPowerText() {
        return { text: '+3 MULT', class: 'mult' };
    }
}

class GlyphAPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_a_points',
            name: 'a Glyph',
            description: 'Played tiles with A give +20 points when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'little-a.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'A') bonusScore += 20;
        });
        return { bonusScore };
    }

    getPowerText() {
        return { text: '+20 PTS', class: 'score' };
    }
}

class GlyphEPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_e_points',
            name: 'e Glyph',
            description: 'Played tiles with E give +20 points when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'little-e.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'E') bonusScore += 20;
        });
        return { bonusScore };
    }

    getPowerText() {
        return { text: '+20 PTS', class: 'score' };
    }
}

class GlyphIPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_i_points',
            name: 'i Glyph',
            description: 'Played tiles with I give +20 points when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'little-i.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'I') bonusScore += 20;
        });
        return { bonusScore };
    }

    getPowerText() {
        return { text: '+20 PTS', class: 'score' };
    }
}

class GlyphOPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_o_points',
            name: 'o Glyph',
            description: 'Played tiles with O give +20 points when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'little-o.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'O') bonusScore += 20;
        });
        return { bonusScore };
    }

    getPowerText() {
        return { text: '+20 PTS', class: 'score' };
    }
}

class GlyphUPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_u_points',
            name: 'u Glyph',
            description: 'Played tiles with U give +20 points when scored.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'little-u.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'U') bonusScore += 20;
        });
        return { bonusScore };
    }

    getPowerText() {
        return { text: '+20 PTS', class: 'score' };
    }
}

class GlyphPilcrow extends Glyph {
    constructor() {
        super({
            id: 'glyph_pilcrow',
            name: 'Pilcrow',
            description: 'Gain +1 max Refreshes for the run.',
            rarity: 'Common',
            tags: ['utility'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'pilcrow.png',
            hasAction: true, // This glyph has a usable action
        });
    }

    getPowerText() {
        return { text: '+1 REFRESH', class: 'utility' };
    }
}

class GlyphAmpersand extends Glyph {
    constructor() {
        super({
            id: 'glyph_ampersand',
            name: 'Ampersand',
            description: "Words containing 'AND' score a bonus +50 points.",
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'ampersand.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        const word = handInfo.playedTiles.map(t => t.letter).join('');
        if (word.includes('AND')) return { bonusScore: 50 };
        return {};
    }

    getPowerText() {
        return { text: '+50 PTS', class: 'score' };
    }
}

class GlyphCedille extends Glyph {
    constructor() {
        super({
            id: 'glyph_cedille',
            name: 'Cedille',
            description: "Words starting with 'LE' or 'LA' score a bonus +X points.",
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'cedille.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        const word = handInfo.playedTiles.map(t => t.letter).join('');
        if (word.startsWith('LE') || word.startsWith('LA')) {
            return { bonusScore: 40 };
        }
        return {};
    }

    getPowerText() {
        return { text: '+40 PTS', class: 'score' };
    }
}

class GlyphStar extends Glyph {
    constructor() {
        super({
            id: 'glyph_star',
            name: 'Star Glyph',
            description: 'A placeholder glyph for testing in the sandbox.',
            rarity: 'Rare',
            tags: ['sandbox', 'test'],
            purchaseCost: 10,
            sellValue: 5,
            imageName: 'star.png', // You would create a star.png image for this
            hasAction: true,
        });
    }

    getPowerText() {
        return { text: 'TEST', class: 'utility' };
    }
}

class GlyphExclamation extends Glyph {
    constructor() {
        super({
            id: 'glyph_exclamation',
            name: 'Exclamation',
            description: 'A placeholder glyph for testing.',
            rarity: 'Common',
            tags: ['sandbox', 'test'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'exclamation.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'TEST', class: 'utility' };
    }
}

class GlyphInterest extends Glyph {
    constructor() {
        super({
            id: 'glyph_interest',
            name: 'Interest',
            description: 'Raise the cap on interest earned in each round to $20',
            rarity: 'Uncommon',
            tags: ['economy'],
            purchaseCost: 10,
            sellValue: 5,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphSly extends Glyph {
    constructor() {
        super({
            id: 'glyph_sly',
            name: 'Sly Glyph',
            description: '+50 Points if played word contains a pair of letters. MAM',
            rarity: 'Common',
            tags: [],
            purchaseCost: 3,
            sellValue: 1,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+50 PTS', class: 'score' }; }
}

class GlyphClever extends Glyph {
    constructor() {
        super({
            id: 'glyph_clever',
            name: 'Clever Glyph',
            description: '+80 Points if played word contains a two pairs of letters. OPPOsition',
            rarity: 'Common',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+80 PTS', class: 'score' }; }
}

class GlyphDevious extends Glyph {
    constructor() {
        super({
            id: 'glyph_devious',
            name: 'Devious Glyph',
            description: '+100 Points if played tiles are in alphabetical order. BOX',
            rarity: 'Common',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+100 PTS', class: 'score' }; }
}

class GlyphMicro extends Glyph {
    constructor() {
        super({
            id: 'glyph_micro',
            name: 'Micro Mu',
            description: 'Words played with 6 or less letters get +4 mult',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+4 MULT', class: 'mult' }; }
}

class GlyphStencil extends Glyph {
    constructor() {
        super({
            id: 'glyph_stencil',
            name: 'Glyph Stencil',
            description: 'X1 Mult Mult for each empty Glyph slot. Glyph Stencil included {Attribute variable showing active value:}',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X1 MULT', class: 'mult' }; }
}

class GlyphMime extends Glyph {
    constructor() {
        super({
            id: 'glyph_mime',
            name: 'Mime',
            description: 'Retrigger all tile held in word abilities',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'RETRIGGER', class: 'utility' };
    }
}

class GlyphCreditCard extends Glyph {
    constructor() {
        super({
            id: 'glyph_credit_card',
            name: 'Credit Card',
            description: 'Go up to -$20 in debt',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 1,
            sellValue: 0,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphCeremonialDagger extends Glyph {
    constructor() {
        super({
            id: 'glyph_ceremonial_dagger',
            name: 'Ceremonial Dagger',
            description: 'When next round is selected, destroy Glyph to the right and permanently add double its sell value to this Mult {Attribute variable showing value:{Attribute variable that shows the unique value:} (Currently +0 Mult)}',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'SCALING', class: 'utility' };
    }
}

class GlyphBanner extends Glyph {
    constructor() {
        super({
            id: 'glyph_banner',
            name: 'Banner',
            description: '+30 Points for each refresh remaining',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+30 PTS', class: 'score' }; }
}

class GlyphMysticSummit extends Glyph {
    constructor() {
        super({
            id: 'glyph_mystic_summit',
            name: 'Mystic Summit',
            description: '+15 Mult when 0 refreshes remaining',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+15 MULT', class: 'mult' }; }
}

class GlyphMarble extends Glyph {
    constructor() {
        super({
            id: 'glyph_marble',
            name: 'Marble Glyph',
            description: 'Adds one stone tile to the bag when round is selected',
            rarity: 'Uncommon',
            tags: ['utility'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphLoyaltyCard extends Glyph {
    constructor() {
        super({
            id: 'glyph_loyalty_card',
            name: 'Loyalty Card',
            description: 'X4 Mult every 6 words played {Attribute variable: (6 remaining)}',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X4 MULT', class: 'mult' }; }
}

class GlyphMisprint extends Glyph {
    constructor() {
        super({
            id: 'glyph_misprint',
            name: 'Misprint',
            description: '+0-23 Mult',
            rarity: 'Common',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+0-23 MULT', class: 'mult' }; }
}

class GlyphDusk extends Glyph {
    constructor() {
        super({
            id: 'glyph_dusk',
            name: 'Dusk',
            description: 'Retrigger all played tiles in final word of the round',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'RETRIGGER', class: 'utility' };
    }
}

class GlyphRaisedFist extends Glyph {
    constructor() {
        super({
            id: 'glyph_raised_fist',
            name: 'Raised Fist',
            description: 'Adds double the rank of lowest ranked tile held in grid to Mult',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'SCALING', class: 'utility' };
    }
}

class GlyphChaosTheClown extends Glyph {
    constructor() {
        super({
            id: 'glyph_chaos_the_clown',
            name: 'Chaos the Clown',
            description: '1 free Reroll per shop',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphAbstract extends Glyph {
    constructor() {
        super({
            id: 'glyph_abstract',
            name: 'Abstract',
            description: '+3 Mult for each Glyph you own.',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'abstract.png',
            hasAction: false
        });
    }

    /**
     * In the real game, this would read the number of glyphs from the gameState.
     */
    onScoring(gameState, handInfo) {
        const glyphCount = gameState.glyphs ? gameState.glyphs.length : 1;
        return { bonusMult: glyphCount * 3 };
    }

    /**
     * Returns both a static description of the power and a dynamic one
     * based on the current game state.
     */
    getPowerText(gameState = { glyphs: [{}] }) {
        const glyphCount = gameState.glyphs ? gameState.glyphs.length : 1;
        const currentBonus = glyphCount * 3;
        return { staticText: '+3 MULT', dynamicText: `(Currently +${currentBonus} Mult)`, class: 'mult' };
    }
}

class GlyphDelayedGratification extends Glyph {
    constructor() {
        super({
            id: 'glyph_delayed_gratification',
            name: 'Delayed Gratification',
            description: 'Earn $2 per refresh at the end of the round',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphGrosMichel extends Glyph {
    constructor() {
        super({
            id: 'glyph_gros_michel',
            name: 'Gros Michel',
            description: '+15 Mult 1 in 6 chance this is destroyed at the end of round.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+15 MULT', class: 'mult' }; }
}

class GlyphSpace extends Glyph {
    constructor() {
        super({
            id: 'glyph_space',
            name: 'Space Glyph',
            description: '1 in 4 chance to upgrade level of played tiles',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphEgg extends Glyph {
    constructor() {
        super({
            id: 'glyph_egg',
            name: 'Egg',
            description: 'Gains $3 of sell value at end of round',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphBurglar extends Glyph {
    constructor() {
        super({
            id: 'glyph_burglar',
            name: 'Burglar',
            description: 'When Blind is selected, gain +3 words and lose all refreshes',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphIceCream extends Glyph {
    constructor() {
        super({
            id: 'glyph_ice_cream',
            name: 'Ice Cream',
            description: '+100 Points -5 Points for every word played',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+100 PTS', class: 'score' }; }
}

class GlyphBlue extends Glyph {
    constructor() {
        super({
            id: 'glyph_blue',
            name: 'Blue Glyph',
            description: '+2 Points for each remaining tile in deck {Attribute variable that shows the unique value:} (Currently +104 Points)',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+2 PTS', class: 'score' }; }
}

class GlyphHiker extends Glyph {
    constructor() {
        super({
            id: 'glyph_hiker',
            name: 'Hiker',
            description: 'Every played tile permanently gains +5 Points when scored',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'SCALING', class: 'utility' };
    }
}

class GlyphGreen extends Glyph {
    constructor() {
        super({
            id: 'glyph_green',
            name: 'Green Glyph',
            description: '+1 Mult per word played -1 Mult per distile {Attribute variable that shows the unique value:} (Currently +0 Mult)',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'abstract.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+1 MULT', class: 'mult' }; }
}

class GlyphToDoList extends Glyph {
    constructor() {
        super({
            id: 'glyph_to_do_list',
            name: 'To Do List',
            description: 'Earn $4 if word played is a certain length, word length changes at end of round',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphCavendish extends Glyph {
    constructor() {
        super({
            id: 'glyph_cavendish',
            name: 'Cavendish',
            description: 'X3 Mult 1 in 1000 chance this tile is destroyed at the end of round',
            rarity: 'Common',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X3 MULT', class: 'mult' }; }
}

class GlyphCardSharp extends Glyph {
    constructor() {
        super({
            id: 'glyph_card_sharp',
            name: 'Card Sharp',
            description: 'X3 Mult if played poker word has already been played this round',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X3 MULT', class: 'mult' }; }
}

class GlyphRedCard extends Glyph {
    constructor() {
        super({
            id: 'glyph_red_card',
            name: 'Red Card',
            description: 'This Glyph gains +3 Mult when any Booster Pack is skipped {Attribute variable that shows the unique value:} (Currently +0 Mult)',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+3 MULT', class: 'mult' }; }
}

class GlyphMadness extends Glyph {
    constructor() {
        super({
            id: 'glyph_madness',
            name: 'Madness',
            description: 'When Quiz or Test is selected, gain X0.5 Mult and destroy a random Glyph {Attribute variable that shows the unique value:} (Currently X1 Mult)',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X0.5 MULT', class: 'mult' }; }
}

class GlyphSquare extends Glyph {
    constructor() {
        super({
            id: 'glyph_square',
            name: 'Square Glyph',
            description: 'This Glyph gains +4 Points if played word has exactly 4 tiles {Attribute variable that shows the unique value:} (Currently 0 Points)',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+4 PTS', class: 'score' }; }
}

class GlyphRiffRaff extends Glyph {
    constructor() {
        super({
            id: 'glyph_riff_raff',
            name: 'Riff-Raff',
            description: 'When Blind is selected, create 2 Common Glyphs (Must have room)',
            rarity: 'Common',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphVampire extends Glyph {
    constructor() {
        super({
            id: 'glyph_vampire',
            name: 'Vampire',
            description: 'This Glyph gains X0.1 Mult per scoring Enhanced tile played, removes tile Enhancement {Attribute variable that shows the unique value:} (Currently X1 Mult)',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X0.1 MULT', class: 'mult' }; }
}

class GlyphHologram extends Glyph {
    constructor() {
        super({
            id: 'glyph_hologram',
            name: 'Hologram',
            description: 'This Glyph gains X0.25 Mult every time a playing tile is added to your deck {Attribute variable that shows the unique value:} (Currently X1 Mult)',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X0.25 MULT', class: 'mult' }; }
}

class GlyphVagabond extends Glyph {
    constructor() {
        super({
            id: 'glyph_vagabond',
            name: 'Vagabond',
            description: 'Create a consumablet tile if word is played with $4 or less',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphRocket extends Glyph {
    constructor() {
        super({
            id: 'glyph_rocket',
            name: 'Rocket',
            description: 'Earn $1 at end of round. Payout increases by $2 when round Exam is passed',
            rarity: 'Uncommon',
            tags: ['economy', 'scaling'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphMidasMask extends Glyph {
    constructor() {
        super({
            id: 'glyph_midas_mask',
            name: 'Midas Mask',
            description: 'All played vowel tiles become Gold tiles when scored',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphLuchador extends Glyph {
    constructor() {
        super({
            id: 'glyph_luchador',
            name: 'Luchador',
            description: 'Sell this tile to disable the current Boss Blind',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphGiftCard extends Glyph {
    constructor() {
        super({
            id: 'glyph_gift_card',
            name: 'Gift Card',
            description: 'Add $1 of sell value to every Glyph and Consumable tile at end of round',
            rarity: 'Uncommon',
            tags: ['economy'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphTurtleBean extends Glyph {
    constructor() {
        super({
            id: 'glyph_turtle_bean',
            name: 'Turtle Bean',
            description: '+4 grid size, reduces by 1 each round',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphToTheMoon extends Glyph {
    constructor() {
        super({
            id: 'glyph_to_the_moon',
            name: 'To the Moon',
            description: 'Earn an extra $1 of interest for every $5 you have at end of round',
            rarity: 'Uncommon',
            tags: ['economy'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphDrunkard extends Glyph {
    constructor() {
        super({
            id: 'glyph_drunkard',
            name: 'Drunkard',
            description: '+1 distile each round',
            rarity: 'Common',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphGolden extends Glyph {
    constructor() {
        super({
            id: 'glyph_golden',
            name: 'Golden Glyph',
            description: 'Earn $4 at end of round',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphLuckyCat extends Glyph {
    constructor() {
        super({
            id: 'glyph_lucky_cat',
            name: 'Lucky Cat',
            description: 'This Glyph gains X0.25 Mult every time a Lucky tile successfully triggers {Attribute variable that shows the unique value:} (Currently X1 Mult)',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X0.25 MULT', class: 'mult' }; }
}

class GlyphBaseballCard extends Glyph {
    constructor() {
        super({
            id: 'glyph_baseball_card',
            name: 'Baseball Card',
            description: 'Uncommon Glyphs each give X1.5 Mult',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X1.5 MULT', class: 'mult' }; }
}

class GlyphBull extends Glyph {
    constructor() {
        super({
            id: 'glyph_bull',
            name: 'Bull',
            description: '+2 Points for each $1 you have {Attribute variable that shows the unique value:} (Currently +0 Points)',
            rarity: 'Uncommon',
            tags: ['economy', 'scaling'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+2 PTS', class: 'score' }; }
}

class GlyphDietCola extends Glyph {
    constructor() {
        super({
            id: 'glyph_diet_cola',
            name: 'Diet Cola',
            description: 'Sell this tile to create a free Double Tag',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphTradingCard extends Glyph {
    constructor() {
        super({
            id: 'glyph_trading_card',
            name: 'Trading Card',
            description: 'If first distile of round has only 1 tile, destroy it and earn $3',
            rarity: 'Uncommon',
            tags: ['economy'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphPopcorn extends Glyph {
    constructor() {
        super({
            id: 'glyph_popcorn',
            name: 'Popcorn',
            description: '+20 Mult -4 Mult per round played',
            rarity: 'Common',
            tags: ['scaling'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+20 MULT', class: 'mult' }; }
}

class GlyphRamen extends Glyph {
    constructor() {
        super({
            id: 'glyph_ramen',
            name: 'Ramen',
            description: 'X2 Mult, loses X0.25 Mult per refresh/tile distile',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X2 MULT', class: 'mult' }; }
}

class GlyphSeltzer extends Glyph {
    constructor() {
        super({
            id: 'glyph_seltzer',
            name: 'Seltzer',
            description: 'Retrigger all tiles played for the next 10 words',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'RETRIGGER', class: 'utility' };
    }
}

class GlyphGoldenTicket extends Glyph {
    constructor() {
        super({
            id: 'glyph_golden_ticket',
            name: 'Golden Ticket',
            description: 'Played Gold tiles earn $4 when scored',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphMrBones extends Glyph {
    constructor() {
        super({
            id: 'glyph_mr_bones',
            name: 'Mr. Bones',
            description: 'Prevents Death if points scored are at least 25% of required chips self destructs',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphAcrobat extends Glyph {
    constructor() {
        super({
            id: 'glyph_acrobat',
            name: 'Acrobat',
            description: 'X3 Mult on final word of round',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X3 MULT', class: 'mult' }; }
}

class GlyphSockAndBuskin extends Glyph {
    constructor() {
        super({
            id: 'glyph_sock_and_buskin',
            name: 'Sock and Buskin',
            description: 'Retrigger all played vowel tiles',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'RETRIGGER', class: 'utility' };
    }
}

class GlyphTroubadour extends Glyph {
    constructor() {
        super({
            id: 'glyph_troubadour',
            name: 'Troubadour',
            description: '+2 word size, -1 word per round',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphHangingChad extends Glyph {
    constructor() {
        super({
            id: 'glyph_hanging_chad',
            name: 'Hanging Chad',
            description: 'Retrigger first played tile used in scoring 2 additional times',
            rarity: 'Common',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'RETRIGGER', class: 'utility' };
    }
}

class GlyphRoughGem extends Glyph {
    constructor() {
        super({
            id: 'glyph_rough_gem',
            name: 'Rough Gem',
            description: 'Played U tiles earn $1 when scored',
            rarity: 'Uncommon',
            tags: ['economy'],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphBloodstone extends Glyph {
    constructor() {
        super({
            id: 'glyph_bloodstone',
            name: 'Bloodstone',
            description: '1 in 2 chance for played O tiles to give X1.5 Mult when scored',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X1.5 MULT', class: 'mult' }; }
}

class GlyphArrowhead extends Glyph {
    constructor() {
        super({
            id: 'glyph_arrowhead',
            name: 'Arrowhead',
            description: 'Played E tiles with give +50 Points when scored',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+50 PTS', class: 'score' }; }
}

class GlyphOnyxAgate extends Glyph {
    constructor() {
        super({
            id: 'glyph_onyx_agate',
            name: 'Onyx Agate',
            description: 'Played I tiles give +7 Mult when scored',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+7 MULT', class: 'mult' }; }
}

class GlyphGlass extends Glyph {
    constructor() {
        super({
            id: 'glyph_glass',
            name: 'Glass Glyph',
            description: 'This Glyph gains X0.75 Mult for every Glass tile that is destroyed {Attribute variable that shows the unique value:} (Currently X1 Mult)',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X0.75 MULT', class: 'mult' }; }
}

class GlyphFlowerPot extends Glyph {
    constructor() {
        super({
            id: 'glyph_flower_pot',
            name: 'Flower Pot',
            description: 'X3 Mult if word contains a 4 different vowels.',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X3 MULT', class: 'mult' }; }
}

class GlyphBlueprint extends Glyph {
    constructor() {
        super({
            id: 'glyph_blueprint',
            name: 'Blueprint',
            description: 'Copies ability of Glyph to the right',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 10,
            sellValue: 5,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphMerryAndy extends Glyph {
    constructor() {
        super({
            id: 'glyph_merry_andy',
            name: 'Merry Andy',
            description: '+3 words each round, -1 grid size',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphOopsAll6s extends Glyph {
    constructor() {
        super({
            id: 'glyph_oops_all_6s',
            name: 'Oops! All 6s',
            description: 'Doubles all listed probabilities (ex: 1 in 3 -> 2 in 3)',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 4,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphTheDuo extends Glyph {
    constructor() {
        super({
            id: 'glyph_the_duo',
            name: 'The Duo',
            description: 'X2 Mult if played word contains a two of the same letters',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X2 MULT', class: 'mult' }; }
}

class GlyphTheTrio extends Glyph {
    constructor() {
        super({
            id: 'glyph_the_trio',
            name: 'The Trio',
            description: 'X3 Mult if played word contains a three of the same letters',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X3 MULT', class: 'mult' }; }
}

class GlyphStuntman extends Glyph {
    constructor() {
        super({
            id: 'glyph_stuntman',
            name: 'Stuntman',
            description: '+250 Points, -1 grid column',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+250 PTS', class: 'score' }; }
}

class GlyphBrainstorm extends Glyph {
    constructor() {
        super({
            id: 'glyph_brainstorm',
            name: 'Brainstorm',
            description: 'Copies the ability of leftmost Glyph',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 10,
            sellValue: 5,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphDriversLicense extends Glyph {
    constructor() {
        super({
            id: 'glyph_drivers_license',
            name: 'Driver\'s License',
            description: 'X3 Mult if you have at least 16 Enhanced tiles in your full deck {Attribute variable that shows the unique value:} (Currently 0)',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X3 MULT', class: 'mult' }; }
}

class GlyphBootstraps extends Glyph {
    constructor() {
        super({
            id: 'glyph_bootstraps',
            name: 'Bootstraps',
            description: '+2 Mult for every $5 you have {Attribute variable that shows the unique value:} (Currently +0 Mult)',
            rarity: 'Uncommon',
            tags: ['economy', 'scaling'],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: '+2 MULT', class: 'mult' }; }
}

class GlyphYorick extends Glyph {
    constructor() {
        super({
            id: 'glyph_yorick',
            name: 'Yorick',
            description: 'This Glyph gains X1 Mult every 23 [23] tiles refreshed {Attribute variable that shows the unique value:} (Currently X1 Mult)',
            rarity: 'Legendary',
            tags: ['scaling'],
            purchaseCost: 20,
            sellValue: 10,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() { return { text: 'X1 MULT', class: 'mult' }; }
}

class GlyphChicot extends Glyph {
    constructor() {
        super({
            id: 'glyph_chicot',
            name: 'Chicot',
            description: 'Disables effect of every exam',
            rarity: 'Legendary',
            tags: [],
            purchaseCost: 20,
            sellValue: 10,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphBowOfZyx extends Glyph {
    constructor() {
        super({
            id: 'glyph_bow_of_zyx',
            name: 'Bow of Zyx',
            description: 'Increases damage done by X, Y and Z letter tiles, makes X, Y and Z count as 2.5 letters each (up from 2, 1.5 and 2) towards adjusted word length.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphWoodenParrot extends Glyph {
    constructor() {
        super({
            id: 'glyph_wooden_parrot',
            name: 'Wooden Parrot',
            description: "all 'R' tiles doubled",
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphKanji extends Glyph {
    constructor() {
        super({
            id: 'glyph_kanji',
            name: 'Kanji',
            description: 'Has a 25% chance to break. and return back stronger',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphFourthTile extends Glyph {
    constructor() {
        super({
            id: 'glyph_fourth_tile',
            name: 'Fourth Tile',
            description: 'When submitting, the fourth tile will score 3x its points.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphSecondTile extends Glyph {
    constructor() {
        super({
            id: 'glyph_second_tile',
            name: 'Second Tile',
            description: 'When submitting, the second tile will score 3x its points.',
            rarity: 'Common',
            tags: [],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphFreeReroll extends Glyph {
    constructor() {
        super({
            id: 'glyph_free_reroll',
            name: 'Free Reroll',
            description: 'You can reroll the perks for free, once per round.',
            rarity: 'Common',
            tags: ['economy'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'ECONOMY', class: 'utility' };
    }
}

class GlyphVowelStart extends Glyph {
    constructor() {
        super({
            id: 'glyph_vowel_start',
            name: 'Vowel Start',
            description: 'If the first tile is a Vowel, multiply its score by 5.',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphVowelEnd extends Glyph {
    constructor() {
        super({
            id: 'glyph_vowel_end',
            name: 'Vowel End',
            description: 'If the last tile is a Vowel, permanently increase its score by 2.',
            rarity: 'Uncommon',
            tags: ['scaling'],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'SCALING', class: 'utility' };
    }
}

class GlyphCollector extends Glyph {
    constructor() {
        super({
            id: 'glyph_collector',
            name: 'Collector',
            description: 'Rare and Legendary glyphs are much more likely to appear.',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphSeventhGold extends Glyph {
    constructor() {
        super({
            id: 'glyph_seventh_gold',
            name: 'Seventh Gold',
            description: 'When submitting, convert the seventh tile into a Golden Tile.',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 10,
            sellValue: 5,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphSixthEmerald extends Glyph {
    constructor() {
        super({
            id: 'glyph_sixth_emerald',
            name: 'Sixth Emerald',
            description: 'When submitting, convert the sixth tile into an Emerald Tile.',
            rarity: 'Rare',
            tags: [],
            purchaseCost: 10,
            sellValue: 5,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'UTILITY', class: 'utility' };
    }
}

class GlyphPentagram extends Glyph {
    constructor() {
        super({
            id: 'glyph_pentagram',
            name: 'The Pentagram',
            description: '+100 Points if played word has exactly 5 tiles.',
            rarity: 'Uncommon',
            tags: [],
            purchaseCost: 7,
            sellValue: 3,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    // onScoring provides the data for the base getPowerText()
    onScoring(gameState, handInfo) {
        if (handInfo.playedTiles.length === 5) {
            return { bonusScore: 100 };
        }
        return {};
    }

    getPowerText() { return { text: '+100 PTS', class: 'score' }; }
}

class GlyphDollarsign extends Glyph {
    constructor() {
        super({
            id: 'glyph_dollarsign',
            name: 'Dollarsign',
            description: 'A placeholder glyph for testing.',
            rarity: 'Common',
            tags: ['sandbox', 'test'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'dollarsign.png',
            hasAction: false
        });
    }

    getPowerText() {
        return { text: 'TEST', class: 'utility' };
    }
}

class GlyphZyx extends Glyph {
    constructor() {
        super({
            id: 'glyph_zyx',
            name: 'Zyx',
            description: 'A placeholder glyph for testing.',
            rarity: 'Common',
            tags: ['sandbox', 'test'],
            purchaseCost: 5,
            sellValue: 2,
            imageName: 'test.png',
            hasAction: false,
        });
    }

    getPowerText() {
        return { text: 'TEST', class: 'utility' };
    }
}

// --- GLOBAL ITEM POOLS ---
const ALL_GLYPHS = [
    new GlyphA(),
    new GlyphE(),
    new GlyphI(),
    new GlyphO(),
    new GlyphU(),
    new GlyphAPoints(),
    new GlyphEPoints(),
    new GlyphIPoints(),
    new GlyphOPoints(),
    new GlyphUPoints(),
    new GlyphPilcrow(),
    new GlyphAmpersand(),
    new GlyphCedille(),
    new GlyphStar(),
    new GlyphExclamation(),
    new GlyphClever(),
    new GlyphDevious(),
    new GlyphSly(),
    new GlyphStencil(),
    new GlyphCreditCard(),
    new GlyphMime(),
    new GlyphCeremonialDagger(),
    new GlyphBanner(),
    new GlyphMysticSummit(),
    new GlyphMarble(),
    new GlyphLoyaltyCard(),
    new GlyphMisprint(),
    new GlyphDusk(),
    new GlyphMicro(),
    new GlyphRaisedFist(),
    new GlyphChaosTheClown(),
    new GlyphAbstract(),
    new GlyphDelayedGratification(),
    new GlyphGrosMichel(),
    new GlyphSpace(),
    new GlyphEgg(),
    new GlyphBurglar(),
    new GlyphIceCream(),
    new GlyphBlue(),
    new GlyphHiker(),
    new GlyphGreen(),
    new GlyphToDoList(),
    new GlyphCavendish(),
    new GlyphCardSharp(),
    new GlyphRedCard(),
    new GlyphMadness(),
    new GlyphSquare(),
    new GlyphRiffRaff(),
    new GlyphVampire(),
    new GlyphHologram(),
    new GlyphVagabond(),
    new GlyphRocket(),
    new GlyphMidasMask(),
    new GlyphLuchador(),
    new GlyphGiftCard(),
    new GlyphTurtleBean(),
    new GlyphToTheMoon(),
    new GlyphDrunkard(),
    new GlyphGolden(),
    new GlyphLuckyCat(),
    new GlyphBaseballCard(),
    new GlyphBull(),
    new GlyphDietCola(),
    new GlyphTradingCard(),
    new GlyphPopcorn(),
    new GlyphRamen(),
    new GlyphSeltzer(),
    new GlyphGoldenTicket(),
    new GlyphMrBones(),
    new GlyphAcrobat(),
    new GlyphSockAndBuskin(),
    new GlyphTroubadour(),
    new GlyphHangingChad(),
    new GlyphRoughGem(),
    new GlyphBloodstone(),
    new GlyphArrowhead(),
    new GlyphOnyxAgate(),
    new GlyphGlass(),
    new GlyphFlowerPot(),
    new GlyphBlueprint(),
    new GlyphMerryAndy(),
    new GlyphOopsAll6s(),
    new GlyphTheDuo(),
    new GlyphTheTrio(),
    new GlyphStuntman(),
    new GlyphBrainstorm(),
    new GlyphDriversLicense(),
    new GlyphBootstraps(),
    new GlyphYorick(),
    new GlyphChicot(),
    new GlyphBowOfZyx(),
    new GlyphWoodenParrot(),
    new GlyphKanji(),
    new GlyphFourthTile(),
    new GlyphSecondTile(),
    new GlyphFreeReroll(),
    new GlyphVowelStart(),
    new GlyphVowelEnd(),
    new GlyphCollector(),
    new GlyphSeventhGold(),
    new GlyphSixthEmerald(),
    new GlyphInterest(),
    new GlyphPentagram(),
    new GlyphDollarsign(),
    new GlyphZyx(),
];

// --- UPGRADE DEFINITIONS ---

class ShopUpgrade {
    constructor({ id, name, description, purchaseCost, prerequisiteId = null }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.purchaseCost = purchaseCost;
        this.prerequisiteId = prerequisiteId;
        this.type = 'Upgrade'; // To distinguish from Glyphs
    }

    // This method is called when the upgrade is purchased.
    onPurchase(runState) {
        console.log(`Purchased upgrade: ${this.name}`);
    }
}

class UpgradeOverstock extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_overstock', name: 'Overstock', description: '+1 item in shop.', purchaseCost: 10 });
    }
    onPurchase(runState) {
        runState.shopItemSlots = (runState.shopItemSlots || 2) + 1;
    }
}

class UpgradeOverstockPlus extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_overstock_plus', name: 'Overstock+', description: '+1 item in shop.', purchaseCost: 10, prerequisiteId: 'upgrade_overstock' });
    }
    onPurchase(runState) {
        runState.shopItemSlots = (runState.shopItemSlots || 3) + 1;
    }
}

class UpgradeClearanceSale extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_clearance_sale', name: 'Clearance Sale', description: 'Rerolls cost $2 less.', purchaseCost: 8 });
    }
    onPurchase(runState) {
        runState.rerollCostModifier = (runState.rerollCostModifier || 0) + 2;
    }
}

class UpgradeClearanceSalePlus extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_clearance_sale_plus', name: 'Clearance Sale+', description: 'Rerolls cost an additional $2 less.', purchaseCost: 8, prerequisiteId: 'upgrade_clearance_sale' });
    }
    onPurchase(runState) {
        runState.rerollCostModifier = (runState.rerollCostModifier || 2) + 2;
    }
}

class UpgradeVerbose extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_verbose', name: 'Verbose', description: 'Permanently gain +1 word per round.', purchaseCost: 10 });
    }
    onPurchase(runState) {
        runState.wordsPerRound = (runState.wordsPerRound || 5) + 1;
    }
}

class UpgradeVerbosePlus extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_verbose_plus', name: 'Verbose+', description: 'Permanently gain an additional +1 word per round.', purchaseCost: 10, prerequisiteId: 'upgrade_verbose' });
    }
    onPurchase(runState) {
        runState.wordsPerRound = (runState.wordsPerRound || 6) + 1;
    }
}

class UpgradeRefresh extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_refresh', name: 'Refresh', description: 'Permanently gain +1 refresh each round.', purchaseCost: 8 });
    }
    onPurchase(runState) {
        runState.refreshesPerRound = (runState.refreshesPerRound || 5) + 1;
    }
}

class UpgradeRefreshPlus extends ShopUpgrade {
    constructor() {
        super({ id: 'upgrade_refresh_plus', name: 'Refresh+', description: 'Permanently gain an additional +1 refresh each round.', purchaseCost: 8, prerequisiteId: 'upgrade_refresh' });
    }
    onPurchase(runState) {
        runState.refreshesPerRound = (runState.refreshesPerRound || 6) + 1;
    }
}

// --- GLOBAL UPGRADE POOL ---
const ALL_UPGRADES = [
    new UpgradeOverstock(),
    new UpgradeOverstockPlus(),
    new UpgradeClearanceSale(),
    new UpgradeClearanceSalePlus(),
    new UpgradeVerbose(),
    new UpgradeVerbosePlus(),
    new UpgradeRefresh(),
    new UpgradeRefreshPlus(),
];

// --- CONSUMABLE DEFINITIONS ---
// This new structure is based on the data you provided. Each consumable
// now has a detailed effect object, making it easier to implement game logic.
const ALL_CONSUMABLES = [
    new TarotTile({
        id: 'tarot_fool',
        name: 'The Fool (0)',
        description: 'Creates a copy of the last Arcana tile used (The Fool excluded).',
        effect: { type: 'DUPLICATE', target: 'NONE', details: { action: 'duplicate_last_consumable' } },
        imageName: 'fool.png',
    }),
    new TarotTile({
        id: 'tarot_magician',
        name: 'The Magician (I)',
        description: 'Enhances 2 selected tiles to Lucky tiles.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Lucky', targetCount: 2 } },
        imageName: 'magician.png',
    }),
    new TarotTile({
        id: 'tarot_priestess',
        name: 'The High Priestess (II)',
        description: 'Creates 2 random tiles with length-based suit enhancements.',
        effect: { type: 'CREATE_TILE', target: 'NONE', details: { pool: ['Length'], count: 2 } },
        imageName: 'highpriestess.png',
    }),
    new TarotTile({
        id: 'tarot_star',
        name: 'The Star (XVII)',
        description: 'Randomly converts 4 tiles on the grid to Amethyst.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { action: 'change_suit', suit: 'Diamonds', targetCount: 4 } },
        imageName: 'star.png',
    }),
    new TarotTile({
        id: 'tarot_moon',
        name: 'The Moon (XVIII)',
        description: 'Converts up to 3 tiles on the grid to Sapphire.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { action: 'change_suit', suit: 'Clubs', targetCount: 3 } },
        imageName: 'moon.png',
    }),
    new TarotTile({
        id: 'tarot_empress',
        name: 'The Empress (III)',
        description: 'Enhances 2 selected tiles to Mult tiles.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Mult', targetCount: 2 } },
        imageName: 'empress.png',
    }),
    new TarotTile({
        id: 'tarot_emperor',
        name: 'The Emperor (IV)',
        description: 'Creates up to 2 random Tarot consumable TILEs (Must have room).',
        effect: { type: 'CREATE_TILE', target: 'NONE', details: { pool: ['Tarot'], count: 2 } },
        imageName: 'emperor.png',
    }),
    new TarotTile({
        id: 'tarot_hierophant',
        name: 'The Hierophant (V)',
        description: 'Enhances 2 selected tiles to boosted tiles.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Bonus', targetCount: 2 } },
        imageName: 'hierophant.png',
    }),
    new TarotTile({
        id: 'tarot_lovers',
        name: 'The Lovers (VI)',
        description: 'Makes 1/4 of a wild tile piece.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Wild', targetCount: 1 } },
        imageName: 'lovers.png',
    }),
    new TarotTile({
        id: 'tarot_chariot',
        name: 'The Chariot (VII)',
        description: 'Enhances 1 selected tile into a Steel tile.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Steel', targetCount: 1 } },
        imageName: 'chariot.png',
    }),
    new TarotTile({
        id: 'tarot_justice',
        name: 'Justice (VIII)',
        description: 'Enhances 1 selected tile into a Glass tile.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Glass', targetCount: 1 } },
        imageName: 'justice.png',
    }),
    new TarotTile({
        id: 'tarot_hermit',
        name: 'The Hermit (IX)',
        description: 'Doubles money (Max of $20).',
        effect: { type: 'ADD_MONEY', target: 'NONE', details: { action: 'double', max_gain: 20 } },
        imageName: 'hermit.png',
    }),
    new TarotTile({
        id: 'tarot_wheel',
        name: 'The Wheel of Fortune (X)',
        description: '1 in 4 chance to add Foil, Holographic, or Polychrome edition to a random Glyph.',
        effect: { type: 'MODIFY_GLYPH', target: 'NONE', details: { action: 'add_random_edition', target: 'random_glyph', chance: 0.25, editions: ['Foil', 'Holographic', 'Polychrome'] } },
        imageName: 'wheel.png',
    }),
    new TarotTile({
        id: 'tarot_strength',
        name: 'Strength (XI)',
        description: 'Permanatly adds 10+ points to 2 selected tiles.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { action: 'rank_up', targetCount: 2, amount: 1 } },
        imageName: 'strength.png',
    }),
    new TarotTile({
        id: 'tarot_hanged_man',
        name: 'The Hanged Man (XII)',
        description: 'Destroys up to 2 selected tiles.',
        effect: { type: 'DESTROY', target: 'TILE_IN_HAND', details: { target: 'selected_tile', targetCount: 2 } },
        imageName: 'hangedman.png',
    }),
    new TarotTile({
        id: 'tarot_death',
        name: 'Death (XIII)',
        description: 'Select 2 tiles, convert the left tile into the right tile (Drag to rearrange).',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { action: 'convert', targetCount: 2, source: 'left', destination: 'right' } },
        imageName: 'death.png',
    }),
    new TarotTile({
        id: 'tarot_temperance',
        name: 'Temperance (XIV)',
        description: 'Gives the total sell value of all current Glyphs (Max of $50).',
        effect: { type: 'ADD_MONEY', target: 'NONE', details: { action: 'sell_all_glyphs_value', max_gain: 50 } },
        imageName: 'temperance.png',
    }),
    new TarotTile({
        id: 'tarot_devil',
        name: 'The Devil (XV)',
        description: 'Enhances 1 selected tile into a Gold tile.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Gold', targetCount: 1 } },
        imageName: 'devil.png',
    }),
    new TarotTile({
        id: 'tarot_tower',
        name: 'The Tower (XVI)',
        description: 'Enhances 1 selected tile into a Stone tile.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { enhancement: 'Stone', targetCount: 1 } },
        imageName: 'tower.png',
    }),
    new TarotTile({
        id: 'tarot_judgement',
        name: 'Judgement (XX)',
        description: 'Creates a random Glyph (Must have room).',
        effect: { type: 'CREATE_GLYPH', target: 'NONE', details: { count: 1, isPristine: true } },
        imageName: 'judgement.png',
    }),
    new TarotTile({
        id: 'tarot_sun',
        name: 'The Sun (XIX)',
        description: 'Converts up to 2 tiles on the grid to Ruby.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { action: 'change_suit', suit: 'Hearts', targetCount: 2 } },
        imageName: 'sun.png',
    }),
    new TarotTile({
        id: 'tarot_world',
        name: 'The World (XXI)',
        description: 'Converts up to 1 selected tiles on grid to Diamond.',
        effect: { type: 'MODIFY_TILE', target: 'TILE_IN_HAND', details: { action: 'change_suit', suit: 'Spades', targetCount: 1 } },
        imageName: 'world.png',
    }),
];

// --- [NEW] CONSUMABLE FACTORY MAP ---
// This allows us to re-create consumable instances from a saved ID.
const CONSUMABLE_MAP = {
    'tarot_fool': TarotTile,
    'tarot_magician': TarotTile,
    'tarot_priestess': TarotTile,
    'tarot_empress': TarotTile,
    'tarot_emperor': TarotTile,
    'tarot_hierophant': TarotTile,
    'tarot_lovers': TarotTile,
    'tarot_chariot': TarotTile,
    'tarot_justice': TarotTile,
    'tarot_hermit': TarotTile,
    'tarot_wheel': TarotTile,
    'tarot_strength': TarotTile,
    'tarot_hanged_man': TarotTile,
    'tarot_death': TarotTile,
    'tarot_temperance': TarotTile,
    'tarot_devil': TarotTile,
    'tarot_tower': TarotTile,
    'tarot_star': TarotTile,
    'tarot_moon': TarotTile,
    'tarot_sun': TarotTile,
    'tarot_judgement': TarotTile,
    'tarot_world': TarotTile,
};

// --- [NEW] SPECIAL TILE DEFINITIONS ---
// These are unique tiles that can be added to a player's bag.
const ALL_SPECIAL_TILES = [
    {
        id: 'special_wildcard',
        name: 'Wild Tile',
        letter: '*',
        description: 'Can be used as any letter. Consumed on use.',
        imageName: 'wild.png', // Placeholder image
    },
    {
        id: 'special_anchor',
        name: 'Anchor',
        letter: '#',
        description: 'Must be the first letter. Triples the score of the letter immediately following it.',
        imageName: 'anchor.png', // Placeholder image
    },
    {
        id: 'special_mirror',
        name: 'Mirror',
        letter: '||',
        description: 'Copies abilities of left and right tiles.',
        imageName: 'mirror.png', // Placeholder image
    },
    {
        id: 'special_exclamation',
        name: 'Exclamation',
        letter: '!',
        description: 'Scores equal to the number of unsubmitted tiles you have left over, but it has to end the word.',
        imageName: 'exclamation.png', // Placeholder image
    },
    {
        id: 'special_plus',
        name: 'Plus',
        letter: '+',
        description: 'Allows you to submit multiple words at once (e.g. FROG+RACE).',
        imageName: 'plus.png', // Placeholder image
    },
];

// --- GRAB BAG DEFINITIONS ---

const ALL_GRAB_BAGS = [
    // --- [NEW] Specific Arcana Packs ---
    new GrabBag({
        id: 'pack_arcana_normal',
        name: 'Arcana Pack',
        type: 'Arcana',
        description: 'Choose 1 of 3 Tarot Tiles.',
        purchaseCost: 4,
        packSize: 3,
        picks: 1,
        lootTable: { itemType: 'Tarot' }
    }),
    new GrabBag({
        id: 'pack_arcana_jumbo',
        name: 'Jumbo Arcana Pack',
        type: 'Arcana',
        description: 'Choose 1 of 5 Tarot Tiles.',
        purchaseCost: 6,
        packSize: 5,
        picks: 1,
        lootTable: { itemType: 'Tarot' }
    }),
    new GrabBag({
        id: 'pack_arcana_mega',
        name: 'Mega Arcana Pack',
        type: 'Arcana',
        description: 'Choose 2 of 5 Tarot Tiles.',
        purchaseCost: 8,
        packSize: 5,
        picks: 2,
        lootTable: { itemType: 'Tarot' }
    }),
    // --- Other Grab Bags ---
    new GrabBag({
        id: 'grab_bag_glyph',
        name: 'Glyph Grab Bag',
        type: 'Glyph',
        description: 'Choose 1 of 4 Glyphs.',
        purchaseCost: 6,
        packSize: 4,
        picks: 1,
        lootTable: { itemType: 'Glyph', rarityWeights: { "Common": 0.75, "Uncommon": 0.20, "Rare": 0.05 } }
    }),
    new GrabBag({
        id: 'grab_bag_spectral',
        name: 'Spectral Grab Bag',
        type: 'Spectral',
        description: 'Choose 1 of 2 powerful but risky Spectral Tiles.',
        purchaseCost: 5,
        packSize: 2,
        picks: 1,
        lootTable: { itemType: 'SpectralTile', rarityWeights: null }
    }),
    new GrabBag({
        id: 'grab_bag_tile',
        name: 'Tile Bag',
        type: 'Tile',
        description: 'Adds 3 random tiles to your tile bag.',
        purchaseCost: 3,
        packSize: 3,
        picks: 3,
        lootTable: { 
            itemType: 'PlayingTile', 
            modifierChances: { "Bonus": 0.1, "Mult": 0.1, "Wild": 0.05, "Foil": 0.04, "Holographic": 0.02 } 
        }
    }),
    new GrabBag({
        id: 'grab_bag_tile_normal',
        name: 'Normal Tile Grab Bag',
        type: 'Tile',
        description: 'Choose 1 of up to 3 tiles to add to your bag.',
        purchaseCost: 4,
        packSize: 3,
        picks: 1,
        lootTable: { 
            itemType: 'PlayingTile', 
            distributionModel: 'Scrabble',
            modifierChances: { "Bonus": 0.1, "Mult": 0.1, "Wild": 0.05, "Foil": 0.04, "Holographic": 0.02 } 
        }
    }),
    new GrabBag({
        id: 'grab_bag_tile_jumbo',
        name: 'Jumbo Tile Grab Bag',
        type: 'Tile',
        description: 'Choose 1 of up to 5 tiles to add to your bag.',
        purchaseCost: 6,
        packSize: 5,
        picks: 1,
        lootTable: { 
            itemType: 'PlayingTile', 
            distributionModel: 'Scrabble',
            modifierChances: { "Bonus": 0.1, "Mult": 0.1, "Wild": 0.05, "Foil": 0.04, "Holographic": 0.02 } 
        }
    }),
    new GrabBag({
        id: 'grab_bag_tile_mega',
        name: 'Mega Tile Grab Bag',
        type: 'Tile',
        description: 'Choose 2 of up to 5 tiles to add to your bag.',
        purchaseCost: 8,
        packSize: 5,
        picks: 2,
        lootTable: { 
            itemType: 'PlayingTile', 
            distributionModel: 'Scrabble',
            modifierChances: { "Bonus": 0.1, "Mult": 0.1, "Wild": 0.05, "Foil": 0.04, "Holographic": 0.02 } 
        }
    }),
    new GrabBag({
        id: 'grab_bag_glyph_normal',
        name: 'Normal Glyph Grab Bag',
        type: 'Glyph',
        description: 'Choose 1 of up to 2 glyphs.',
        purchaseCost: 4,
        packSize: 2,
        picks: 1,
        lootTable: { itemType: 'Glyph', rarityWeights: { "Common": 0.75, "Uncommon": 0.20, "Rare": 0.05 } }
    }),
    new GrabBag({
        id: 'grab_bag_glyph_jumbo',
        name: 'Jumbo Glyph Grab Bag',
        type: 'Glyph',
        description: 'Choose 1 of up to 4 glyphs.',
        purchaseCost: 6,
        packSize: 4,
        picks: 1,
        lootTable: { itemType: 'Glyph', rarityWeights: { "Common": 0.75, "Uncommon": 0.20, "Rare": 0.05 } }
    }),
    new GrabBag({
        id: 'grab_bag_glyph_mega',
        name: 'Mega Glyph Grab Bag',
        type: 'Glyph',
        description: 'Choose 2 of up to 4 glyphs.',
        purchaseCost: 8,
        packSize: 4,
        picks: 2,
        lootTable: { itemType: 'Glyph', rarityWeights: { "Common": 0.75, "Uncommon": 0.20, "Rare": 0.05 } }
    }),
];


// --- FACTORY MAP ---
// This allows us to re-create glyph instances from saved data without using eval().
const GLYPH_MAP = {
    'glyph_a': GlyphA,
    'glyph_e': GlyphE,
    'glyph_i': GlyphI,
    'glyph_o': GlyphO,
    'glyph_u': GlyphU,
    'glyph_a_points': GlyphAPoints,
    'glyph_e_points': GlyphEPoints,
    'glyph_i_points': GlyphIPoints,
    'glyph_o_points': GlyphOPoints,
    'glyph_u_points': GlyphUPoints,
    'glyph_pilcrow': GlyphPilcrow,
    'glyph_ampersand': GlyphAmpersand,
    'glyph_cedille': GlyphCedille,
    'glyph_star': GlyphStar,
    'glyph_exclamation': GlyphExclamation,
    'glyph_interest': GlyphInterest,
    'glyph_sly': GlyphSly,
    'glyph_clever': GlyphClever,
    'glyph_stencil': GlyphStencil,
    'glyph_devious': GlyphDevious,
    'glyph_micro': GlyphMicro,
    'glyph_mime': GlyphMime,
    'glyph_credit_card': GlyphCreditCard,
    'glyph_ceremonial_dagger': GlyphCeremonialDagger,
    'glyph_banner': GlyphBanner,
    'glyph_mystic_summit': GlyphMysticSummit,
    'glyph_marble': GlyphMarble,
    'glyph_loyalty_card': GlyphLoyaltyCard,
    'glyph_misprint': GlyphMisprint,
    'glyph_dusk': GlyphDusk,
    'glyph_raised_fist': GlyphRaisedFist,
    'glyph_chaos_the_clown': GlyphChaosTheClown,
    'glyph_abstract': GlyphAbstract,
    'glyph_delayed_gratification': GlyphDelayedGratification,
    'glyph_gros_michel': GlyphGrosMichel,
    'glyph_space': GlyphSpace,
    'glyph_egg': GlyphEgg,
    'glyph_burglar': GlyphBurglar,
    'glyph_ice_cream': GlyphIceCream,
    'glyph_blue': GlyphBlue,
    'glyph_hiker': GlyphHiker,
    'glyph_green': GlyphGreen,
    'glyph_to_do_list': GlyphToDoList,
    'glyph_cavendish': GlyphCavendish,
    'glyph_card_sharp': GlyphCardSharp,
    'glyph_red_card': GlyphRedCard,
    'glyph_madness': GlyphMadness,
    'glyph_square': GlyphSquare,
    'glyph_riff_raff': GlyphRiffRaff,
    'glyph_vampire': GlyphVampire,
    'glyph_hologram': GlyphHologram,
    'glyph_vagabond': GlyphVagabond,
    'glyph_rocket': GlyphRocket,
    'glyph_midas_mask': GlyphMidasMask,
    'glyph_luchador': GlyphLuchador,
    'glyph_gift_card': GlyphGiftCard,
    'glyph_turtle_bean': GlyphTurtleBean,
    'glyph_to_the_moon': GlyphToTheMoon,
    'glyph_drunkard': GlyphDrunkard,
    'glyph_golden': GlyphGolden,
    'glyph_lucky_cat': GlyphLuckyCat,
    'glyph_baseball_card': GlyphBaseballCard,
    'glyph_bull': GlyphBull,
    'glyph_diet_cola': GlyphDietCola,
    'glyph_trading_card': GlyphTradingCard,
    'glyph_popcorn': GlyphPopcorn,
    'glyph_ramen': GlyphRamen,
    'glyph_seltzer': GlyphSeltzer,
    'glyph_golden_ticket': GlyphGoldenTicket,
    'glyph_mr_bones': GlyphMrBones,
    'glyph_acrobat': GlyphAcrobat,
    'glyph_sock_and_buskin': GlyphSockAndBuskin,
    'glyph_troubadour': GlyphTroubadour,
    'glyph_hanging_chad': GlyphHangingChad,
    'glyph_rough_gem': GlyphRoughGem,
    'glyph_bloodstone': GlyphBloodstone,
    'glyph_arrowhead': GlyphArrowhead,
    'glyph_onyx_agate': GlyphOnyxAgate,
    'glyph_glass': GlyphGlass,
    'glyph_flower_pot': GlyphFlowerPot,
    'glyph_blueprint': GlyphBlueprint,
    'glyph_merry_andy': GlyphMerryAndy,
    'glyph_oops_all_6s': GlyphOopsAll6s,
    'glyph_the_duo': GlyphTheDuo,
    'glyph_the_trio': GlyphTheTrio,
    'glyph_stuntman': GlyphStuntman,
    'glyph_brainstorm': GlyphBrainstorm,
    'glyph_drivers_license': GlyphDriversLicense,
    'glyph_bootstraps': GlyphBootstraps,
    'glyph_yorick': GlyphYorick,
    'glyph_chicot': GlyphChicot,
    'glyph_bow_of_zyx': GlyphBowOfZyx,
    'glyph_wooden_parrot': GlyphWoodenParrot,
    'glyph_kanji': GlyphKanji,
    'glyph_fourth_tile': GlyphFourthTile,
    'glyph_second_tile': GlyphSecondTile,
    'glyph_free_reroll': GlyphFreeReroll,
    'glyph_vowel_start': GlyphVowelStart,
    'glyph_vowel_end': GlyphVowelEnd,
    'glyph_collector': GlyphCollector,
    'glyph_seventh_gold': GlyphSeventhGold,
    'glyph_sixth_emerald': GlyphSixthEmerald,
    'glyph_pentagram': GlyphPentagram,
    'glyph_dollarsign': GlyphDollarsign,
    'glyph_zyx': GlyphZyx,
};

const UPGRADE_MAP = {
    'upgrade_overstock': UpgradeOverstock,
    'upgrade_overstock_plus': UpgradeOverstockPlus,
    'upgrade_clearance_sale': UpgradeClearanceSale,
    'upgrade_clearance_sale_plus': UpgradeClearanceSalePlus,
    'upgrade_verbose': UpgradeVerbose,
    'upgrade_verbose_plus': UpgradeVerbosePlus,
    'upgrade_refresh': UpgradeRefresh,
    'upgrade_refresh_plus': UpgradeRefreshPlus,
};

// --- BOSS DEFINITIONS ---

class TheHook extends Boss {
    constructor() {
        super({
            id: 'boss_the_hook',
            name: 'The Hook',
            description: 'Discards 4 random tiles in grid after every played word.',
            ante: 3,
            effect: { type: 'ForceDiscardGrid', details: { count: 4 } }
        });
    }
}

class TheWall extends Boss {
    constructor() {
        super({
            id: 'boss_the_wall',
            name: 'The Wall',
            description: 'Extra large score required to beat (4x the round\'s base score).',
            ante: 2,
            effect: { type: 'ModifyScoreTarget', details: { multiplier: 4 } }
        });
    }
}

class TheWheel extends Boss {
    constructor() {
        super({
            id: 'boss_the_wheel',
            name: 'The Wheel',
            description: '1 in 7 tiles gets randomly debuffed (no value) during the round.',
            ante: 3,
            effect: { type: 'DebuffDrawnTiles', details: { chance: 1/7, debuff: 'Stone' } }
        });
    }
}

class TheWater extends Boss {
    constructor() {
        super({
            id: 'boss_the_water',
            name: 'The Water',
            description: 'Start exam with 0 refreshes.',
            ante: 2,
            effect: { type: 'SetRefreshes', details: { count: 0 } }
        });
    }
}

class TheElbow extends Boss {
    constructor() {
        super({
            id: 'boss_the_elbow',
            name: 'The Elbow',
            description: 'First Tile is locked.',
            ante: 1,
            effect: { type: 'LockFirstTile', details: {} }
        });
    }
}

// --- GLOBAL BOSS POOL ---
const ALL_BOSSES = [
    new TheElbow(),
    new TheHook(),
    new TheWall(),
    new TheWheel(),
    new TheWater(),
];

// --- BOSS FACTORY MAP ---
const BOSS_MAP = {
    'boss_the_wall': TheWall,
    'boss_the_hook': TheHook,
    'boss_the_wheel': TheWheel,
    'boss_the_water': TheWater,
    'boss_the_elbow': TheElbow,
};