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
            tags: ['scoring', 'mult', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'big-a.png', // Use the web-safe artwork name
        });
    }

    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'A') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }
}

class GlyphE extends Glyph {
    constructor() {
        super({
            id: 'glyph_e',
            name: 'E Glyph',
            description: 'Played tiles with E give +3 Mult when scored.',
            rarity: 'Common',
            tags: ['scoring', 'mult', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'big-e.png',
        });
    }

    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'E') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }
}

class GlyphI extends Glyph {
    constructor() {
        super({
            id: 'glyph_i',
            name: 'I Glyph',
            description: 'Played tiles with I give +3 Mult when scored.',
            rarity: 'Common',
            tags: ['scoring', 'mult', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'big-i.png',
        });
    }

    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'I') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }
}

class GlyphO extends Glyph {
    constructor() {
        super({
            id: 'glyph_o',
            name: 'O Glyph',
            description: 'Played tiles with O give +3 Mult when scored.',
            rarity: 'Common',
            tags: ['scoring', 'mult', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'big-o.png',
        });
    }

    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'O') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }
}

class GlyphU extends Glyph {
    constructor() {
        super({
            id: 'glyph_u',
            name: 'U Glyph',
            description: 'Played tiles with U give +3 Mult when scored.',
            rarity: 'Common',
            tags: ['scoring', 'mult', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'big-u.png',
        });
    }

    onScoring(gameState, handInfo) {
        let bonusMult = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'U') {
                bonusMult += 3;
            }
        });
        return { bonusMult };
    }
}

class GlyphAPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_a_points',
            name: 'a Glyph',
            description: 'Played tiles with A give +20 points when scored.',
            rarity: 'Common',
            tags: ['scoring', 'chips', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'little-a.png',
        });
    }
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'A') bonusScore += 20;
        });
        return { bonusScore };
    }
}

class GlyphEPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_e_points',
            name: 'e Glyph',
            description: 'Played tiles with E give +20 points when scored.',
            rarity: 'Common',
            tags: ['scoring', 'chips', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'little-e.png',
        });
    }
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'E') bonusScore += 20;
        });
        return { bonusScore };
    }
}

class GlyphIPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_i_points',
            name: 'i Glyph',
            description: 'Played tiles with I give +20 points when scored.',
            rarity: 'Common',
            tags: ['scoring', 'chips', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'little-i.png',
        });
    }
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'I') bonusScore += 20;
        });
        return { bonusScore };
    }
}

class GlyphOPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_o_points',
            name: 'o Glyph',
            description: 'Played tiles with O give +20 points when scored.',
            rarity: 'Common',
            tags: ['scoring', 'chips', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'little-o.png',
        });
    }
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'O') bonusScore += 20;
        });
        return { bonusScore };
    }
}

class GlyphUPoints extends Glyph {
    constructor() {
        super({
            id: 'glyph_u_points',
            name: 'u Glyph',
            description: 'Played tiles with U give +20 points when scored.',
            rarity: 'Common',
            tags: ['scoring', 'chips', 'rank_based'],
            purchaseCost: 6,
            sellValue: 3,
            imageName: 'little-u.png',
        });
    }
    onScoring(gameState, handInfo) {
        let bonusScore = 0;
        handInfo.playedTiles.forEach(tile => {
            if (tile.letter === 'U') bonusScore += 20;
        });
        return { bonusScore };
    }
}

class GlyphPilcrow extends Glyph {
    constructor() {
        super({
            id: 'glyph_pilcrow',
            name: 'Pilcrow',
            description: 'Gain +1 max Refreshes for the run.',
            rarity: 'Uncommon',
            tags: ['utility', 'refresh'],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'Pilcrow.png',
            hasAction: true, // This glyph has a usable action
        });
    }
}

class GlyphAmpersand extends Glyph {
    constructor() {
        super({
            id: 'glyph_ampersand',
            name: 'Ampersand',
            description: "Words containing 'AND' score a bonus +50 points.",
            rarity: 'Uncommon',
            tags: ['scoring', 'chips'],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'Ampersand.png',
        });
    }

    onScoring(gameState, handInfo) {
        const word = handInfo.playedTiles.map(t => t.letter).join('');
        if (word.includes('AND')) return { bonusScore: 50 };
        return {};
    }
}

class GlyphCedille extends Glyph {
    constructor() {
        super({
            id: 'glyph_cedille',
            name: 'Cedille',
            description: "Words starting with 'LE' or 'LA' score a bonus +40 points.",
            rarity: 'Uncommon',
            tags: ['scoring', 'chips'],
            purchaseCost: 8,
            sellValue: 4,
            imageName: 'Cedille.png',
        });
    }

    onScoring(gameState, handInfo) {
        const word = handInfo.playedTiles.map(t => t.letter).join('');
        if (word.startsWith('LE') || word.startsWith('LA')) {
            return { bonusScore: 40 };
        }
        return {};
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
            hasAction: true,       // Let's give it an action button for testing
        });
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
            imageName: 'exclamation.png', // You would create an exclamation.png image for this
            hasAction: false,
        });
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

// --- GRAB BAG DEFINITIONS ---

const ALL_GRAB_BAGS = [
    new GrabBag({
        id: 'grab_bag_arcana',
        name: 'Arcana Grab Bag',
        type: 'Arcana',
        description: 'Choose 1 of 3 Tarot Tiles.',
        purchaseCost: 4,
        packSize: 3,
        picks: 1,
        lootTable: { itemType: 'TarotTile', rarityWeights: null }
    }),
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