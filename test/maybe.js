'use strict';

const assert = require('assert');
const co     = require('co');

const M = require('..');

const obeyTheLaw       = require('./law');
const obeyZeroPlusLaws = require('./law').zeroPlusLaws;

const identity = M.identity;
const just     = M.just;
const Maybe    = M.Maybe;
const maybe    = M.maybe;
const nothing  = M.nothing;

describe('Maybe', () => {
    describe('constructor', () => {
        it('should work', () => {
            assert.doesNotThrow(() => new Maybe(), TypeError);
        });
    });

    describe('type constructor', () => {
        describe('should return just', () => {
            it('with same value using maybe', () => {
                const m = maybe(5);
                assert(m.isJust);
                assert.equal(m, 5);
            });

            it('with same value using just', () => {
                const m = just(5);
                assert(m.isJust);
                assert.equal(m, 5);
            });
        });

        describe('should return Nothing', () => {
            it('with nothing', () => {
                const m = maybe(nothing);
                assert(m.isNothing);
                assert.equal(m, nothing);
            });

            it('with null', () => {
                const m = maybe(null);
                assert(m.isNothing);
                assert.equal(m, nothing);
            });

            it('with no args', () => {
                const m = maybe();
                assert(m.isNothing);
                assert.equal(m, nothing);
            });
        });

        describe('should throw', () => {
            it('when invoking nothing', () => {
                assert.throws(() => nothing());
            });
        });
    });

    describe('predefined constant', () => {
        it('should work', () => {
            assert(nothing instanceof Maybe);
            assert(nothing.isNothing);
        });
    });

    describe('get value', () => {
        it('should return same value for just', () => {
            assert.equal(maybe(5), 5);
        });

        it('should return undefined for nothing', () => {
            assert.strictEqual(maybe().value, undefined);
        });
    });

    describe('bind', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.equal(maybe(5).bind(a => a + 3), 8);
            });

            it('with lifted', () => {
                const result = maybe(5).bind(Maybe.lift(x => x + 3));
                assert(result.isJust);
                assert.equal(result, 8);
            });

            it('on nothing', () => {
                assert.strictEqual(nothing.bind(a => a + 3), nothing);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => maybe(5).bind());
            });

            it('with bad transform', () => {
                assert.throws(() => maybe(5).bind(1));
            });
        });
    });

    describe('then', () => {
        it('should throw on nothing', () => {
            assert.throws(() => nothing.then(a => a), TypeError);
        });
    });

    describe('map', () => {
        describe('should work', () => {
            it('with transform', () => {
                const result = maybe(5).map(a => a + 3);
                assert(result.isJust);
                assert.equal(result, 8);
            });

            it('on nothing', () => {
                assert.equal(nothing.map(a => a), nothing);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => maybe(5).map());
            });

            it('with bad transform', () => {
                assert.throws(() => maybe(5).map(1));
            });
        });
    });

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Maybe.lift(x => x + 3);
                const result = lifted(5);
                assert(result.isJust);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Maybe.lift());
            });

            it('with bad transform', () => {
                assert.throws(() => Maybe.lift(1));
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform and values', () => {
                const lifted = Maybe.lift2((x, y) => x + y);
                const result = lifted(5, 3);
                assert(result.isJust);
                assert.equal(result, 8);
            });

            it('with transform and identities', () => {
                const lifted = Maybe.lift2((x, y) => x + y);
                const result = lifted(identity(5), identity(3));
                assert(result.isJust);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Maybe.lift2());
            });

            it('with bad transform', () => {
                assert.throws(() => Maybe.lift2(1));
            });
        });
    });


    describe('toString', () => {
        describe('should return value', () => {
            it('with same value', () => {
                assert.strictEqual(maybe(5).toString(), '5');
            });
        });

        describe('should return Nothing', () => {
            it('with nothing', () => {
                assert.strictEqual(maybe(nothing).toString(), 'Nothing');
            });

            it('with null', () => {
                assert.strictEqual(maybe(null).toString(), 'Nothing');
            });

            it('with no args', () => {
                assert.strictEqual(maybe().toString(), 'Nothing');
            });

            it('on nothing', () => {
                assert.strictEqual(nothing.toString(), 'Nothing');
            });
        });
    });

    describe('function*', () => {
        describe('should yield same value', () => {
            it('when not nothing', () => {
                return co(function* () {
                    return maybe(5);
                }).then(
                    val => assert.strictEqual(val, 5),
                    err => assert.ifError(err)
                );
            });
        });

        describe('should yield nothing', () => {
            it('when nothing', () => {
                return co(function* () {
                    return nothing;
                }).then(
                    val => assert.equal(val, nothing),
                    err => assert.ifError(err)
                );
            });

            it('when maybe nothing', () => {
                return co(function* () {
                    return maybe(nothing);
                }).then(
                    val => assert.equal(val, nothing),
                    err => assert.ifError(err)
                );
            });

            it('when maybe maybe nothing', () => {
                return co(function* () {
                    return maybe(maybe(nothing));
                }).then(
                    val => assert.equal(val, nothing),
                    err => assert.ifError(err)
                );
            });
        });
    });

    obeyTheLaw(Maybe, maybe);
    obeyZeroPlusLaws(Maybe, maybe);
});
