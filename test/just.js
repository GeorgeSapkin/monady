'use strict'

const assert = require('assert');

const F = require('..');

describe('Just', () => {
    describe('call constructor', () => {
        describe('with value', () => {
            it('should work', () => {
                assert.doesNotThrow(() => new F.Just(5));
            });
        });

        describe('without value', () => {
            it('should throw', () => {
                assert.throws(() => new F.Just());
            });
        });
    });

    describe('create through factory method', () => {
        describe('with value', () => {
            it('should work', () => {
                assert.doesNotThrow(() => F.just(5));
            });
        });

        describe('without value', () => {
            it('should throw', () => {
                assert.throws(() => F.just());
            });
        });
    });

    describe('get value', () => {
        it('should return same value', () => {
            assert.equal(F.just(5).value, 5);
        });
    });

    describe('call then', () => {
        describe('with transform', () => {
            it('should work', () => {
                assert.equal(F.just(5).then(a => a + 3), 8);
            });
        });

        describe('without transform', () => {
            it('should throw', () => {
                assert.throws(F.just(5).then);
            });
        });
    });
});
