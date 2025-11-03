/**
 * @jest-environment jsdom
 */

// Assuming game-objects.js and definitions.js are loaded in the test environment.
// If not, you would need to import them:
// const { Glyph } = require('../game-objects');
// const { GlyphInterest } = require('../definitions');

describe('GlyphInterest', () => {
    let glyph;

    beforeEach(() => {
        // Create a new instance of the glyph before each test
        glyph = new GlyphInterest();
    });

    it('should create an instance of GlyphInterest and Glyph', () => {
        expect(glyph).toBeInstanceOf(GlyphInterest);
        expect(glyph).toBeInstanceOf(Glyph);
    });

    it('should have the correct ID and name', () => {
        expect(glyph.id).toBe('glyph_interest');
        expect(glyph.name).toBe('Interest');
    });

    it('should have the correct description', () => {
        expect(glyph.description).toBe('Raise the cap on interest earned in each round to $20');
    });

    it('should have the correct rarity and cost values', () => {
        expect(glyph.rarity).toBe('Uncommon');
        expect(glyph.purchaseCost).toBe(10);
        expect(glyph.sellValue).toBe(5);
    });

    it('should correctly set the action property', () => {
        expect(glyph.hasAction).toBe(false);
    });

    it('should default to "test.png" for the image name when none is provided', () => {
        // This tests the base Glyph class constructor logic which GlyphInterest uses.
        expect(glyph.imageName).toBe('test.png');
    });

    it('should return null for getPowerText since it has no onScoring method', () => {
        // This confirms it inherits the base method correctly and follows the expected path
        // for a glyph without a simple scoring power.
        expect(glyph.getPowerText()).toBeNull();
    });

    it('should have empty tags by default', () => {
        // The constructor in the base class defaults tags to an empty array.
        expect(glyph.tags).toEqual([]);
    });
});