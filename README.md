# monady

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

Composable monads for functional async flow.

## Name

It's like Monday, but misspelled :) Also, apparently, it's Polish for [monads](https://pl.wikipedia.org/wiki/Monada_(programowanie)).

## Installation

```
$ npm install monady
```

## Monads

### Identity

`Identity` always has a value.

#### `identity(x)` type constructor
```js
assert.equal(identity(5), 5);
assert.throws(() => identity());
assert.throws(() => identity(null));
```

#### `bind(x => )` or `then(x => )`
```js
assert.equal(identity(5).then(a => a + 3), 8);
```

#### `lift(x => )`
```js
const lifted = Identity.lift(x => x + 3);
assert(lifted(5) instanceof Identity);
assert.equal(lifted(5), 8);

assert(identity(5).then(lifted) instanceof Identity);
assert.equal(identity(5).then(lifted), 8);
```

#### `lift2((x, y) => )`
```js
const lifted = Identity.lift2((x, y) => x + y);
assert(lifted(5, 3) instanceof Identity);
assert.equal(lifted(5, 3), 8);
```

#### `map(x => )`
```js
assert(identity(5).map(a => a + 3) instanceof Identity);
assert.equal(identity(5).map(a => a + 3), 8);
```

### Maybe, Just and Nothing

`maybe` resolves to either `just` or `nothing` depending on whether a value is passed to the type constructor. `nothing` is not thenable.

#### `maybe(x)` type constructor
#### `just(x)`
#### `nothing`
```js
assert(maybe(5).isJust);
assert.equal(maybe(5), 5);
assert.equal(just(5), 5);

assert(maybe(nothing).isNothing);
assert.equal(maybe(nothing), nothing);

assert(maybe(null).isNothing);
assert.equal(maybe(null), nothing);

assert(maybe().isNothing);
assert.equal(maybe(), nothing);
```

#### `bind(x => )` or `then(x => )`
```js
assert.equal(just(5).then(a => a + 3), 8);

assert.strictEqual(nothing.bind(a => a + 3), nothing);

// nothing is not thenable
assert.throws(() => nothing.then(a => a), TypeError);
```

#### `lift(x => )`
```js
const lifted1 = Maybe.lift(x => x + 3);
assert(lifted1(5).isJust);
assert.equal(lifted1(5), 8);

assert(just(5).then(lifted1).isJust);
assert.equal(just(5).then(lifted1), 8);
```

#### `lift2((x, y) => )`
```js
const lifted1 = Maybe.lift2((x, y) => x + y);
assert(lifted1(5, 3).isJust);
assert.equal(lifted1(5, 3), 8);
```

#### `map(x => )`
```js
assert(just(5).map(a => a + 3).isJust);
assert.equal(just(5).map(a => a + 3), 8);

assert.equal(nothing.map(a => a), nothing);
```

### Either

`Either` returns either `left` (default) or `right`, if it is set.

#### `either(left, right)` type constructor
```js
assert.equal(either(5), 5);
assert.equal(either(5, 7), 7);
assert.throws(() => either());
```

#### `bind(x => )` or `then(x => )`
```js
assert.equal(either(5).then(a => a + 3), 8);
assert.equal(either(5, 7).then(a => a + 3), 10);
```

#### `lift(x => )`
```js
const lifted = Either.lift(x => x + 3);
assert(lifted(5) instanceof Either);
assert.equal(lifted(5), 8);

assert(either(5).then(lifted) instanceof Either);
assert.equal(either(5).then(lifted), 8);

assert(either(5, 7).then(lifted) instanceof Either);
assert.equal(either(5, 7).then(lifted), 10);
```

#### `lift2((x, y) => )`
```js
const lifted = Either.lift2((x, y) => x + y);
assert(lifted(5, 3) instanceof Either);
assert.equal(lifted(5, 3), 8);
```

#### `map(x => )`
```js
assert(either(5).map(a => a + 3) instanceof Either);
assert.equal(either(5).map(a => a + 3), 8);

assert(either(5, 7).map(a => a + 3) instanceof Either);
assert.equal(either(5, 7).map(a => a + 3), 10);
```

### List

`List` represents computations which may return 0, 1, or more possible results. `List` is not thenable.

#### `list(...args)` type constructor
```js
assert.deepEqual(list(5), [5]);
assert.deepEqual(list(5, 7, 11), [5, 7, 11]);
assert.deepEqual(list(), []);
```

#### `bind(x => )`
```js
assert.deepEqual(list(5, 7, 11).bind(a => a + 3), [8, 10, 14]);
```

#### `lift(x => )`
```js
const lifted = List.lift(x => x + 3);
assert(lifted(5) instanceof List);
assert.equal(lifted(5), 8);

assert(list(5).then(lifted) instanceof List);
assert.equal(list(5).then(lifted), 8);
```

#### `lift2((x, y) => )`
```js
const lifted = List.lift2((x, y) => x + y);
assert(lifted(5, 3) instanceof List);
assert.equal(lifted(5, 3), 8);
```

#### `map(x => )`
```js
assert(list(5, 7).map(a => a + 3) instanceof List);
assert.deepEqual(list(5, 7).map(a => a + 3), [8, 10]);
```

### RejectWhen

`RejectWhen` rejects a value on `bind` (or `then`) with `error` when condition `when` is met.

#### `rejectWhen(when, error, value)` type constructor

#### `bind(x => )` or `then(x => )`
```js
const rejectWhenNothing = rejectWhen.bind(null,
    val => val === nothing,
    ()  => new Error('value rejected'));

// resolves value
const result1 = rejectWhenNothing(5).then(
    val => val + 3,
    err => assert.ifError(err));
assert.equal(result1, 8);

// resolve maybe value
const result2 = rejectWhenNothing(maybe(5)).then(
    val => val + 3,
    err => assert.ifError(err));
assert.equal(result2, 8);

// rejects nothing
rejectWhenNothing(nothing).then(
    () => assert(false),
    err => assert(err instanceof Error)
);

// rejects maybe nothing
rejectWhenNothing(maybe(nothing)).then(
    () => assert(false),
    err => assert(err instanceof Error));
```

#### `lift(x => )`
```js
const lifted = RejectWhen.lift(() => {}, () => {}, x => x + 3);
assert(lifted(5) instanceof RejectWhen);
assert.equal(lifted(5), 8);
```

#### `lift2((x, y) => )`
```js
const lifted = RejectWhen.lift2(() => {}, () => {}, (x, y) => x + y);
assert(lifted(5, 3) instanceof RejectWhen);
assert.equal(lifted(5, 3), 8);
```

#### `map(x => )`
```js
assert(rejectWhenNothing(5).map(val => val + 2) instanceof RejectWhen);
assert.equal(rejectWhenNothing(5).map(val => val + 2), 7);
```

## Examples

Rejecting value when it is `Nothing` using `RejectWhen` and `maybe`.

```js
const rejectWhenNothing = RejectWhen.lift(
    val => val === nothing,
    () => new Error('value rejected'),
    maybe);

const result = rejectWhenNothing(5).then(
    val => val + 3,
    err => assert.ifError(err));
assert.equal(result, 8);

rejectWhenNothing(null /* or nothing or not specified */).then(
    () => assert(false),
    err => assert(err instanceof Error));
```

Rejecting value when it is not set using `RejectWhen` and `either`.

```js
const rejectWhenError = RejectWhen.lift2(
    val => val.value instanceof Error,
    err => err.value,
    either);

const result = rejectWhenError(new Error(), 5).then(
    val => val + 3,
    err => assert.ifError(err));
assert.equal(result, 8);

rejectWhenError(new Error()).then(
    () => assert(false),
    err => assert(err instanceof Error));
```

Using generator functions and lifting to avoid explicit null checks.

```js
function* (next) {
    const req = this.request;

    // Lift Maybe into RejectWhen context
    const rejectWhenNothing = RejectWhen.lift(
        val => val === nothing,
        () => new Error('value rejected'),
        maybe);

    const user = yield rejectWhenNothing(userProvider.findOne({
        name: req.body.username
    });

    // If user is not found Maybe will return nothing and be rejected by
    // RejectWhen so code after yield will not run. Hence no check if user
    // exists is needed.

    // Do something with user
}
```

Using generator functions with [ramda](https://github.com/ramda/ramda) for compose and curry to avoid explicit null checks.

```js
function* (next) {
    const req = this.request;

    const rejectWhenNothing = R.curry(rejectWhen)(
        val => val === nothing,
        () => new Error('value rejected'));

    // maybe wraps Promise from findOne and is in turn wrapped in
    // rejectWhenNothing.
    const getUser = R.compose(
        rejectWhenNothing,
        maybe,
        (a) => userProvider.findOne(a));

    const user = yield getUser({ name: req.body.username });

    // If user is not found Maybe will return nothing and be rejected by
    // RejectWhen so code after yield will not run. Hence no check if user
    // exists is needed.

    // Do something with user
}
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/monady.svg?style=flat-square
[npm-url]: https://npmjs.org/package/monady
[travis-image]: https://img.shields.io/travis/GeorgeSapkin/monady.svg?style=flat-square
[travis-url]: https://travis-ci.org/GeorgeSapkin/monady
[coveralls-image]: https://img.shields.io/coveralls/GeorgeSapkin/monady.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/GeorgeSapkin/monady
[downloads-image]: http://img.shields.io/npm/dm/monady.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/monady
