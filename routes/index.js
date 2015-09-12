var fs 					= require('fs');
var path 				= require('path');
var express 			= require('express');
var youtubedl 			= require('youtube-dl');
var router 				= express.Router();

router.get('/', function(req, res) {
	// Load the top 10 most popular movies
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			return next("Cannot Connect");
		}
		var query = conn.query("SELECT * FROM MOVIE ORDER BY view_count DESC LIMIT 10", function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			console.log(rows);
			res.render('index', {movies: rows});
		});
	});
	
});

router.get('/insertMovie', function(req, res){
		
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			return next("Cannot Connect");
		}

		// Video Url
		video_url = [
			'http://www.youtube.com/watch?v=fny1Xp-ixgs',
			'http://www.youtube.com/watch?v=l1Q-cI4RE5s',
			'http://www.youtube.com/watch?v=QdU4E-JZJeo&index=1&list=PLzIW3-I4H4F5aBt4v4TQl1y6ug4-VeJOt',
			'http://www.youtube.com/watch?v=fyRlFzn0UkU&index=2&list=PLzIW3-I4H4F5aBt4v4TQl1y6ug4-VeJOt',
			'http://www.youtube.com/watch?v=4k8M87t7E-U&list=PLzIW3-I4H4F5aBt4v4TQl1y6ug4-VeJOt&index=3',
			'http://www.youtube.com/watch?v=7GCz7MbBM_U&index=4&list=PLzIW3-I4H4F5aBt4v4TQl1y6ug4-VeJOt',
			'http://www.youtube.com/watch?v=hzOzpxHnGHE&list=PLzIW3-I4H4F5WlqwdC7lo83hA4BbjPAYq',
			'http://www.youtube.com/watch?v=UVUwqxuDb9A&index=2&list=PLzIW3-I4H4F5WlqwdC7lo83hA4BbjPAYq',
			'http://www.youtube.com/watch?v=QgaTQ5-XfMM&index=3&list=PLzIW3-I4H4F5WlqwdC7lo83hA4BbjPAYq',
			'http://www.youtube.com/watch?v=H2-1u8xvk54&index=5&list=PLzIW3-I4H4F5WlqwdC7lo83hA4BbjPAYq',
			'http://www.youtube.com/watch?v=qycqF1CWcXg&list=PLzIW3-I4H4F5WlqwdC7lo83hA4BbjPAYq&index=8'
		];

		// Get the video info and send it the front end and print it out
		var options = ['--username=IBMEmailTester@gmail.com', '--password=ibmemailtester110'];
		for (var i = 0;i < video_url.length; i++) {
			youtubedl.getInfo(video_url[i], options, function(err, info) {
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
			});
		};
	});
	

})

module.exports = router;
