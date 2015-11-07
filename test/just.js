'use strict';

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Just = F.Just;
const just = F.just;

describe('Just', () => {
    describe('constructor', () => {
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

    describe('factory method', () => {
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

    describe('then', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.equal(just(5).then(a => a + 3), 8);
            });

            it('with lifted', () => {
                const result = just(5).then(Just.lift(x => x + 3));
                assert(result instanceof Just);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => just(5).then());
            });

            it('with bad transform', () => {
                assert.throws(() => just(5).then(1));
            });
        });
    });

    describe('map', () => {
        describe('should work', () => {
            it('with transform', () => {
                const result = just(5).map(a => a + 3);
                assert(result instanceof Just);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => just(5).map());
            });

            it('with bad transform', () => {
                assert.throws(() => just(5).map(1));
            });
        });
    });

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Just.lift(x => x + 3);
                const result = lifted(5);
                assert(result instanceof Just);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Just.lift());
            });

            it('with bad transform', () => {
                assert.throws(() => Just.lift(1));
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Just.lift2((x, y) => x + y);
                const result = lifted(just(5), just(3));
                assert(result instanceof Just);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Just.lift2());
            });

            it('with bad transform', () => {
                assert.throws(() => Just.lift2(1));
            });
        });
    });

    describe('toString', () => {
        describe('should return value', () => {
            assert.strictEqual(just(5).toString(), '5');
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
