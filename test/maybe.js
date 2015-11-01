'use strict'

const assert = require('assert');

const F = require('..');

describe('Maybe', function(){
    describe('call constructor', () => {
        it('should work', () => {
            assert.doesNotThrow(() => new F.Maybe(), TypeError);
        })
    });

    describe('create through factory method', () => {
        describe('with value', () => {
            it('should return Just with same value', () => {
                const m = F.maybe(5);
                assert(m instanceof F.Just);
                assert.equal(m.value, 5);
            })
        });

        describe('with null', () => {
            it('should return Nothing', () => {
                const m = F.maybe(null);
                assert(m instanceof F.Nothing);
                assert.equal(m, F.nothing);
            })
        });

        describe('with no args', () => {
            it('should return Nothing', () => {
                const m = F.maybe();
                assert(m instanceof F.Nothing);
                assert.equal(m, F.nothing);
            })
        });

        describe('with resolved Promise', () => {
            it('should resolve to Just with same value', () => {
                F.maybe(Promise.resolve(5)).then(r => {
                    assert(r instanceof F.Just);
                    assert.equal(r.value, 5);
                });
            })
        });

        describe('with rejected Promise', () => {
            it('should resolve to Nothing', () => {
                F.maybe(Promise.reject(5)).then(r => {
                    assert(r instanceof F.Nothing);
                    assert.equal(r, F.nothing);
                });
            })
        });
    });
});
