/**
 * canvas-qr
 * create qrcode steam based on node-canvas
 * core code is from https://github.com/neocotic/qr.js
 */

//globs
var
generateFrame = require('./lib/qr-frame.js')
,Canvas = require('canvas')
,Image = Canvas.Image
,_ = require('lodash')


/**
 * @param size {Number} canvassize
 * @param lw {Number} logo width
 * @param lh {Number} logo height
 * return {Object}
 */
function computeLogoPos(size, lw, lh) {
	return {
		x: (size - lw)/2
		,y: (size - lh)/2
		,w: lw
		,h: lh
	}
}

/**
 * @param option {Object}
 * return {WriteSteam}
 */
exports.qr = function(option) {

	var defaults = _.extend({
		baseColor: '#fff' //canvas base color, all other images draw on this base
		,backgroundImage: null //canvas Image Object as background
		,backgroundColor: null //background color String , "#fff"
		,size: 200 //image size
		,border: 0.04 // border widrth = size * border
		,str: '' //string to encode to qr
		,forgroundColor: '#000' //forgroundColor
		,logoImage: null //canvas Image Object, as central logo
		,logoWidth: 20
		,logoHeight: 20
		,ecc: 'M'
	}, option)

	,size = defaults.size
	,borderWidth = size * defaults.border
	,qrSize = size - borderWidth * 2
	,backgroundColor = defaults.backgroundColor
	,backgroundImage = defaults.backgroundImage
	,logoImage = defaults.logoImage
	,i
	,j
	,points
	,width
	,fo
	,px
	,logoPos

	var cvs = new Canvas()
	var c2d = cvs.getContext('2d')

	c2d.canvas.width  = size
	c2d.canvas.height = size

	//base background
	c2d.fillStyle = defaults.baseColor
	c2d.fillRect(0, 0, size, size)

	//draw background color
	if(backgroundColor) {
		c2d.fillStyle = backgroundColor
		c2d.fillRect(0, 0, size, size)
	}

	//draw backgroundImage
	if(backgroundImage) {
		c2d.drawImage(backgroundImage, 0, 0, size, size)
	}

	//now draw qrcode
	fo = generateFrame(defaults.str, defaults.ecc, qrSize)
	points = fo.frameBuffer
	width = fo.width
	px = qrSize/width

	c2d.fillStyle = defaults.forgroundColor

	for (i = 0; i < width; i++) {
		for (j = 0; j < width; j++) {
			if (points[j * width + i]) {
				c2d.fillRect(borderWidth + px * i, borderWidth + px * j, px, px)
			}
		}
	}

	//draw logo image
	if(logoImage) {
		logoPos = computeLogoPos(size, defaults.logoWidth, defaults.logoHeight)
		c2d.drawImage(logoImage, logoPos.x, logoPos.y, defaults.logoWidth, defaults.logoHeight)
	}

	//return the canvas
	return cvs

}

exports.Canvas = Canvas