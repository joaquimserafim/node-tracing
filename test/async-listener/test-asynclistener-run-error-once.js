// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');
var net = require('net');
var tracing = require('../../index.js');

var errMsg = 'net - error: server connection';
var cntr = 0;
var al = tracing.addAsyncListener({
  error: function(ctx, stor, er) {
    cntr++;
    process._rawDebug('Handling error: ' + er.message);
    assert.equal(errMsg, er.message);
    return true;
  }
});

process.on('exit', function(status) {
  tracing.removeAsyncListener(al);

  console.log('exit status:', status);
  assert.equal(status, 0);
  console.log('cntr:', cntr);
  assert.equal(cntr, 1);
  console.log('ok');
});


var server = net.createServer(function(c) {
  this.close();
  throw new Error(errMsg);
});


server.listen(common.PORT, function() {
  net.connect(common.PORT, function() {
    this.destroy();
  });
});
