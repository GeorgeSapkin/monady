'use strict'

const assert = require('assert');

const F = require('..');

describe('Either', () => {
    describe('call constructor', () => {
        describe('with left', () => {
            it('should work', () => {
                assert.doesNotThrow(() => new F.Either(5));
            });
        });

        describe('with left and right', () => {
            it('should work', () => {
                assert.doesNotThrow(() => new F.Either(5, 7));
            });
        });

        describe('without any value', () => {
            it('should throw', () => {
                assert.throws(() => new F.Either());
            });
        });
    });

    describe('create through factory method', () => {
        describe('with left', () => {
            it('should work', () => {
                assert.doesNotThrow(() => F.either(5));
            });
        });

        describe('with left and right', () => {
            it('should work', () => {
                assert.doesNotThrow(() => F.either(5, 7));
            });
        });

        describe('without any value', () => {
            it('should throw', () => {
                assert.throws(() => F.either());
            });
        });
    });

    describe('get value', () => {
        it('should return left', () => {
            assert.equal(F.either(5).value, 5);
        });
        it('should return right', () => {
            assert.equal(F.either(5, 7).value, 7);
        });
    });

    describe('call then', () => {
        describe('with transform', () => {
            it('should transform left', () => {
                assert.equal(F.either(5).then(a => a + 3), 8);
            });
            it('should transform right', () => {
                assert.equal(F.either(5, 7).then(a => a + 3), 10);
            });
        });

        describe('without transform', () => {
            it('should throw', () => {
                assert.throws(F.either(5).then);
            });
        });
    });
});
