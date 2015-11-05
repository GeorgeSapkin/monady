'use strict';

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Just    = F.Just;
const Maybe   = F.Maybe;
const maybe   = F.maybe;
const Nothing = F.Nothing;
const nothing = F.nothing;

describe('Maybe', () => {
    describe('constructor', () => {
        it('should work', () => {
            assert.doesNotThrow(() => new Maybe(), TypeError);
        });
    });

    describe('factory method', () => {
        describe('should return Just', () => {
            it('with same value', () => {
                const m = maybe(5);
                assert(m instanceof Just);
                assert.equal(m.value, 5);
            });
        });

        describe('should return Nothing', () => {
            it('with nothing', () => {
                const m = maybe(nothing);
                assert(m instanceof Nothing);
                assert.equal(m, nothing);
            });

            it('with null', () => {
                const m = maybe(null);
                assert(m instanceof Nothing);
                assert.equal(m, nothing);
            });

            it('with no args', () => {
                const m = maybe();
                assert(m instanceof Nothing);
                assert.equal(m, nothing);
            });
        });

        describe('should resolve to same value', () => {
            it('with resolved Promise with value', () => {
                return maybe(Promise.resolve(5)).then(r => {
                    assert.equal(r, 5);
                });
            });
        });

        describe('should resolve to Nothing', () => {
            it('with resolved Promise with nothing', () => {
                return maybe(Promise.resolve(nothing)).then(r => {
                    assert(r instanceof Nothing);
                    assert.equal(r, nothing);
                });
            });

            it('with resolved Promise with null', () => {
                return maybe(Promise.resolve(null)).then(r => {
                    assert(r instanceof Nothing);
                    assert.equal(r, nothing);
                });
            });

            it('with resolved Promise with no args', () => {
                return maybe(Promise.resolve()).then(r => {
                    assert(r instanceof Nothing);
                    assert.equal(r, nothing);
                });
            });

            it('with resolved Promise with maybe nothing', () => {
                return maybe(Promise.resolve(maybe(nothing))).then(r => {
                    assert(r instanceof Nothing);
                    assert.equal(r, nothing);
                });
            });

            it('with rejected Promise', () => {
                return maybe(Promise.reject(5)).then(r => {
                    assert(r instanceof Nothing);
                    assert.equal(r, nothing);
                });
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
        });

        describe('should resolve to same value', () => {
            it('with resolved Promise with value', () => {
                return maybe(Promise.resolve(5)).then(r => {
                    assert.strictEqual(r.toString(), '5');
                });
            });
        });

        describe('should resolve to Nothing', () => {
            it('with resolved Promise with nothing', () => {
                return maybe(Promise.resolve(nothing)).then(r => {
                    assert.strictEqual(r.toString(), 'Nothing');
                });
            });

            it('with resolved Promise with null', () => {
                return maybe(Promise.resolve(null)).then(r => {
                    assert.strictEqual(r.toString(), 'Nothing');
                });
            });

            it('with resolved Promise with no args', () => {
                return maybe(Promise.resolve()).then(r => {
                    assert.strictEqual(r.toString(), 'Nothing');
                });
            });

            it('with resolved Promise with maybe nothing', () => {
                return maybe(Promise.resolve(maybe(nothing))).then(r => {
                    assert.strictEqual(r.toString(), 'Nothing');
                });
            });

            it('with rejected Promise', () => {
                return maybe(Promise.reject(5)).then(r => {
                    assert.strictEqual(r.toString(), 'Nothing');
                });
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
                    return maybe(nothing);
                }).then(
                    val => assert.equal(val, nothing),
                    err => assert.ifError(err)
                );
            });

            it('when maybe nothing', () => {
                return co(function* () {
                    return maybe(maybe(nothing));
                }).then(
                    val => assert.equal(val, nothing),
                    err => assert.ifError(err)
                );
            });
        });
    });
});
