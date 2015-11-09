'use strict';

const assert = require('assert');
const co     = require('co');

const M = require('..');

const obeyTheLaw = require('./law');

const Either   = M.Either;
const either   = M.either;
const identity = M.identity;

describe('Either', () => {
    describe('constructor', () => {
        describe('should work', () => {
            it('with left', () => {
                assert.doesNotThrow(() => new Either(5));
            });

            it('with left and right', () => {
                assert.doesNotThrow(() => new Either(5, 7));
            });
        });

        describe('should throw', () => {
            it('without any value', () => {
                assert.throws(() => new Either());
            });
        });
    });

    describe('type constructor', () => {
        describe('should work', () => {
            it('with left', () => {
                assert.doesNotThrow(() => either(5));
            });

            it('with left and right', () => {
                assert.doesNotThrow(() => either(5, 7));
            });
        });

        describe('should throw', () => {
            it('without any value', () => {
                assert.throws(() => either());
            });
        });
    });

    describe('get value', () => {
        it('should return left', () => {
            assert.equal(either(5), 5);
        });
        it('should return right', () => {
            assert.equal(either(5, 7), 7);
        });
    });

    describe('then', () => {
        describe('should transform left', () => {
            it('with transform', () => {
                assert.equal(either(5).then(a => a + 3), 8);
            });

            it('with lifted', () => {
                const result = either(5).then(Either.lift(x => x + 3));
                assert(result instanceof Either);
                assert.equal(result, 8);
            });
        });

        describe('should transform right', () => {
            it('with transform', () => {
                assert.equal(either(5, 7).then(a => a + 3), 10);
            });

            it('with lifted', () => {
                const result = either(5, 7).then(Either.lift(x => x + 3));
                assert(result instanceof Either);
                assert.equal(result, 10);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => either(5).then());
            });

            it('with bad transform', () => {
                assert.throws(() => either(5).then(1));
            });
        });
    });

    describe('map', () => {
        describe('with transform', () => {
            it('should transform left', () => {
                const result = either(5).map(a => a + 3);
                assert(result instanceof Either);
                assert.equal(result, 8);
            });

            it('should transform right', () => {
                const result = either(5, 7).map(a => a + 3);
                assert(result instanceof Either);
                assert.equal(result, 10);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => either(5).map());
            });

            it('with bad transform', () => {
                assert.throws(() => either(5).map(1));
            });
        });
    });

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Either.lift(x => x + 3);
                const result = lifted(5);
                assert(result instanceof Either);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Either.lift());
            });

            it('with bad transform', () => {
                assert.throws(() => Either.lift(1));
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform and values', () => {
                const lifted = Either.lift2((x, y) => x + y);
                const result = lifted(5, 3);
                assert(result instanceof Either);
                assert.equal(result, 8);
            });

            it('with transform and identities', () => {
                const lifted = Either.lift2((x, y) => x + y);
                const result = lifted(identity(5), identity(3));
                assert(result instanceof Either);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Either.lift2());
            });

            it('with bad transform', () => {
                assert.throws(() => Either.lift2(1));
            });
        });
    });

    describe('toString', () => {
        it('should return left', () => {
            assert.strictEqual(either(5).toString(), '5');
        });
        it('should return right', () => {
            assert.strictEqual(either(5, 7).toString(), '7');
        });
    });

    describe('function*', () => {
        describe('should yield same value', () => {
            it('left', () => {
                return co(function* () {
                    return either(5);
                }).then(
                    val => assert.strictEqual(val, 5),
                    err => assert.ifError(err)
                );
            });

            it('right', () => {
                return co(function* () {
                    return either(5, 7);
                }).then(
                    val => assert.strictEqual(val, 7),
                    err => assert.ifError(err)
                );
            });
        });
    });

    obeyTheLaw(Either, either);
});
