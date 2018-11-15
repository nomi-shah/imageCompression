var express = require('express');
		app = express(),
		fs = require('fs'),
		im = require('imagemagick'),
		srcImage = "./source_images/butterfly.jpg",
		desPath = "./destination_images/";

app.get('/', function(req, res) {
	res.json({"message":"Connected successfully"});
});

//Get full information about image
app.get('/getimage/information', function(req, res) {
	im.identify(srcImage, function(err, features){
		if (err) throw err;
		res.json({"images_data": features});
	});
});

//Get specific information about image
app.get('/getimage/information/:specific', function(req, res) {
	var selectSpecific = decodeURIComponent(req.params.specific);
	selectSpecific = JSON.parse(selectSpecific).join("%");
	im.identify(['-format','%'+selectSpecific, srcImage], function(err, output){
		if (err) throw err;
		res.json({"images_data": output});
	});
});

// Get readMetadata information
app.get('/getimage/readmetadata', function(req, res) {
	im.readMetadata(srcImage, function(err, metadata){
		if (err) throw err;
		res.json({"metadata": metadata});
	});
});


app.get('/image/resize', function(req, res) {
	var optionsObj = {
		srcPath: srcImage,
		dstPath: desPath+"butterfly_lowquality.jpg",
		quality: 0.6,
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
	convert operations
	==================
	
**/
app.get('/image/convert', function(req, res) {
	var optionsObj = [srcImage, '-resize', '250x250', desPath+'butterfly_small.jpg'];
	im.convert(optionsObj, function(err, stdout){
		if (err) throw err;
		res.json({
			"message": "Converted Image successfully"
		});
	});
});

/**
	crop operations
	===============
	
**/
app.get('/image/crop', function(req, res) {
	var optionsObj = {
		srcPath: srcImage,
		dstPath: desPath+'butterfly_cropped.jpg',
		width: 800,
		height: 600,
		quality: 1,
		gravity: "North"
	};
	im.crop(optionsObj, function(err, stdout){
		if (err) throw err;
		res.json({
			"message": "cropped Image successfully"
		});
	});
});

(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

app.listen('8900', function(){
	console.log("connected to port 8900");
})