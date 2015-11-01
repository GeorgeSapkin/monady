'use strict'

const assert = require('assert');

const F = require('..');

describe('Nothing', () => {
    describe('call constructor', () => {
        it('should work', () => {
            assert.doesNotThrow(() => new F.Nothing(), TypeError);
        })
    });

    describe('read predefined constant', () => {
        it('should work', () => {
            assert.notEqual(F.nothing, null);
        })
    });

    describe('call then', () => {
        it('should fail', () => {
            assert.throws(() => F.nothing.then(a => a), TypeError);
        })
    });
});
