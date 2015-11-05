'use strict';

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Just = F.Just;
const just = F.just;

describe('Just', () => {
    describe('call constructor', () => {
        describe('should work', () => {
            it('with value', () => {
                assert.doesNotThrow(() => new Just(5));
            });
        });

        describe('should throw', () => {
            it('without value', () => {
                assert.throws(() => new Just());
            });

            it('with null', () => {
                assert.throws(() => new Just(null));
            });
        });
    });

    describe('create through factory method', () => {
        describe('should work', () => {
            it('with value', () => {
                assert.doesNotThrow(() => just(5));
            });
        });

        describe('should throw', () => {
            it('without value', () => {
                assert.throws(() => just());
            });

            it('with null', () => {
                assert.throws(() => just(null));
            });
        });
    });

    describe('get value', () => {
        it('should return same value', () => {
            assert.equal(just(5).value, 5);
        });
    });

    describe('call then', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.equal(just(5).then(a => a + 3), 8);
            });
        });

        describe('should throw', () => {
            it('without transform', () => {
                assert.throws(just(5).then);
            });
        });
    });

    describe('function*', () => {
        describe('should yield same value', () => {
            it('when not nothing', () => {
                return co(function* () {
                    return just(5);
                }).then(
                    val => assert.strictEqual(val, 5),
                    err => assert.ifError(err)
                );
            });
        });
    });
});
