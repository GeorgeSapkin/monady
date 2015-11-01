# monady

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

Composable monads for functional async flow

## Examples

Example using generator functions with koajs/koa and ramda/ramda for compose
and curry:

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

    // If user is not found maybe will return nothing and be rejected by
    // rejectWhenNothing so code after yield will not run. Hence no check if
    // user exists is needed.

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
