# monady

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
