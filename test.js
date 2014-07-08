var tape = require('tape')
var concat = require('concat-stream')
var http = require('http')
var docker = require('./')

var server = http.createServer(function(req, res) {
  if (req.method === 'POST') return req.pipe(res)

  if (req.url === '/error') {
    res.statusCode = 500
    res.end('error message')
    return
  }

  res.end(JSON.stringify({
    method: req.method,
    path: req.url
  }))
})

server.listen(0, function() {
  server.unref()

  tape('get json', function(t) {
    var request = docker(server.address().port)

    request.get('/', {json:true, qs:{foo:'bar'}}, function(err, body) {
      t.ok(!err)
      t.same(body.method, 'GET')
      t.same(body.path, '/?foo=bar')
      t.end()
    })
  })

  tape('get stream', function(t) {
    var request = docker(server.address().port)

    request.get('/', function(err, response) {
      t.ok(!err)
      response.pipe(concat(function(buf) {
        t.same(buf.toString(), '{"method":"GET","path":"/"}')
        t.end()
      }))
    })
  })

  tape('post stream', function(t) {
    var request = docker(server.address().port)

    var post = request.post('/', function(err, response) {
      t.ok(!err)
      response.pipe(concat(function(buf) {
        t.same(buf.toString(), 'hello world')
        t.end()
      }))
    })

    post.write('hello')
    post.end(' world')
  })

  tape('post json', function(t) {
    var request = docker(server.address().port)

    request.post('/', {json:{method:'GET', path:'/'}}, function(err, body) {
      t.ok(!err)
      t.same(body.method, 'GET')
      t.same(body.path, '/')
      t.end()
    })
  })

  tape('get error', function(t) {
    var request = docker(server.address().port)

    request.get('/error', function(err) {
      t.ok(err)
      t.same(err.message, 'error message')
      t.end()
    })
  })
})
