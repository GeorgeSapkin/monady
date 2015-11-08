'use strict';

const assert = require('assert');
const co     = require('co');

const F = require('..');

const either     = F.either;
const identity   = F.identity;
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

    const rejectWhenNothing = rejectWhen.bind(null,
        val => val === nothing,
        ()  => new Error());

    const rejectWhenNothing2 = RejectWhen.lift(
        val => val === nothing,
        ()  => new Error(),
        maybe);

    const rejectWhenError = RejectWhen.lift2(
        val => val.value instanceof Error,
        err => err.value,
        either);

    describe('then', () => {
        describe('should work', () => {
            it('with transform', () => {
                const result = rejectWhenNothing(5).then(
                    val => val + 3,
                    err => assert.ifError(err));
                assert.equal(result, 8);
            });

            it('with maybe and transform', () => {
                const result = rejectWhenNothing(maybe(5)).then(
                    val => val + 3,
                    err => assert.ifError(err));
                assert.equal(result, 8);
            });

            it('with lifted', () => {
                const result = rejectWhenNothing(5).then(
                    RejectWhen.lift(() => {}, () => {}, x => x + 3),
                    err => assert.ifError(err));
                assert(result instanceof RejectWhen);
                assert.equal(result, 8);
            });

            it('when lifted with transform', () => {
                const result = rejectWhenNothing2(5).then(
                    val => val + 3,
                    err => assert.ifError(err));
                assert.equal(result, 8);
            });

            it('when lifted with either right', () => {
                const result = rejectWhenError(new Error(), 5).then(
                    val => val + 3,
                    err => assert.ifError(err));
                assert.equal(result, 8);
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

            it('when lifted with nothing', () => {
                assert.doesNotThrow(
                    () => rejectWhenNothing2(nothing).then(
                        () => assert(false),
                        err => assert(err instanceof Error)
                    ));
            });

            it('when lifted with null', () => {
                assert.doesNotThrow(
                    () => rejectWhenNothing2(null).then(
                        () => assert(false),
                        err => assert(err instanceof Error)
                    ));
            });

            it('when lifted with no args', () => {
                assert.doesNotThrow(
                    () => rejectWhenNothing2().then(
                        () => assert(false),
                        err => assert(err instanceof Error)
                    ));
            });

            it('when lifted with either left', () => {
                assert.doesNotThrow(
                    () => rejectWhenError(new Error()).then(
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

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = RejectWhen.lift(() => {}, () => {}, x => x + 3);
                const result = lifted(5);
                assert(result instanceof RejectWhen);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => RejectWhen.lift());
            });

            it('with bad when', () => {
                assert.throws(() => RejectWhen.lift(5));
            });

            it('with bad error', () => {
                assert.throws(() => RejectWhen.lift(() => {}, 5));
            });

            it('with bad transform', () => {
                assert.throws(() => RejectWhen.lift(() => {}, () => {}, 5));
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = RejectWhen.lift2(() => {}, () => {}, (x, y) => x + y);
                const result = lifted(identity(5), identity(3));
                assert(result instanceof RejectWhen);
                assert.equal(result, 8);
            });
        });

        describe('should throw', () => {
            it('with no arguments', () => {
                assert.throws(() => RejectWhen.lift2());
            });

            it('with bad when', () => {
                assert.throws(() => RejectWhen.lift2(5));
            });

            it('with bad error', () => {
                assert.throws(() => RejectWhen.lift2(() => {}, 5));
            });

            it('with bad transform', () => {
                assert.throws(() => RejectWhen.lift2(() => {}, () => {}, 5));
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
