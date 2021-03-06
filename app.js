var express = require('express');
		app = express(),
		fs = require('fs'),
		im = require('imagemagick'),
		srcImage = "./source_images/my_pic.jpg",
		desPath = "./destination_images/";
const args = process.argv;

app.get('/health', function(req, res) {
	res.status(200).json({"message":"Server is healthy"});
});

//Get full information about image
app.get('/getimage/information', function(req, res) {
	im.identify(srcImage, function(err, features){
		if (err) throw err;
		res.json({"images_data": features});
	});
});

// Get readMetadata information
app.get('/getimage/readmetadata', function(req, res) {
	im.readMetadata(srcImage, function(err, metadata){
		if (err) throw err;
		res.json({"metadata": metadata});
	});
});

// Qaulity  quality: 0 to 1
app.get('/image/resize/:qaulity', function(req, res) {
	var optionsObj = {
		srcPath: srcImage,
		dstPath: desPath+"my_pic.jpg",
		quality: req.params.quality,
		width: ""
	};
	im.resize(optionsObj, function(err, stdout){
		if (err) throw err;
		res.json({
			"message": "Resized Image successfully"
		});
	});
});

/**
	convert operations image	
**/
app.get('/image/convert', function(req, res) {
	var optionsObj = [srcImage, '-resize', '250x250', desPath+'butterfly_small.jpg'];
	im.convert(optionsObj, function(err, stdout){
		if (err) throw err;
		res.json({
			"message": "Converted successfully"
		});
	});
});

/**
	crop operation
	width: Speicify width for the source crop image
	height: Speicify height for the source crop image
**/
app.get('/image/crop/:width/:height', function(req, res) {
	crop_image(req,res);
});

function crop_image(req,res){
	var optionsObj = {
		srcPath: srcImage,
		dstPath: desPath+"myimage_cropped.jpg",
		width: req.params.width,
		height: req.params.height,
		quality: 1,
		gravity: "North"
	};
	im.crop(optionsObj, function(err, stdout){
		if (err) throw err;
		res.json({
			"message": "cropping done",
			"width":req.params.width,
			"height":req.params.height,
		});
	});

}


if (args.indexOf("lamda_event.json") > -1) {
	console.log("Starting as a lamda function.....");
} else {
    app.listen('3000', function(){
		console.log("server listening on port 3000....");
	});	
}
module.exports.crop = (event, context, callback) => {
		var optionsObj = {
			srcPath: srcImage,
			dstPath: desPath+'myimage_cropped.jpg',
			width: event.width,
			height: event.height,
			quality: 1,
			gravity: "North"
		};
		im.crop(optionsObj, function(err, stdout){
			if (err)
			return callback(error);
			else    
			return callback(null, stdout);
		});	
  };
  