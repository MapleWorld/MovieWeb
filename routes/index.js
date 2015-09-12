var fs 					= require('fs');
var path 				= require('path');
var express 			= require('express');
var youtubedl 			= require('youtube-dl');
var router 				= express.Router();

router.get('/', function(req, res) {
	res.render('index', {movies: ""});

	// Load the top 10 most popular movies
	// UNCOMMENT THIS CODE WHEN YOU HAVE THE DATABASE SET UP
	/*
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			return next("Cannot Connect");
		}
		var query = conn.query("SELECT * FROM MOVIE ORDER BY view_count DESC LIMIT 10", function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			
			if (rows.length == 0){
				res.status(400).send("No Movie");
				return ;
			} 
			res.render('index', {movies: rows[0]});
		});
	});
	*/
});

router.get('/scrape', function(req, res){
		
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			return next("Cannot Connect");
		}

		// Video Url
		video_url = 'http://www.youtube.com/watch?v=fny1Xp-ixgs';

		// Get the video info and send it the front end and print it out
		var options = ['--username=IBMEmailTester@gmail.com', '--password=ibmemailtester110'];
		youtubedl.getInfo(video_url, options, function(err, info) {
			if (err) throw err;
			console.log(info);

			var data = {
				title: info.title,
				url: info.url,
				webpage_url: info.webpage_url,
				view_count: info.view_count,
				like_count: info.like_count,
				dislike_count: info.dislike_count,
				upload_date: info.upload_date,
			};

			// UNCOMMENT THIS CODE WHEN YOU HAVE THE DATABASE SET UP
			/*
			var query = conn.query("INSERT INTO movie SET ? ", data, function (err, rows) {
				if (err) {
					res.status(400).send(err);
				}
				
				if (rows.length == 0){
					res.status(400).send("Can't Insert");
					return ;
				} 
				console.log("Movie Inserted");
			});
			*/
			res.send(info);
		});
		
	});
	

})

module.exports = router;
