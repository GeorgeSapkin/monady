'use strict';

const assert = require('assert');

class Monad {
    constructor(isThenable) {
        // ES6 alternative new.target
        assert.notStrictEqual(this.constructor, Monad,
            `Cannot construct ${this.constructor.name} instances directly`);

        assert(this.bind instanceof Function, 'Must implement bind method');

        // emulate Promise API
        if (isThenable == null)
            isThenable = true;

        if (isThenable) {
            // turn monad into a thenable
            const ctx = this;
            this.then = function() {
                return ctx.bind.apply(ctx, arguments);
            }
        }
    }

    map(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return this.bind(this.constructor.lift(transform));
    }

    static lift(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return value => new this(transform(value));
    }

    static lift2(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return (a, b) => new this(_bind(a, b, transform));
    }
}

module.exports.Monad = Monad;

// Identity
class Identity extends Monad {
    constructor(value) {
        assert(value != null, 'value must be set');

        super();
        this._value = value;
    }

    get value() { return this._value; }

    bind(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return transform(this.value);
    }

    toString() { return this.value.toString(); }
}

function identity(val) {
    return new Identity(val);
}

module.exports.Identity = Identity;
module.exports.identity = identity;

class Nothing extends Monad {
    constructor() {
        // Nothing is not thenable to break a promise chain
        super(false);
    }

    get value() { return this; }

    bind() { return this; }

    static lift() { return () => nothing; }

    static lift2() { return () => nothing; }

    toString() { return this.constructor.name; }
}

const nothing = new Nothing();

/**
 * Helper type constructor
 */
function _nothing() { return new Nothing(); }

module.exports.Nothing  = Nothing;
module.exports.nothing  = nothing;
module.exports._nothing = _nothing;

class Just extends Identity {}

function just(val) { return new Just(val); }

module.exports.Just = Just;
module.exports.just = just;

function isPromise(val) {
    return val != null
        && val.constructor.name === 'Promise'
        && val.then !== 'undefined';
}

class Maybe {
    constructor(val) {
        // catches both undefined and null
        return val != null && val !== nothing ? just(val) : nothing;
    }
}

function maybe(val) {
    if (isPromise(val))
        return val.then(result => maybe(result), () => nothing);
    return new Maybe(val);
}

module.exports.Maybe = Maybe;
module.exports.maybe = maybe;

class Either extends Monad {
    constructor(left, right) {
        assert(left != null);

        super();
        this.left  = left;
        this.right = right;
    }

    get value() {
        return this.right != null ? this.right : this.left;
    }

    bind(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        if (this.right != null)
             return transform(this.right);
        return transform(this.left);
    }

    toString() { return this.value.toString(); }
}

function either(left, right) { return new Either(left, right); }

module.exports.Either = Either;
module.exports.either = either;

class RejectWhen extends Identity {
    constructor(when, error, value) {
        assert(when instanceof Function, 'when must be a function');
        assert(error instanceof Function, 'error must be a function');

        super(value);
        this.when  = when;
        this.error = error;
    }

    bind(transform, reject) {
        assert(transform instanceof Function, 'transform must be a function');
        assert(reject instanceof Function, 'reject must be a function');

        const when  = this.when;
        const error = this.error;
        const value = this.value;

        if (when(value))
            return reject(error(value));

        if (isPromise(value))
            return value.then(
                result => rejectWhen(when, error, result)
                    .bind(transform, reject));

        if (value.then)
            return value.then(transform, reject);
        return transform(value);
    }

    map(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        const when  = this.when;
        const error = this.error;
        const value = this.value;

        return new this.constructor(when, error, transform(value));
    }

    static lift(when, error, transform) {
        assert(when instanceof Function, 'when must be a function');
        assert(error instanceof Function, 'error must be a function');
        assert(transform instanceof Function, 'transform must be a function');

        return value => new this(when, error, transform(value));
    }

    static lift2(when, error, transform) {
        assert(when instanceof Function, 'when must be a function');
        assert(error instanceof Function, 'error must be a function');
        assert(transform instanceof Function, 'transform must be a function');

        return (a, b) => new this(when, error, _bind(a, b, transform));
    }
}

function _bind(a, b, transform) {
    if (a && a.bind instanceof Function)
        return a.bind(value => _bind(value, b, transform)) ;

    if (b && b.bind instanceof Function)
        return b.bind(value => transform(a, value));

    return transform(a, b);
}

function rejectWhen(when, error, value) {
    return new RejectWhen(when, error, value);
}

module.exports.RejectWhen = RejectWhen;
module.exports.rejectWhen = rejectWhen;
