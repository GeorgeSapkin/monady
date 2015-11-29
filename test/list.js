'use strict';

const assert = require('assert');
const co     = require('co');

const M = require('..');

const obeyTheLaw       = require('./law');
const obeyZeroPlusLaws = require('./law').zeroPlusLaws;

const List = M.List;
const list = M.list;

describe('List', () => {
    describe('constructor', () => {
        describe('should work', () => {
            it('with value', () => {
                assert.doesNotThrow(() => new List(5));
            });

            it('with multiple values', () => {
                assert.doesNotThrow(() => new List(5, 7, 11));
            });

            it('without value', () => {
                assert.doesNotThrow(() => new List());
            });
        });
    });

    describe('type constructor', () => {
        describe('should work', () => {
            it('with value', () => {
                assert.doesNotThrow(() => list(5));
            });

            it('with multiple values', () => {
                assert.doesNotThrow(() => list(5, 7, 11));
            });

            it('without value', () => {
                assert.doesNotThrow(() => list());
            });
        });
    });

    describe('iterator', () => {
        it('should return same value', () => {
            assert.deepEqual(list(5), [5]);
        });

        it('should return same values', () => {
            assert.deepEqual(list(5, 7, 11), [5, 7, 11]);
        });

        it('should return empty array', () => {
            assert.deepEqual(list(), []);
        });
    });

    describe('bind', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.deepEqual(list(5, 7, 11).bind(a => a + 3), [8, 10, 14]);
            });

            it('with lifted transform', () => {
                const result = list(5).bind(List.lift(x => x + 3));
                assert(result instanceof List);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => list(5).bind());
            });

            it('with bad transform', () => {
                assert.throws(() => list(5).bind(1));
            });
        });
    });

    describe('then', () => {
        it('should throw', () => {
            assert.throws(() => list().then());
        });
    });

    describe('map', () => {
        describe('should work', () => {
            it('with transform', () => {
                const result = list(5, 7).map(a => a + 3);
                assert(result instanceof List);
                assert.deepEqual(result, [8, 10]);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => list(5).map());
            });

            it('with bad transform', () => {
                assert.throws(() => list(5).map(1));
            });
        });
    });

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = List.lift(x => x + 3);
                const result = lifted(5);
                assert(result instanceof List);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => List.lift());
            });

            it('with bad transform', () => {
                assert.throws(() => List.lift(1));
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform and values', () => {
                const lifted = List.lift2((x, y) => x + y);
                const result = lifted(5, 3);
                assert(result instanceof List);
                assert.equal(result, 8);
            });

            it('with transform and identities', () => {
                const lifted = List.lift2((x, y) => x + y);
                const result = lifted(list(5), list(3));
                assert(result instanceof List);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => List.lift2());
            });

            it('with bad transform', () => {
                assert.throws(() => List.lift2(1));
            });
        });
    });

    describe('toString', () => {
        describe('should return value', () => {
            assert.strictEqual(list(5, 7).toString(), '5,7');
        });
    });

    describe('function*', () => {
        describe('should yield same value', () => {
            it('when not nothing', () => {
                return co(function* () {
                    return list(5, 7);
                }).then(
                    val => assert.deepEqual(val, [5, 7]),
                    err => assert.ifError(err)
                );
            });
        });
    });

    obeyTheLaw(List, list);
    obeyZeroPlusLaws(List, list);
});
