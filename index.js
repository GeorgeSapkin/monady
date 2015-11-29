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
            this.then = (...args) => this.bind(...args);
        }
    }
}

function lift(transform) {
    assert(transform instanceof Function, 'transform must be a function');

    return value => Object.freeze(new this(transform(value)));
}

function lift2(transform) {
    assert(transform instanceof Function, 'transform must be a function');

    return (a, b) => Object.freeze(new this(_bind(a, b, transform)));
}

function map(transform) {
    assert(transform instanceof Function, 'transform must be a function');

    return this.bind(this.constructor.lift(transform));
}

Monad.lift  = lift;
Monad.lift2 = lift2;

Monad.prototype.map = map;

module.exports.Monad = Monad;

class MonadPlus extends Monad {
    constructor(isThenable) {
        super(isThenable);

        assert.notStrictEqual(this.constructor, MonadPlus,
            `Cannot construct ${this.constructor.name} instances directly`);

        assert(this.plus instanceof Function, 'Must implement plus method');
    }
}

class Identity extends Monad {
    constructor(value) {
        assert(value != null, 'value must be set');

        super();
        this._value = value;
    }

    get value() { return this._value; }
    valueOf()   { return this.value; }

    bind(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return transform(this.value);
    }

    toString() { return this.value.toString(); }
}

function identity(val) {
    return Object.freeze(new Identity(val));
}

module.exports.Identity = Identity;
module.exports.identity = identity;

function isPromise(val) {
    return val != null
        && val.constructor.name === 'Promise'
        && val.then !== 'undefined';
}

class Maybe extends MonadPlus {
    constructor(val) {
        // catches both undefined and null
        const hasValue = val != null;
        super(hasValue);
        if (hasValue)
            this.val = val;
    }

    get value()     { return this.val; }
    get isJust()    { return this.value !== undefined; }
    get isNothing() { return !this.isJust; }
    valueOf()       { return this.value; }

    plus(maybe) {
        assert(maybe instanceof Maybe);

        return this.isJust ? this : maybe;
    }

    bind(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return this.isJust ? transform(this.value) : this;
    }

    toString() { return this.isJust ? this.value.toString() : 'Nothing'; }
}

// data constructor
function just(val) {
    return Object.freeze(new Maybe(val));
}

const nothing = Maybe.zero = Object.freeze(new Maybe());

module.exports.just    = just;
module.exports.nothing = nothing;

function maybe(val) {
    return val != null && val !== nothing ? just(val) : nothing;
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

    get value() { return this.right != null ? this.right : this.left; }
    valueOf()   { return this.value; }

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

class List extends Array {
    constructor(...args) {
        // one argument is a special case for Array
        if (args.length === 1) {
            super(1);
            this[0] = args[0];
        }
        else
            super(...args);
    }

    bind(transform) {
        assert(transform instanceof Function, 'transform must be a function');

        return new List(...[].concat(...super.map(transform)));
    }

    plus(...args) { return new List(...this.concat(...args)); }
}

List.zero  = Object.freeze(new List());
List.lift  = lift;
List.lift2 = lift2;

List.prototype.map = map;

function list(...args) {
    return Object.freeze(new List(...args));
}

module.exports.List = List;
module.exports.list = list;

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

        return Object.freeze(
            new this.constructor(when, error, transform(value)));
    }

    static lift(when, error, transform) {
        assert(when instanceof Function, 'when must be a function');
        assert(error instanceof Function, 'error must be a function');
        assert(transform instanceof Function, 'transform must be a function');

        return value => Object.freeze(
            new this(when, error, transform(value)));
    }

    static lift2(when, error, transform) {
        assert(when instanceof Function, 'when must be a function');
        assert(error instanceof Function, 'error must be a function');
        assert(transform instanceof Function, 'transform must be a function');

        return (a, b) => Object.freeze(
            new this(when, error, _bind(a, b, transform)));
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
    return Object.freeze(new RejectWhen(when, error, value));
}

module.exports.RejectWhen = RejectWhen;
module.exports.rejectWhen = rejectWhen;
