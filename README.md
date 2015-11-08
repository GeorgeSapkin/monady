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

#### `identity(x)`

`Identity` always has a value.

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
assert(lifted(identity(5), identity(3)) instanceof Identity);
assert.equal(lifted(identity(5), identity(3)), 8);
```

#### `map(x => )`
```js
assert(identity(5).map(a => a + 3) instanceof Identity);
assert.equal(identity(5).map(a => a + 3), 8);
```

### Maybe, Just and Nothing

#### `maybe(x)`
#### `just(x)`
#### `nothing`

`Maybe` resolves to either `Just` or `Nothing` depending on whether a value is passed to the unit function. `Nothing` is not thenable but can be bound, lifted or mapped.

```js
assert(maybe(5) instanceof Just);
assert.equal(maybe(5), 5);
assert.equal(just(5), 5);

assert(maybe(nothing) instanceof Nothing);
assert.equal(maybe(nothing), nothing);

assert(maybe(null) instanceof Nothing);
assert.equal(maybe(null), nothing);

assert(maybe() instanceof Nothing);
assert.equal(maybe(), nothing);
```

#### `bind(x => )` or `then(x => )`
```js
assert.equal(just(5).then(a => a + 3), 8);

assert.strictEqual(nothing.bind(), nothing);

// nothing is not thenable
assert.throws(() => nothing.then(a => a), TypeError);
```

#### `lift(x => )`
```js
const lifted1 = Just.lift(x => x + 3);
assert(lifted1(5) instanceof Just);
assert.equal(lifted1(5), 8);

assert(just(5).then(lifted1) instanceof Just);
assert.equal(just(5).then(lifted1), 8);

const lifted2 = Nothing.lift(x => x + 3);
assert(lifted2(5) instanceof Nothing);
assert.equal(lifted2(5), nothing);

assert(just(5).then(lifted2) instanceof Nothing);
assert.equal(just(5).then(lifted2), nothing);
```

#### `lift2((x, y) => )`
```js
const lifted1 = Just.lift2((x, y) => x + y);
assert(lifted1(just(5), just(3)) instanceof Just);
assert.equal(lifted1(just(5), just(3)), 8);

const lifted2 = Nothing.lift2((x, y) => x + y);
assert(lifted2(identity(5), identity(3)) instanceof Nothing);
assert.equal(lifted2(identity(5), identity(3)), nothing);
```

#### `map(x => )`
```js
assert(just(5).map(a => a + 3) instanceof Just);
assert.equal(just(5).map(a => a + 3), 8);

assert.equal(nothing.map(a => a), nothing);
```

### Either

#### `either(left, right)`

`Either` returns either `left` (default) or `right`, if it is set.

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
assert( lifted(either(5), either(3)) instanceof Either);
assert.equal( lifted(either(5), either(3)), 8);

assert(lifted(either(5, 7), either(3, 5)) instanceof Either);
assert.equal(lifted(either(5, 7), either(3, 5)), 12);
```

#### `map(x => )`
```js
assert(either(5).map(a => a + 3) instanceof Either);
assert.equal(either(5).map(a => a + 3), 8);

assert(either(5, 7).map(a => a + 3) instanceof Either);
assert.equal(either(5, 7).map(a => a + 3), 10);
```

### RejectWhen

#### `rejectWhen(when, error, value)`

`RejectWhen` rejects a value on `bind` (or `then`) with `error` when condition `when` is met.

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
assert(lifted(identity(5), identity(3)) instanceof RejectWhen);
assert.equal(lifted(identity(5), identity(3)), 8);
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
