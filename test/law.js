'use strict';

const assert = require('assert');

module.exports = (Type, unit) => {
    describe('should obey', () => {
        it('left identity: return a >>= f ≡ f a', () => {
            const a = 5;
            const f = x => [x + 3];
            assert.deepEqual(unit(a).bind(f), f(a));
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

module.exports.zeroPlusLaws = (Type, unit) => {
    const mzero = Type.zero;

    describe('should obey zero and plus', () => {
        it ('mzero >>= f ≡ mzero', () => {
            const f = x => x + 3;
            assert.deepEqual(mzero.bind(f), mzero);
        });

        it ('m >>= (\\x -> mzero) ≡ mzero', () => {
            const m = unit(5);
            assert.deepEqual(m.bind(() => mzero), mzero);
        });

        it ('mzero `mplus` m ≡ m', () => {
            const m = unit(5);
            assert.deepEqual(mzero.plus(m), m);
        });

        it ('m `mplus` mzero ≡ m', () => {
            const m = unit(5);
            assert.deepEqual(m.plus(mzero), m);
        });

        it ('m `mplus` (n `mplus` o) ≡ (m `mplus` n) `mplus` o', () => {
            const m = unit(3);
            const n = unit(5);
            const o = unit(7);
            assert.deepEqual(m.plus(n.plus(o)), (m.plus(n)).plus(o));
        });
    });
}
