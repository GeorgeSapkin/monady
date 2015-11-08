# monady

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

Composable monads for functional async flow.

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
const result = lifted(identity(5), identity(3));
assert(result instanceof Identity);
assert.equal(result, 8);
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

`Maybe` resolves to either `Just` or `Nothing` depending on whether a value is passed to the unit function. `Nothing` cannot be bound, lifted or mapped.

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

// nothing cannot be bound
assert.throws(() => nothing.then(a => a), TypeError);
```

#### `lift(x => )`
```js
const lifted = Just.lift(x => x + 3);
assert(lifted(5) instanceof Just);
assert.equal(lifted(5), 8);

assert(just(5).then(lifted) instanceof Just);
assert.equal(just(5).then(lifted), 8);

// nothing cannot be lifted
assert.throws(() => Nothing.lift(a => a), TypeError);
```

#### `lift2((x, y) => )`
```js
const lifted = Just.lift2((x, y) => x + y);
assert(lifted(just(5), just(3)) instanceof Just);
assert.equal(lifted(just(5), just(3)), 8);

// nothing cannot be lifted
assert.throws(() => Nothing.lift2((a, b) => a + b), TypeError);
```

#### `map(x => )`
```js
assert(just(5).map(a => a + 3) instanceof Just);
assert.equal(just(5).map(a => a + 3), 8);

// nothing cannot be mapped
assert.throws(() => nothing.map(a => a), TypeError);
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
    err => assert(err instanceof Error)
);
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

// Maybe is lifted into RejectWhen context
const rejectWhenNothing2 = RejectWhen.lift(
    val => val === nothing,
    () => new Error('value rejected'),
    maybe);

const result = rejectWhenNothing2(5).then(
    val => val + 3,
    err => assert.ifError(err));
assert.equal(result, 8);
```

#### `map(x => )`
```js
assert(rejectWhenNothing(5).map(val => val + 2) instanceof RejectWhen);
assert.equal(rejectWhenNothing(5).map(val => val + 2), 7);
```

## Examples

Example using generator functions and lifting.

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

Example using generator functions with [ramda](https://github.com/ramda/ramda) for compose and curry.

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
