# Appetizer

A Node.js REST based API client for Appetize.io.

## Installation

The API client is released to the public npm registry and can be installed.

```
npm install --save appetizer
```

## Part of the Appetizer suite

This module is part of a larger suite of components that work excellent with each
other. If you liked this module we highly suggest checking out:

- [appetizer][api] A Node.js component for interacting with the Appetize.io API.
- [appetizer-bundle][bundle] Prepares and packs your React-Native application for uploading to Appetize.io.
- [appetizer-component][component] A React Component to embed your uploaded application.

[api]: https://github.com/godaddy/appetizer
[bundle]: https://github.com/godaddy/appetizer-bundle
[component]: https://github.com/godaddy/appetizer-component

## API

```js
const Appetizer = require('appetizer');
const app = new Appetizer({ opts });
```

The following *opts* are supported:

- `key` **required** The API key, which is required to use the library.
- `version` Version number of the API we're communicating with, defaults to `v1`
- `endpoint` Location of the API we're hitting.

Once you've created your own `appetizer` API instance you can use the following
methods:

- [create](#create)
- [update](#update)
- [remove](#remove)
- [list](#list)
- [more](#more)
- [usage](#usage)

#### create

Create a new application, you can either point to a pre-uploaded application so
the API can download it, or specify a `file` property in the data as
`ReadableStream` or Buffer and upload that with the API call.

```js
app.create({
  url: 'https://url.com/path/to/app.zip'
}, function (err, data) {
  if (err) {
    // Handle errors
  }

});
```

[See official API docs for accepted fields](https://appetize.io/docs#creating-apps)

#### update

Update an existing application with new details. First argument should be the
`public_id` of the application you want to update, second argument the data that
needs to be changed.

```js
app.update(public_id, { 
  url: 'https://url.com/path/to/app.zip',
  note: 'Hello'
}, function (err, data) {
  if (err) {
    // Handle errors
  }

});
```

[See official API docs for accepted fields](https://appetize.io/docs#updating-apps)

#### remove

Remove a uploaded application. First argument is the `public_id` of the
application you wish to remove.

```js
app.remove(public_id, function (err) {
  if (err) {
    // Handle errors
  }

});
```

#### list

List all uploaded applications.

```js
app.usage(function (err, data) {
  if (err) {
    // Handle errors
  }

});
```

See [more](#more) to list more applications.
[See official API docs for accepted fields](https://appetize.io/docs#updating-apps)

#### more

There can be more applications created than the [list](#list) API can return. In
that case the data will have a `hasMore` property set to `true` and a `nextKey`
property. If you want to retrieve more applications, pass the `nextKey` in to
the more API to retrieve the next batch of applications.

```js
app.more('adf8a09sdf8a098af', function (err) {
  if (err) {
    // Handle errors
  }

});
```

#### usage

Get usage statistics of applications.

```js
app.usage(function (err, data) {
  if (err) {
    // Handle errors
  }

});
```

## Testing

There are 2 sets of tests in this project. Normal unit tests that are ran using:

```
npm test
```

And a set of integration tests which requires you to have an API key to the
appetize.io service so we can verify that we've integrated the API's correctly.
These are run using:

```
API=your-api-key-here npm run integration
```

## License

[MIT](LICENSE)
