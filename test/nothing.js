'use strict'

const assert = require('assert');
const co     = require('co');

const F = require('..');

const Nothing = F.Nothing;
const nothing = F.nothing;

describe('Nothing', () => {
    describe('call constructor', () => {
        it('should work', () => {
            assert.doesNotThrow(() => new Nothing(), TypeError);
        })
    });

    describe('read predefined constant', () => {
        it('should work', () => {
            assert.notEqual(nothing, null);
        })
    });

    describe('call then', () => {
        it('should fail', () => {
            assert.throws(() => nothing.then(a => a), TypeError);
        })
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
