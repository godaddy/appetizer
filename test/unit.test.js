'use strict';

const assume = require('assume');
const Appetizer = require('../');

describe('Appetizer', function () {
  let app;

  beforeEach(function () {
    app = new Appetizer({ key: 'api-key' });
  });

  describe('#url', function () {
    it('adds the API key in the URL', function () {
      app = new Appetizer({ key: 'yolo' });

      const url = app.url('foo');

      assume(url).equals('https://yolo@api.appetize.io/v1/foo');
    });

    it('it can change the version number if needed', function () {
      app = new Appetizer({ key: 'api-key', version: 'v2' });

      const url = app.url('bar');

      assume(url).equals('https://api-key@api.appetize.io/v2/bar');
    });

    it('returns a custom url if specified', function () {
      app = new Appetizer({ key: 'hi', endpoint: 'https://$key.google.com/$path' });

      const url = app.url('bar');

      assume(url).equals('https://hi.google.com/bar');
    });
  });

  describe('#type', function () {
    it('detects types', function () {
      assume(app.type([])).equals('array');
      assume(app.type({})).equals('object');
      assume(app.type('hi')).equals('string');
      assume(app.type(new Date())).equals('date');
    });
  });

  describe('#flat', function () {
    it('returns the same flat structure', function () {
      const flat = app.flatten({
        foo: 'bar',
        bar: 'hi'
      });

      assume(flat).deep.equals({ foo: 'bar', bar: 'hi' });
    });

    it('does not flatten file properties', function () {
      const fs = require('fs');
      const file = fs.createReadStream(__filename);

      const flat = app.flatten({
        foo: 'bar',
        bar: 'hi',
        file: file
      });

      assume(flat.file).equals(file);
    });

    it('transforms values to string', function () {
      const flat = app.flatten({
        foo: 100,
        bar: true
      });

      assume(flat).deep.equals({ foo: '100', bar: 'true' });
    });

    it('changes deep stucture to dot notated keys', function () {
      const flat = app.flatten({
        foo: 'bar',
        bar: 'hi',
        deep: {
          nested: 'key',
          value: 'okay'
        }
      });

      assume(flat).deep.equals({
        'foo': 'bar',
        'bar': 'hi',
        'deep.nested': 'key',
        'deep.value': 'okay'
      });
    });
  });
});
