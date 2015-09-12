var fs 					= require('fs');
var path 				= require('path');
var express 			= require('express');
var youtubedl 			= require('youtube-dl');
var router 				= express.Router();

// Read the file name in the given directory
// Return all the file name to the front end
router.get('/', function(req, res) {
	res.render('index');
});

router.get('/scrape', function(req, res){
	// Video Url
	url = 'http://www.youtube.com/watch?v=fny1Xp-ixgs';

	// Get the video info and send it the front end and print it out
	var options = ['--username=IBMEmailTester@gmail.com', '--password=ibmemailtester110'];
	youtubedl.getInfo(url, options, function(err, info) {
		if (err) throw err;
		console.log(info);
		res.send(info);
	});
})

module.exports = router;
