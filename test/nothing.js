'use strict';

const assert = require('assert');
const co     = require('co');

const M = require('..');

const Identity = M.Identity;
const identity = M.identity;
const Nothing  = M.Nothing;
const nothing  = M.nothing;

describe('Nothing', () => {
    describe('constructor', () => {
        it('should work', () => {
            assert.doesNotThrow(() => new Nothing(), TypeError);
        });
    });

    describe('predefined constant', () => {
        it('should work', () => {
            assert(nothing instanceof Nothing);
        });
    });

    describe('bind', () => {
        it('should work', () => {
            assert.strictEqual(nothing.bind(), nothing);
        });
    });

    describe('then', () => {
        it('should throw', () => {
            assert.throws(() => nothing.then(a => a), TypeError);
        });
    });

    describe('map', () => {
        describe('should work', () => {
            it('with transform', () => {
                assert.equal(nothing.map(a => a), nothing);
            });
        });
    });

    describe('lift', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Nothing.lift(x => x + 3);
                const result = lifted(5);
                assert(result instanceof Nothing);
                assert.equal(result, nothing);
            });
        });
    });

    describe('lift2', () => {
        describe('should work', () => {
            it('with transform', () => {
                const lifted = Nothing.lift2((x, y) => x + y);
                const result = lifted(5, 3);
                assert(result instanceof Nothing);
                assert.equal(result, nothing);
            });
        });
    });

    describe('toString', () => {
        describe('should work', () => {
            assert.strictEqual(nothing.toString(), 'Nothing');
        });
    });

    describe('function*', () => {
        describe('should yield nothing', () => {
            it('when nothing', () => {
                return co(function* () {
                    return nothing;
                }).then(
                    val => assert.equal(val, nothing),
                    err => assert.ifError(err)
                );
            });
        });
    });
});
