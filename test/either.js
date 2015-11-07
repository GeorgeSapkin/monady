'use strict';

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Either = F.Either;
const either = F.either;

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

    describe('create through factory method', () => {
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
            assert.equal(either(5).value, 5);
        });
        it('should return right', () => {
            assert.equal(either(5, 7).value, 7);
        });
    });

    describe('then', () => {
        describe('with transform', () => {
            it('should transform left', () => {
                assert.equal(either(5).then(a => a + 3), 8);
            });
            it('should transform right', () => {
                assert.equal(either(5, 7).then(a => a + 3), 10);
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
});
