'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _mastodonApi = require('mastodon-api');

var _mastodonApi2 = _interopRequireDefault(_mastodonApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var askParameter = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(rl, label) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var question;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            question = null;

            if (defaultValue != null) {
              question = label + ' [default=' + defaultValue + ']: ';
            } else {
              question = label + ': ';
            }
            return _context.abrupt('return', new _promise2.default(function (resolve) {
              rl.question(question, function (value) {
                var finalValue = value;
                if (value == null || value.trim() === '') {
                  finalValue = defaultValue;
                }
                resolve(finalValue);
              });
            }));

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function askParameter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getToken = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(rl, instanceUrl, clientName) {
    var scopes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'read write follow';
    var apiUrl, response, clientId, clientSecret, authUrl, code, accessToken;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            apiUrl = instanceUrl + '/api/v1/apps';
            _context2.next = 3;
            return _mastodonApi2.default.createOAuthApp(apiUrl, clientName, scopes);

          case 3:
            response = _context2.sent;

            console.log('OAuth data - ', response);

            clientId = response.client_id;
            clientSecret = response.client_secret;
            _context2.next = 9;
            return _mastodonApi2.default.getAuthorizationUrl(clientId, clientSecret, instanceUrl, scopes);

          case 9:
            authUrl = _context2.sent;

            console.log('This is the authorization URL. Open it in your browser and authorize with your account.');
            console.log(authUrl);

            _context2.next = 14;
            return askParameter(rl, 'Please enter the code from the website');

          case 14:
            code = _context2.sent;
            _context2.next = 17;
            return _mastodonApi2.default.getAccessToken(clientId, clientSecret, code, instanceUrl);

          case 17:
            accessToken = _context2.sent;

            console.log('Congratulations! This is the access token. Save it!');
            console.log(accessToken);

            return _context2.abrupt('return', accessToken);

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getToken(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var run = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var rl, instanceUrl, clientName, scopes, accessToken;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            rl = _readline2.default.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            _context3.next = 3;
            return askParameter(rl, 'Please type the instance url (e.g., https://mastodon.social)');

          case 3:
            instanceUrl = _context3.sent;
            _context3.next = 6;
            return askParameter(rl, 'Please type the requester name');

          case 6:
            clientName = _context3.sent;
            _context3.next = 9;
            return askParameter(rl, 'Please type a list of scopes', 'read write follow');

          case 9:
            scopes = _context3.sent;

            if (!(instanceUrl == null || instanceUrl.trim() === '')) {
              _context3.next = 12;
              break;
            }

            throw new Error('Instance url is mandatory');

          case 12:
            if (!(clientName == null || clientName.trim() === '')) {
              _context3.next = 14;
              break;
            }

            throw new Error('Requester name is mandatory');

          case 14:
            _context3.next = 16;
            return getToken(rl, instanceUrl, clientName, scopes || 'read write follow');

          case 16:
            accessToken = _context3.sent;


            rl.close();

            return _context3.abrupt('return', {
              accessToken: accessToken,
              instanceUrl: instanceUrl
            });

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function run() {
    return _ref3.apply(this, arguments);
  };
}();

run().then(function () {}).catch(function (e) {
  return console.log(e);
});
