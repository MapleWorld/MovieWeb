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
			res.status(400).send(err);
		}
		var query = conn.query("SELECT * FROM movie ORDER BY view_count DESC LIMIT 10", function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			console.log(rows);
			res.render('index', {movies: rows});
		});
	});
	
});

router.get('/clear', function(req, res) {
	// Load the top 10 most popular movies
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			return next("Cannot Connect");
		}
		var query = conn.query("delete from movie", function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			res.status(200).send("DB Cleared");
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
		var videos = [
			{ name: "THE OTHER SIDE", url: "https://www.youtube.com/watch?v=F3bEw8aoaJc&index=49&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "A FLICKERING TRUTH", url: "https://www.youtube.com/watch?v=_OMZxj0Qgk0&index=33&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "PHANTOM BOY", url: "https://www.youtube.com/watch?v=UqzDGMMqKfc&index=2&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE FEAR", url: "https://www.youtube.com/watch?v=WVFQtznQMn8&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=4" },
			{ name: "THE REFLEKTOR TAPES", url: "https://www.youtube.com/watch?v=41P68KAVosA&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=123" },
			{ name: "ONE FLOOR BELOW", url: "https://www.youtube.com/watch?v=YqIeoY4NF-4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=85" },
			{ name: "HONG KONG TRILOGY: PRESCHOOLED PREOCCUPIED PREPOSTEROUS", url: "https://www.youtube.com/watch?v=NO1Fodr71HA&index=62&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LES COWBOYS", url: "https://www.youtube.com/watch?v=ICuVDVDYjHQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=39" },
			{ name: "SICARIO", url: "https://www.youtube.com/watch?v=ccnYuqcQyFg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=144" },
			{ name: "VILLE-MARIE", url: "https://www.youtube.com/watch?v=X34JTJn5ycM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=153" },
			{ name: "TRUMBO", url: "https://www.youtube.com/watch?v=dhmVGF0kG50&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=31" },
			{ name: "ONE BREATH", url: "https://www.youtube.com/watch?v=f3lz1lh9ESM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=6" },
			{ name: "OUR LAST TANGO", url: "https://www.youtube.com/watch?v=FQW_NSMSZmM&index=118&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE RAINBOW KID", url: "https://www.youtube.com/watch?v=ZRRWXMy_yEM&index=157&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "NINTH FLOOR", url: "https://www.youtube.com/watch?v=NyeuMVM6v5c&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=166" },
			{ name: "HONOR THY FATHER", url: "https://www.youtube.com/watch?v=1MwgB4Jk8j0&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=90" },
			{ name: "WE MONSTERS", url: "https://www.youtube.com/watch?v=pbNfV6G5dbI&index=42&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "3000 NIGHTS", url: "https://www.youtube.com/watch?v=tbKDxsvuhNg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=57" },
			{ name: "A HEAVY HEART", url: "https://www.youtube.com/watch?v=i9EWvO6usQo&index=18&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "ABOUT RAY", url: "https://www.youtube.com/watch?v=vv6p82iGfac&index=63&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE DANISH GIRL", url: "https://www.youtube.com/watch?v=bJKly3XAR-I&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=9" },
			{ name: "THE MARTIAN", url: "https://www.youtube.com/watch?v=S6U8DXzsce4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=141" },
			{ name: "REMEMBER", url: "https://www.youtube.com/watch?v=unHJB_yp4ZM&index=145&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LEGEND", url: "https://www.youtube.com/watch?v=g2gnTDMC51Y&index=146&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "RETURN OF THE ATOM", url: "https://www.youtube.com/watch?v=knGZtYzQA6o&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=119" },
			{ name: "STARVE YOUR DOG", url: "https://www.youtube.com/watch?v=X6A2vO6c-VA&index=74&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "TRUMAN", url: "https://www.youtube.com/watch?v=2FeccZq_Esk&index=75&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HE NAMED ME MALALA", url: "https://www.youtube.com/watch?v=FuKSR-bQSPk&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=115" },
			{ name: "THE LOBSTER", url: "https://www.youtube.com/watch?v=NYQE2cU37bQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=95" }
		];

		// Get the video info and send it the front end and print it out
		var options = ['--username=IBMEmailTester@gmail.com', '--password=ibmemailtester110'];
		for (var i = 0;i < videos.length; i++) {
			youtubedl.getInfo(videos[i].url, options, function(err, info) {
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
					tiff_date: videos[i].name
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
