'use strict'

const fetchImpl = require('./lib/fetch').fetch

module.exports.fetch = function fetch (resource, init = undefined) {
  return fetchImpl(resource, init).catch((err) => {
    if (typeof err === 'object') {
      Error.captureStackTrace(err, this)
    }
    throw err
  })
}
module.exports.FormData = require('./lib/fetch/formdata').FormData
module.exports.Headers = require('./lib/fetch/headers').Headers
module.exports.Response = require('./lib/fetch/response').Response
module.exports.Request = require('./lib/fetch/request').Request

module.exports.WebSocket = require('./lib/websocket/websocket').WebSocket
module.exports.MessageEvent = require('./lib/websocket/events').MessageEvent

module.exports.EventSource = require('./lib/eventsource/eventsource').EventSource
