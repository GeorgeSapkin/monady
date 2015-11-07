'use strict';

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Identity = F.Identity;
const identity = F.identity;

describe('Identity', () => {
    describe('constructor', () => {
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

    describe('then', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.equal(identity(5).then(a => a + 3), 8);
            });

            it('with lifted', () => {
                const result = identity(5).then(Identity.lift(x => x + 3));
                assert(result instanceof Identity);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => identity(5).then());
            });

            it('with bad transform', () => {
                assert.throws(() => identity(5).then(1));
            });
        });
    });

    describe('map', () => {
        describe('should work', () => {
            it('with transform', () => {
                const result = identity(5).map(a => a + 3);
                assert(result instanceof Identity);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => identity(5).map());
            });

            it('with bad transform', () => {
                assert.throws(() => identity(5).map(1));
            });
        });
    });

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Identity.lift(x => x + 3);
                const result = lifted(5);
                assert(result instanceof Identity);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Identity.lift());
            });

            it('with bad transform', () => {
                assert.throws(() => Identity.lift(1));
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Identity.lift2((x, y) => x + y);
                const result = lifted(identity(5), identity(3));
                assert(result instanceof Identity);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => Identity.lift2());
            });

            it('with bad transform', () => {
                assert.throws(() => Identity.lift2(1));
            });
        });
    });

    describe('toString', () => {
        describe('should return value', () => {
            assert.strictEqual(identity(5).toString(), '5');
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
