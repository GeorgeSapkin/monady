'use strict';

const assert = require('assert');

module.exports = (Type, unit) => {
    describe('should obey', () => {
        it('left identity: return a >>= f ≡ f a', () => {
            const a = 5;
            const f = x => x + 3;
            assert.strictEqual(unit(a).bind(f), f(a));
        });

        it('right identity: m >>= return ≡ m', () => {
            const m = unit(5);
            assert.equal(m.bind(unit).value, m.value);
        });

        it('associativity: (m >>= f) >>= g ≡ m >>= (\\x -> f x >>= g)', () => {
            const m = unit(5);
            const f = Type.lift(x => x + 3);
            const g = Type.lift(x => x + 1);

            const left  = m.bind(f).bind(g);
            const right = m.bind(Type.lift(a => f(a).bind(g)));
            assert.equal(left.value, right.value);
        });
    });
}
