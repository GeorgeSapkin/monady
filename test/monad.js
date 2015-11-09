'use strict';

const assert = require('assert');

const M = require('..');

const Monad = M.Monad;

describe('Monad', () => {
    function getGoodMonad() {
        return new (class extends Monad {
            bind() {}
            map()  {}
        });
    }

    describe('abstruct constructor', () => {
        it('should throw', () => {
            assert.throws(() => new Monad());
        });
    });

    describe('derived constructor', () => {
        describe('on a bad implementation', () => {
            it('should throw', () => {
                assert.throws(() => new (class extends Monad {}));
            });
        });

        describe('on a correct implementation', () => {
            it('should work', () => {
                assert.doesNotThrow(getGoodMonad);
            });
        });
    });
});
