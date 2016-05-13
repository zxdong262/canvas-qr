# canvas-qr

[![Build Status](https://travis-ci.org/zxdong262/canvas-qr.svg?branch=master)](https://travis-ci.org/zxdong262/canvas-qr)

qrcode creator based on [node-canvas](https://www.npmjs.com/package/canvas) and [qr-js](https://www.npmjs.com/packages/qr-js)

## important: install Cairo first

install Cairo first, For system-specific installation view the  <a href="https://github.com/LearnBoost/node-canvas/wiki/_pages" target="_blank">Wiki</a> from [node-canvas](https://www.npmjs.org/package/canvas)

## features

- return canvas object, use buffer or stream is your choice
- 5 layers at most: base background, background color, background image, qrcode, logo image

## install

```bash
npm i canvas-qr
```

## use

```javascript

var 
assert = require('assert')
,cq = require('canvas-qr')
,qr = cq.qr
,fs = require('fs')
,toPromiseFunc = function(thunk) {
    return function() {

        //arguments to array
        var $_len = arguments.length
        var args = new Array($_len)
        for(var $_i = 0; $_i < $_len; ++$_i) {
            args[$_i] = arguments[$_i]
        }

        var ctx = this
        return new Promise(function(resolve, reject) {
            args.push(function(err, val){
                if(err) reject(err)
                else resolve(val)
            })
            thunk.apply(ctx, args)
        })
    }
}
,readFile = toPromiseFunc(fs.readFile)
,co = require('co')
,Canvas = cq.Canvas
,Image = Canvas.Image

function* t1() {

    var bgImageFile = yield readFile('test/bg.jpg')
    var bgImage = new Image()
    var logoImageFile = yield readFile('test/q-logo.png')
    var logoImage = new Image()

    var cvs

    bgImage.src = bgImageFile
    logoImage.src = logoImageFile

    cvs = qr({
        baseColor: '#fff' //canvas base color, all other images draw on this base
        ,backgroundImage: bgImage //canvas Image Object as background
        ,backgroundColor: null //background color String, such as 'rgba(255,255,255,.6)' or '#fff'
        ,size: 200 //image size, pix
        ,border: 0.04 // border widrth = size * border
        ,str: 'hello world' //string to encode to qr, must have this, all other params is optional
        ,forgroundColor: '#000' //forgroundColor String
        ,logoImage: logoImage //canvas Image Object as logo
        ,logoWidth: 40
        ,logoHeight: 40
        ,ecc: 'M' //ecc level, [ 'L', 'M', 'Q', 'H' ]
    })

    return new Promise(function(resolve, reject) {
        cvs.toBuffer(function(err, buf) {
            if(err) reject(err)
            else resolve buf
        })
    })

}

//for koa, use stream
app.get('/qr-image', function* (next) {

    var bgImageFile = yield readFile('test/bg.jpg')
    var bgImage = new Image()
    var logoImageFile = yield readFile('test/q-logo.png')
    var logoImage = new Image()

    bgImage.src = bgImageFile
    logoImage.src = logoImageFile

    var stream = qr({
        baseColor: '#fff' //canvas base color, all other images draw on this base
        ,backgroundImage: bgImage //canvas Image Object as background
        ,backgroundColor: null //background color String
        ,size: 200 //image size
        ,border: 0.04 // border widrth = size * border
        ,str: 'haha' //string to encode to qr
        ,forgroundColor: '#000' //forgroundColor
        ,logoImage: logoImage
        ,logoWidth: 40
        ,logoHeight: 40
        ,ecc: 'M'
    }).pngStream

    this.body = stream

})


//for express, use pngData
app.get('/qr-image', function* (req, res) {

    co(t1())
    .then(function(buf) {
        res.end(buf)
    })

})

```

## changelog
- 0.2.0 use canvas 1.3.15
- 0.1.3 use canvas 1.2.9 compatible with node v4
- 0.1.1 change licence to MIT, fix readme dependency
- 0.0.4 set default ecc level = 'M'
- 0.0.3 just change readme, nothing else

## LICENSE

MIT
