'use strict';

const assert = require('assert');
const co     = require('co');
const R      = require('ramda');

const F = require('..');

const maybe      = F.maybe;
const nothing    = F.nothing;
const RejectWhen = F.RejectWhen;
const rejectWhen = F.rejectWhen;

describe('RejectWhen', () => {
    describe('constructor', () => {
        describe('should work', () => {
            it('with all arguments', () => {
                assert.doesNotThrow(
                    () => new RejectWhen(() => {}, () => {}, 5));
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => new RejectWhen());
            });

            it('with bad when', () => {
                assert.throws(() => new RejectWhen(5));
            });

            it('with bad error', () => {
                assert.throws(() => new RejectWhen(() => {}, 5));
            });
        });
    });

    describe('factory method', () => {
        describe('should work', () => {
            it('with all arguments', () => {
                assert.doesNotThrow(
                    () => rejectWhen(() => {}, () => {}, 5));
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => rejectWhen());
            });

            it('with bad when', () => {
                assert.throws(() => rejectWhen(5));
            });

            it('with bad error', () => {
                assert.throws(() => rejectWhen(() => {}, 5));
            });
        });
    });

    const rejectWhenNothing = R.curry(rejectWhen)(
        val => val === nothing,
        ()  => new Error('value rejected'));

    describe('then', () => {
        describe('should transform and value is same', () => {
            it('when not nothing', () => {
                assert.doesNotThrow(
                    () => rejectWhenNothing(5).then(
                        val => assert.equal(val, 5),
                        err => assert.ifError(err)
                    ));
            });

            it('when Promise resolves to not nothing', () => {
                return rejectWhenNothing(Promise.resolve(5)).then(
                    val => assert.equal(val, 5),
                    err => assert.ifError(err)
                );
            });
        });

        describe('should reject', () => {
            it('when nothing', () => {
                assert.doesNotThrow(
                    () => rejectWhenNothing(nothing).then(
                        () => assert(false),
                        err => assert(err instanceof Error)
                    ));
            });

            it('when maybe nothing', () => {
                assert.doesNotThrow(
                    () => rejectWhenNothing(maybe(nothing)).then(
                        () => assert(false),
                        err => assert(err instanceof Error)
                    ));
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => rejectWhenNothing(5).then());
            });

            it('with bad transform', () => {
                assert.throws(() => rejectWhenNothing(5).then(1));
            });

            it('with bad reject', () => {
                assert.throws(() => rejectWhenNothing(5).then(
                    val => assert.equal(val, 5),
                    1));
            });
        });
    });

    describe('map', () => {
        describe('should work', () => {
            it('when not nothing', () => {
                const result = rejectWhenNothing(5).map(val => val + 2);
                assert(result instanceof RejectWhen);
                assert.equal(result, 7);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => rejectWhenNothing(5).map());
            });

            it('with bad transform', () => {
                assert.throws(() => rejectWhenNothing(5).map(1));
            });
        });
    });

    describe('function*', () => {
        describe('should yield same value', () => {
            it('when not nothing', () => {
                return co(function* () {
                    return rejectWhenNothing(maybe(5));
                }).then(
                    val => assert.strictEqual(val, 5),
                    err => assert.ifError(err)
                );
            });

            it('when Promise resolves to not nothing', () => {
                return co(function* () {
                    return rejectWhenNothing(maybe(Promise.resolve(5)));
                }).then(
                    val => assert.strictEqual(val, 5),
                    err => assert.ifError(err)
                );
            });
        });

        describe('should reject', () => {
            it('when nothing', () => {
                return co(function* () {
                    return rejectWhenNothing(nothing);
                }).then(
                    () => assert(false),
                    err => assert(err instanceof Error)
                );
            });

            it('when maybe nothing', () => {
                return co(function* () {
                    return rejectWhenNothing(maybe(nothing));
                }).then(
                    () => assert(false),
                    err => assert(err instanceof Error)
                );
            });

            it('when Promise resolves to nothing', () => {
                return co(function* () {
                    return rejectWhenNothing(Promise.resolve(nothing));
                }).then(
                    () => assert(false),
                    err => assert(err instanceof Error)
                );
            });

            it('when Promise resolves to maybe nothing', () => {
                return co(function* () {
                    return rejectWhenNothing(Promise.resolve(maybe(nothing)));
                }).then(
                    () => assert(false),
                    err => assert(err instanceof Error)
                );
            });
        });
    });
});
