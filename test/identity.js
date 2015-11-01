'use strict'

const assert = require('assert');

const F = require('..');

describe('Identity', () => {
    describe('call constructor', () => {
        describe('with value', () => {
            it('should work', () => {
                assert.doesNotThrow(() => new F.Identity(5));
            });
        });

        describe('without value', () => {
            it('should throw', () => {
                assert.throws(() => new F.Identity());
            });
        });
    });

    describe('create through factory method', () => {
        describe('with value', () => {
            it('should work', () => {
                assert.doesNotThrow(() => F.identity(5));
            });
        });

        describe('without value', () => {
            it('should throw', () => {
                assert.throws(() => F.identity());
            });
        });
    });

    describe('get value', () => {
        it('should return same value', () => {
            assert.equal(F.identity(5).value, 5);
        });
    });

    describe('call then', () => {
        describe('with transform', () => {
            it('should work', () => {
                assert.equal(F.identity(5).then(a => a + 3), 8);
            });
        });

        describe('without transform', () => {
            it('should throw', () => {
                assert.throws(F.identity(5).then);
            });
        });
    });
});
