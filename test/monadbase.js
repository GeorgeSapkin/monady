'use strict';

const assert = require('assert');

const F = require('..');

const MonadBase = F.MonadBase;

describe('MonadBase', () => {
    function getGoodMonad() {
        return new (class extends MonadBase {
            bind() {}
            map()  {}
        });
    }

    describe('abstruct constructor', () => {
        it('should throw', () => {
            assert.throws(() => new MonadBase());
        });
    });

    describe('derived constructor', () => {
        describe('on a bad implementation', () => {
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
});
