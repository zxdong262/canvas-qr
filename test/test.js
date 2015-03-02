
var 
assert = require('assert')
,qr = require('..').qr
,fs = require('fs')
,_ = require('lodash')
,util = require('util')
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
,Canvas = require('canvas')
,Image = Canvas.Image

function* t1() {

	return qr({
		baseColor: '#fff' //canvas base color, all other images draw on this base
		//,backgroundImage: bgImage //canvas Image Object as background
		,backgroundColor: null //background color String
		,size: 200 //image size
		,border: 0.04 // border widrth = size * border
		,str: 'haha' //string to encode to qr
		,forgroundColor: '#000' //forgroundColor
		//,logoImage: logoImage
		,logoWidth: 40
		,logoHeight: 40
		,ecc: 'L'
	})

}

function* t2() {

	var bgImageFile = yield readFile('test/bg.jpg')

	var bgImage = new Image()

	bgImage.src = bgImageFile
	
	return qr({
		baseColor: '#fff' //canvas base color, all other images draw on this base
		,backgroundImage: bgImage //canvas Image Object as background
		,backgroundColor: null //background color String
		,size: 200 //image size
		,border: 0.04 // border widrth = size * border
		,str: 'haha' //string to encode to qr
		,forgroundColor: '#000' //forgroundColor
		//,logoImage: logoImage
		,logoWidth: 40
		,logoHeight: 40
		,ecc: 'L'
	})

}

function* t3() {

	var logoImageFile = yield readFile('test/q-logo.png')

	var logoImage = new Image()

	logoImage.src = logoImageFile

	return qr({
		baseColor: '#fff' //canvas base color, all other images draw on this base
		//,backgroundImage: bgImage //canvas Image Object as background
		,backgroundColor: null //background color String
		,size: 200 //image size
		,border: 0.04 // border widrth = size * border
		,str: 'haha' //string to encode to qr
		,forgroundColor: '#000' //forgroundColor
		,logoImage: logoImage
		,logoWidth: 40
		,logoHeight: 40
		,ecc: 'L'
	})

}


function* t4() {
	
	return qr({
		baseColor: '#fff' //canvas base color, all other images draw on this base
		//,backgroundImage: bgImage //canvas Image Object as background
		,backgroundColor: 'rgba(50,60,86,.8)' //background color String
		,size: 200 //image size
		,border: 0.04 // border widrth = size * border
		,str: 'haha' //string to encode to qr
		,forgroundColor: '#000' //forgroundColor
		//,logoImage: logoImage
		,logoWidth: 40
		,logoHeight: 40
		,ecc: 'L'
	})

}

describe('get the canvas', function() {
	it('basic', function(done) {
		co(t1())
		.then(function(cvs) {
			assert(cvs)
			done()
		})
	})

	it('width backgroundImage', function(done) {
		co(t2())
		.then(function(cvs) {
			assert(cvs)
			done()
		})
	})

	it('with logo', function(done) {
		co(t3())
		.then(function(cvs) {
			assert(cvs)
			done()
		})
	})

	it('with rgba backgroundColor', function(done) {
		co(t4())
		.then(function(cvs) {
			assert(cvs)
			done()
		})
	})

})