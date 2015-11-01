'use strict'

const assert = require('assert');

const F = require('..');

describe('RejectWhen', function(){
    describe('call constructor', () => {
        describe('with all arguments', () => {
            it('should work', () => {
                assert.doesNotThrow(
                    () => new F.RejectWhen(() => {}, () => {}, 5));
            });
        });

        describe('with no arguments', () => {
            it('should throw', () => {
                assert.throws(() => new F.RejectWhen());
            });
        });

        describe('with bad when', () => {
            it('should throw', () => {
                assert.throws(() => new F.RejectWhen(5));
            });
        });

        describe('with bad error', () => {
            it('should throw', () => {
                assert.throws(() => new F.RejectWhen(() => {}, 5));
            });
        });
    });

    describe('create through factory method', () => {
        describe('with all arguments', () => {
            it('should work', () => {
                assert.doesNotThrow(
                    () => F.rejectWhen(() => {}, () => {}, 5));
            });
        });

        describe('with no arguments', () => {
            it('should throw', () => {
                assert.throws(() => F.rejectWhen());
            });
        });

        describe('with bad when', () => {
            it('should throw', () => {
                assert.throws(() => F.rejectWhen(5));
            });
        });

        describe('with bad error', () => {
            it('should throw', () => {
                assert.throws(() => F.rejectWhen(() => {}, 5));
            });
        });
    });

    describe('call then', () => {
        function getRejectWhenNothing(val) {
            return F.rejectWhen(
                a => a === F.nothing,
                () => new Error(),
                val);
        }

        describe('when not nothing', () => {
            it('should transform and value is same', () => {
                assert.doesNotThrow(
                    () => getRejectWhenNothing(5).then(
                        val => assert.equal(val, 5),
                        err => assert.ifError(err)
                    ));
            });
        });

        describe('when Promise resolves to not nothing', () => {
            it('should transform and value is same', () => {
                return getRejectWhenNothing(Promise.resolve(5)).then(
                    val => assert.equal(val, 5),
                    err => assert.ifError(err)
                );
            });
        });

        describe('when nothing', () => {
            it('should reject', () => {
                assert.doesNotThrow(
                    () => getRejectWhenNothing(F.nothing).then(
                        val => assert(false),
                        err => assert(err instanceof Error)
                    ));
            });
        });

        describe('with no arguments', () => {
            it('should throw', () => {
                assert.throws(() => getRejectWhenNothing(5).then());
            });
        });

        describe('with bad transform', () => {
            it('should throw', () => {
                assert.throws(() => getRejectWhenNothing(5).then(1));
            });
        });

        describe('with bad reject', () => {
            it('should throw', () => {
                assert.throws(() => getRejectWhenNothing(5).then(
                    val => assert.equal(val, 5),
                    1));
            });
        });
    });
});
