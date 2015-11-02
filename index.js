'use strict'

const assert = require('assert');

class MonadBase {
    constructor() {
        // ES6 alternative new.target
        assert.notStrictEqual(this.constructor, MonadBase,
            "Cannot construct MonadBase instances directly");

        assert(this.bind instanceof Function, "Must override bind method");
    }

    // emulate Promise API
    then() { return this.bind.apply(this, arguments); }
}

module.exports.MonadBase = MonadBase;

class Identity extends MonadBase {
    constructor(value) {
        assert(value != null);

        super();
        this._value = value;
    }

    get value() { return this._value; }

    bind(transform) {
        assert(transform instanceof Function);

        return transform(this.value);
    }

    toString() { return this.value; }
};

function identity(val) {
    return new Identity(val);
}

module.exports.Identity = Identity;
module.exports.identity = identity;

class Nothing {
    toString() { return this.constructor.name; }
};

const nothing = new Nothing();

module.exports.Nothing = Nothing;
module.exports.nothing = nothing;

class Just extends Identity {};

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
        return val.then(result => maybe(result), err => nothing);
    return new Maybe(val);
}

module.exports.Maybe = Maybe;
module.exports.maybe = maybe;

class Either extends MonadBase {
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
        assert(transform instanceof Function);

        if (this.right != null)
             return new Either(this.left, transform(this.right));
        return new Either(transform(this.left));
    }

    toString() { return this.value; }
};

function either(left, right) { return new Either(left, right); }

module.exports.Either = Either;
module.exports.either = either;

class RejectWhen extends Identity {
    constructor(when, error, value) {
        assert(when instanceof Function, "when must be a function");
        assert(error instanceof Function, "error must be a function");

        super(value);
        this.when  = when;
        this.error = error;
    }

    bind(transform, reject) {
        assert(transform instanceof Function, "transform must be a function");
        assert(reject instanceof Function, "reject must be a function");

        const value = this.value;
        const when  = this.when;
        const error = this.error;

        if (when(value))
            return reject(error(value));

        if (isPromise(value))
            return value.then(
                result => rejectWhen(when, error, result)
                    .bind(transform, reject));

        return map(transform, reject, value);
    }
};

function rejectWhen(when, error, value) {
    return new RejectWhen(when, error, value);
}

module.exports.RejectWhen = RejectWhen;
module.exports.rejectWhen = rejectWhen;

function map(transform, reject, obj) {
    assert(transform instanceof Function, "transform must be a function");
    assert(reject instanceof Function, "reject must be a function");

    if (obj.bind !== undefined)
        return obj.bind(transform, reject);
    if (obj.then !== undefined)
        return obj.then(transform, reject);
    return transform(obj);
}

const Continuation          = Promise;
Continuation.unit           = Continuation.resolve;
Continuation.prototype.bind = Continuation.prototype.then;

function continuation(val) { return Continuation.unit(val); }

module.exports.Continuation = Continuation;
module.exports.continuation = continuation;
