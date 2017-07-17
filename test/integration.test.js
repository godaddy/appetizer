'use strict';

const assume = require('assume');
const Appetizer = require('../');

describe('Appetizer', function () {
  let app;

  beforeEach(function () {
    app = new Appetizer({ key: process.env.API });
  });

  describe('#list', function () {
    it('lists applications', function (next) {
      app.list(function (err, data) {
        if (err) return next(err);

        assume(data).is.a('object');
        assume(data.hasMore).is.a('boolean');
        assume(data.data).is.a('array');

        next();
      });
    });
  });

  describe('#usage', function () {
    it('lists the usage of the account', function (next) {
      app.usage(function (err, data) {
        if (err) return next(err);

        assume(data).is.a('object');
        assume(data.hasMore).is.a('boolean');
        assume(data.data).is.a('array');

        next();
      });
    });
  });
});
