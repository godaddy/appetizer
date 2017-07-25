'use strict';

const debug = require('diagnostics')('appetizer');
const request = require('request');

/**
 * API client for Appetize.io
 *
 * @constructor
 * @param {Object} options API configuration.
 * @public
 */
class Appetizer {
  constructor(options = {}) {
    this.endpoint = options.endpoint || 'https://$key@api.appetize.io/$version/$path';
    this.version = options.version || 'v1';

    this.key = options.key;
  }

  /**
   * Figure out the type of things.
   *
   * @param {Mixed} what Thing we want the type of.
   * @returns {String} Internal type.
   * @private
   */
  type(what) {
    return Object.prototype.toString.call(what).slice(8, -1).toLowerCase();
  }

  /**
   * Flatten an object to a dot notation keys as required for multi/part
   * uploads. JSON is only one level deep, so we don't need to apply this
   * recursively.
   *
   * @param {Object} obj The JSON structure that needs to be flat.
   * @returns {Object} New object.
   * @private
   */
  flatten(obj) {
    return Object.keys(obj).reduce((memo, key) => {
      if (this.type(obj[key]) !== 'object' || key === 'file') {
        let value = obj[key];

        if (typeof value !== 'object') value = value.toString();

        memo[key] = value;
        return memo;
      }

      Object.keys(obj[key]).forEach((name) => {
        let value = obj[key][name];

        if (typeof value !== 'object') value = value.toString();

        memo[key + '.' + name] = value;
      });

      return memo;
    }, {});
  }

  /**
   * Compile a appetize.io compatible URL.
   *
   * @param {String} pathname Path.
   * @returns {String} Full URL to the appetize API.
   * @private
   */
  url(pathname) {
    return this.endpoint
      .replace('$path', pathname)
      .replace('$version', this.version)
      .replace('$key', this.key);
  }

  /**
   * Send an API request to the server.
   *
   * @param {Object} opts HTTP request options.
   * @param {Object} payload JSON payload.
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Selfie.
   * @private
   */
  send(opts = {}, payload = {}, fn) {
    opts = Object.assign({ json: true }, opts);

    //
    // So there's a difference when uploading/updating/creating apps. You can
    // point to a file or you can upload it with the API call. If we're
    // uploading it we need to change the response type and also how JSON is
    // processed.
    //
    const file = payload && 'file' in payload && !('url' in payload);

    if (file) {
      debug('detected direct upload, flatting payload');
      opts.formData = this.flatten(payload);
      payload = null;
    }

    /**
     * Process the API response.
     *
     * @param {Error} err Optional error.
     * @param {Response} res Response headers etc..
     * @param {Object} body API response.
     * @returns {Undefined} Void 0.
     * @private
     */
    function process(err, res, body) {
      if (err) return fn(err);

      fn(err, body);
    }

    opts.url = this.url(opts.pathname);
    delete opts.pathname;

    debug('requesting', opts);

    if (file || !payload) request(opts, process);
    else request(opts, payload, process);

    return this;
  }

  /**
   * Create a new application.
   *
   * @param {Object} data Data to upload.
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Chaining.
   * @public
   */
  create(data = {}, fn) {
    return this.send({
      method: 'POST',
      pathname: 'apps'
    }, data, fn);
  }

  /**
   * Update an application.
   *
   * @param {String} id id of the application we need to update.
   * @param {Object} data New application details.
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Chaining.
   * @public
   */
  update(id, data = {}, fn) {
    return this.send({
      method: 'POST',
      pathname: `apps/${id}`
    }, data, fn);
  }

  /**
   * Remove an application.
   *
   * @param {String} id id of the application we need to update.
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Chaining.
   * @public
   */
  remove(id, fn) {
    return this.send({
      method: 'DELETE',
      pathname: `apps/${id}`
    }, null, fn);
  }

  /**
   * List all created applications.
   *
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Chaining.
   * @public
   */
  list(fn) {
    return this.send({
      method: 'GET',
      pathname: 'apps'
    }, null, fn);
  }

  /**
   * Same as list, but for more apps.
   *
   * @param {String} nextKey Next Key for more apps.
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Chaining.
   * @public
   */
  more(nextKey, fn) {
    return this.send({
      method: 'GET',
      pathname: 'apps?' + nextKey
    }, null, fn);
  }

  /**
   * Usage statistics.
   *
   * @param {Function} fn Completion callback.
   * @returns {Appertize} Chaining.
   * @public
   */
  usage(fn) {
    return this.send({
      method: 'GET',
      pathname: 'usageSummary'
    }, null, fn);
  }
}

//
// Expose the module.
//
module.exports = Appetizer;
