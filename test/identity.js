'use strict'

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Identity = F.Identity;
const identity = F.identity;

describe('Identity', () => {
    describe('call constructor', () => {
        describe('should work', () => {
            it('with value', () => {
                assert.doesNotThrow(() => new Identity(5));
            });
        });

        describe('should throw', () => {
            it('without value', () => {
                assert.throws(() => new Identity());
            });

            it('with null', () => {
                assert.throws(() => new Identity(null));
            });
        });
    });

    describe('create through factory method', () => {
        describe('should work', () => {
            it('with value', () => {
                assert.doesNotThrow(() => identity(5));
            });
        });

        describe('should throw', () => {
            it('without value', () => {
                assert.throws(() => identity());
            });

            it('with null', () => {
                assert.throws(() => identity(null));
            });
        });
    });

    describe('get value', () => {
        it('should return same value', () => {
            assert.equal(identity(5).value, 5);
        });
    });

    describe('call then', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.equal(identity(5).then(a => a + 3), 8);
            });
        });

        describe('should throw', () => {
            it('without transform', () => {
                assert.throws(identity(5).then);
            });
        });
    });

    describe('function*', () => {
        describe('should yield same value', () => {
            it('when not nothing', () => {
                return co(function* () {
                    return identity(5);
                }).then(
                    val => assert.strictEqual(val, 5),
                    err => assert.ifError(err)
                );
            });
        });
    });
});
