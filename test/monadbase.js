'use strict';

const assert = require('assert');

const F = require('..');

const MonadBase = F.MonadBase;

describe('MonadBase', () => {
    function getGoodMonad() {
        return new (class extends MonadBase {
            bind(transform) {
                return transform(5);
            }
        });
    }

    describe('abstruct constructor', () => {
        it('should throw', () => {
            assert.throws(() => new MonadBase());
        });
    });

    describe('derived constructor', () => {
        describe('with not implemented bind', () => {
            it('should throw', () => {
                assert.throws(() => new (class extends MonadBase {}));
            });
        });

        describe('on a correct implementation', () => {
            it('should work', () => {
                assert.doesNotThrow(getGoodMonad);
            });
        });
    });

    describe('then on a correct implementation', () => {
        it('should work', () => {
            assert.equal(getGoodMonad().then(a => a + 3), 8);
        });
    });
});
