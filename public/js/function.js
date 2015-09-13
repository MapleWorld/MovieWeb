var fs 					= require('fs');
var path 				= require('path');
var youtubedl 			= require('youtube-dl');

module.exports = {

	getVideoInfo: function (video, res, conn) {
		// Get the video info and send it the front end and print it out
		var options = ['--username=IBMEmailTester@gmail.com', '--password=ibmemailtester110'];
		youtubedl.getInfo(video.url, options, function(err, info) {
			if (err) throw err;
			var data = {
				title: info.title,
				name: video.name,
				url: info.url,
				webpage_url: info.webpage_url,
				view_count: info.view_count,
				like_count: info.like_count,
				dislike_count: info.dislike_count,
				upload_date: info.upload_date,
				tiff_date: video.tiff_date
			};

			var query = conn.query("INSERT INTO movie SET ? ", data, function (err, rows) {
				if (err) {
					res.status(400).send(err);
				}
				console.log(rows);
				if (rows.length == 0){
					res.status(400).send("Can't Insert Movie: " + video.name);
					return ;
				} 
				console.log("Movie " + video.name + " Inserted");
			});
		});
	}
}