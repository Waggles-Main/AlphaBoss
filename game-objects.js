/**
 * =============================================================================
 * 1. GLYPHS
 * Represents a special item that provides a passive or triggered effect.
 * =============================================================================
 */
class Glyph {
    /**
     * @param {object} config - Configuration object for the glyph.
     * @param {string} config.id - Unique identifier.
     * @param {string} config.name - e.g., "Glyph", "Greedy Glyph".
     * @param {string} config.description - The tile's rules text.
     * @param {string} config.rarity - Common, Uncommon, Rare, Legendary.
     * @param {string[]} config.tags - e.g., ["economy", "scaling"].
     * @param {number} config.purchaseCost - Cost to buy from the shop.
     * @param {number} config.sellValue - Value when sold.
     */
    constructor({ id, name, description, rarity, tags, purchaseCost, sellValue, imageName, hasAction }) {
        // Metadata
        this.id = id;
        this.rarity = rarity; // 'Common', 'Uncommon', 'Rare', 'Legendary'
        this.tags = tags || [];
        this.unlockCondition = "Unlocked by default"; // Placeholder

        // Attributes
        this.name = name;
        this.description = description;
        this.edition = { type: 'Base', effect: {} }; // Default edition
        this.isActive = true;
        this.purchaseCost = purchaseCost;
        this.sellValue = sellValue;

        // Visuals
        this.imageName = imageName || `${id}.png`; // Use custom name or default to id.png

        // Interactivity
        this.hasAction = hasAction || false; // Does this glyph have a usable action?
    }

    /**
     * Gets a short, representative text for the glyph's primary power.
     * This can be overridden by subclasses for more complex effects.
     * @returns {{text: string, class: string}|null}
     */
    getPowerText() {
        // Simulate a scoring check to derive power text automatically for simple glyphs.
        if (this.onScoring) {
            const letterToTest = this.id.split('_')[1]?.toUpperCase() || 'A';
            const scoringEffect = this.onScoring({}, { playedTiles: [{ letter: letterToTest }] });
            if (scoringEffect.bonusScore) {
                return { text: `+${scoringEffect.bonusScore} PTS`, class: 'score' };
            }
            if (scoringEffect.bonusMult) {
                return { text: `+${scoringEffect.bonusMult} MULT`, class: 'mult' };
            }
        }
        return null; // No simple power text
    }
    // --- Interaction Methods (to be implemented by subclasses) ---
    onScoring(gameState, handInfo) { console.log(`${this.name} onScoring triggered.`); }
    onTilePlayed(gameState, tile) { console.log(`${this.name} onTilePlayed triggered.`); }
    onHandPlayed(gameState, handInfo) { console.log(`${this.name} onHandPlayed triggered.`); }
    onBlindComplete(gameState, blindInfo) { console.log(`${this.name} onBlindComplete triggered.`); }
    onRoundStart(gameState) { console.log(`${this.name} onRoundStart triggered.`); }
    onTilePurchased(gameState, item) { console.log(`${this.name} onTilePurchased triggered.`); }
    onTileSold(gameState, item) { console.log(`${this.name} onTileSold triggered.`); }
    onDestroy(gameState) { console.log(`${this.name} onDestroy triggered.`); }

    /**
     * Sets the edition of the glyph, which can provide a special bonus.
     * @param {string} type - 'Foil', 'Holographic', or 'Polychrome'.
     * @param {object} effect - The bonus effect, e.g., { "bonusChips": 50 }.
     */
    setEdition(type, effect) {
        this.edition = { type, effect };
    }
}

/**
 * =============================================================================
 * 2. CONSUMABLES
 * Represents a single-use item that provides an immediate, one-time effect.
 * =============================================================================
 */
class Consumable {
    /**
     * @param {object} config - Configuration object for the consumable.
     * @param {string} config.id - Unique identifier.
     * @param {string} config.name - e.g., "The Fool", "Planet X".
     * @param {string} config.type - 'Planet', 'Tarot', 'Spectral', 'Voucher'.
     * @param {string} config.description - Explains the item's effect.
     * @param {object} config.effect - Defines the action to be taken.
     */
    constructor({ id, name, type, description, effect }) {
        // Metadata
        this.id = id;
        this.source = "Unknown"; // Can be set to 'Shop', 'Booster Pack', etc.

        // Attributes
        this.name = name;
        this.type = type;
        this.description = description;

        // Nested Effect Object
        this.effect = effect; // e.g., { type: 'EnhanceHand', details: { handToLevel: 'Flush' } }
    }

    /**
     * Checks if the consumable can be used on a given target.
     * @param {object} gameState - The current state of the game.
     * @param {any} target - The target of the consumable (e.g., a tile, the deck).
     * @returns {boolean} - True if the item can be used.
     */
    canUse(gameState, target) {
        // Example logic: can be overridden by subclasses
        console.log(`Checking if ${this.name} can be used.`);
        return true;
    }

    /**
     * Executes the consumable's effect.
     * @param {object} gameState - The current state of the game.
     * @param {any} target - The target of the consumable.
     */
    use(gameState, target) {
        if (this.canUse(gameState, target)) {
            console.log(`Using ${this.name}. Effect: ${this.effect.type}`);
            // Logic to apply this.effect.details would go here.
        } else {
            console.log(`Cannot use ${this.name} on the specified target.`);
        }
    }
}

// Example subclasses to show inheritance
class TarotTile extends Consumable {
    constructor(config) {
        super({ ...config, type: 'Tarot' });
    }
}

class PlanetTile extends Consumable {
    constructor(config) {
        super({ ...config, type: 'Planet' });
    }
}

/**
 * =============================================================================
 * 4. GRAB BAGS (BOOSTER PACKS)
 * A consumable item that offers a choice of items to the player.
 * =============================================================================
 */
class GrabBag {
    /**
     * @param {object} config - Configuration object for the grab bag.
     * @param {string} config.id - Unique identifier.
     * @param {string} config.name - e.g., "Arcana Grab Bag".
     * @param {string} config.type - 'Arcana', 'Glyph', 'Spectral', 'Tile'.
     * @param {string} config.description - Explains the contents.
     * @param {number} config.purchaseCost - The cost in the shop.
     * @param {number} config.packSize - How many items are revealed.
     * @param {number} config.picks - How many items the player can choose.
     * @param {object} config.lootTable - Defines the possible contents.
     */
    constructor({ id, name, type, description, purchaseCost, packSize, picks, lootTable }) {
        // Metadata
        this.id = id;
        this.type = type; // Used to differentiate in purchase logic

        // Attributes
        this.name = name;
        this.description = description;
        this.purchaseCost = purchaseCost;
        this.packSize = packSize;
        this.picks = picks;

        // Nested LootTable Object
        this.lootTable = lootTable;
    }

    // --- Interaction Methods ---
    onOpen(gameState) {
        console.log(`Opening ${this.name}.`);
        // This method will be responsible for generating loot and showing the selection modal.
    }
}

/**
 * =============================================================================
 * 5. TILE
 * Represents a single playable tile.
 * =============================================================================
 */

// Tile Distribution and Point Values
const TILE_DISTRIBUTION = 'EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTDDDDLLLLSSSSUUUUGGGBBCCFFHHMMPPVVWWYYJKQXZ__'.split('');
const TILE_VALUES = {
    A: 1, E: 1, I: 1, L: 1, N: 1, O: 1, R: 1, S: 1, T: 1, U: 1,
    D: 2, G: 2,
    B: 3, C: 3, M: 3, P: 3,
    F: 4, H: 4, V: 4, W: 4, Y: 4,
    K: 5,
    J: 8, X: 8,
    Q: 10, Z: 10,
    _: 0
};

class Tile {
    constructor(letter, index = null) {
        this.id = `tile-${index ?? 'pool'}-${Date.now()}-${Math.random()}`; // Unique ID for the tile instance
        this.index = index;
        this.letter = letter;
        this.value = TILE_VALUES[letter] || 0; // Base point value
        this.mult = 0;                         // Additive bonus (e.g., +5 from a booster)
        this.mult_mult = 1;                    // Multiplicative bonus (not used yet, but available)
        this.type = null;                      // 'enhancement', 'seal', etc.
        this.modifier = null;                  // 'booster', 'steel', etc.

        // --- MODIFIER ASSIGNMENT ---
        // Placeholder for modifier logic. Here, we'll give a 15% chance for a tile to be Enhanced.
        const rand = Math.random();
        if (rand < 0.15) { // 15% chance for a Booster
            this.type = 'enhancement';
            this.modifier = 'booster';
            this.mult = 10; // Booster adds +10 to the tile's score contribution
        } else if (rand < 0.25) { // Next 10% chance for a Multiplier
            this.type = 'enhancement';
            this.modifier = 'multiplier';
            this.mult_mult = 2; // Multiplies the tile's contribution by 2
        }
    }
}
/*
 * =============================================================================
 * 6. BOSS
 * Represents a special challenge with a unique, round-long effect.
 * =============================================================================
 */
class Boss {
    /**
     * @param {object} config - Configuration object for the boss.
     * @param {string} config.id - Unique identifier.
     * @param {string} config.name - e.g., "The Wall".
     * @param {string} config.description - Explains the boss's effect.
     * @param {number} config.ante - The difficulty tier.
     * @param {object} config.effect - Defines the specific alteration.
     */
    constructor({ id, name, description, ante, effect }) {
        // Metadata
        this.id = id;
        this.ante = ante;

        // Attributes
        this.name = name;
        this.description = description;

        // Nested Effect Object
        this.effect = effect;
    }

    applyEffect(gameState) {
        console.log(`Applying effect for boss: ${this.name}`);
        gameState.activeBossEffect = this.effect;
    }

    removeEffect(gameState) {
        console.log(`Removing effect for boss: ${this.name}`);
        delete gameState.activeBossEffect;
    }
}

/**
 * =============================================================================
 * 3. TILE MODIFIERS
 * Represents an enhancement or status applied to a standard playing tile.
 * =============================================================================
 */
class TileModifier {
    /**
     * @param {object} config - Configuration object for the modifier.
     * @param {string} config.id - Unique identifier.
     * @param {string} config.name - 'Bonus', 'Mult', 'Glass', 'Steel', etc.
     * @param {string} config.description - A brief explanation.
     * @param {number} config.value - The numerical value (e.g., 30 for Bonus).
     * @param {boolean} config.isPersistent - If the modifier remains after being played.
     * @param {string} config.visualIndicator - Reference to the icon/effect.
     */
    constructor({ id, name, description, value, isPersistent, visualIndicator }) {
        // Metadata
        this.id = id;
        this.source = "Unknown"; // e.g., "The Hermit Tarot"
        this.visualIndicator = visualIndicator;

        // Attributes
        this.name = name;
        this.description = description;
        this.value = value;
        this.isPersistent = isPersistent;
    }

    /**
     * Logic that runs when the modifier is first applied to a tile.
     * @param {object} tile - The tile this modifier is being added to.
     */
    onAdded(tile) {
        console.log(`${this.name} modifier added to tile ${tile.id}.`);
    }

    /**
     * Modifies the scoring calculation if the tile is part of the scored hand.
     * @param {object} tile - The tile being scored.
     * @param {object} handInfo - Information about the hand being scored.
     */
    onScoring(tile, handInfo) {
        console.log(`${this.name} onScoring triggered for tile ${tile.id}.`);
    }

    /**
     * A trigger for effects that happen when a tile is held at the end of a round.
     * @param {object} tile - The tile being held.
     * @param {object} gameState - The current state of the game.
     */
    onHold(tile, gameState) {
        console.log(`${this.name} onHold triggered for tile ${tile.id}.`);
    }

    /**
     * A trigger for effects that happen when a tile is discarded.
     * @param {object} tile - The tile being discarded.
     * @param {object} gameState - The current state of the game.
     */
    onDiscard(tile, gameState) {
        console.log(`${this.name} onDiscard triggered for tile ${tile.id}.`);
    }

    /**
     * Logic that runs when the tile is destroyed or removed from play.
     * @param {object} tile - The tile being destroyed.
     * @param {object} gameState - The current state of the game.
     */
    onDestroy(tile, gameState) {
        console.log(`${this.name} onDestroy triggered for tile ${tile.id}.`);
    }
}