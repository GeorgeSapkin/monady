'use strict'

const assert = require('assert');

const F = require('..');

describe('MonadBase', function(){
    function getGoodMonad() {
        return new (class extends F.MonadBase {
            bind(transform) {
                return transform(5);
            }
        });
    }

    describe('call abstruct constructor', () => {
        it('should throw', () => {
            assert.throws(() => new F.MonadBase());
        });
    });

    describe('call derived constructor', () => {
        describe('with not implemented bind', () => {
            it('should throw', () => {
                assert.throws(() => new (class extends F.MonadBase {}));
            });
        });

        describe('on a correct implementation', () => {
            it('should work', () => {
                assert.doesNotThrow(getGoodMonad);
            });
        });
    });

    describe('call then on a correct implementation', () => {
        it('should work', () => {
            assert.equal(getGoodMonad().then(a => a + 3), 8);
        });
    });
});
