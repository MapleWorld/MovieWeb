var fs 					= require('fs');
var path 				= require('path');
var express 			= require('express');
var youtubedl 			= require('youtube-dl');
var router 				= express.Router();

var func = require('../public/js/function');

router.get('/', function(req, res) {
	//res.render('index', {movies: ""});
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
			res.render('index', {movies: rows});
		});
	});
});

router.get('/default/table', function(req, res) {
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
			res.render('table', {movies: rows});
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
			{ name: "THE PROMISED LAND", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=Heyy0umDP6A&index=94&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "JAFAR PANAHI'S TAXI", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=eM2tblIkL4g&index=103&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "GUILTY", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=7FquLnfzLjs&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=16" },
			{ name: "BANG GANG", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=PWi0XLFE1MQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE DRESSMAKER", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=_zXEGWXxgOg&index=142&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "MISSISSIPPI GRIND", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=xNzvD3LcEcE&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=59" },
			{ name: "THE PROGRAM", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=2r32pA6depI&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=140" },
			{ name: "ONE BREATH", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=f3lz1lh9ESM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=6" },
			{ name: "COLLECTIVE INVENTION", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=B5HkW--GAQ8&index=113&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "STORY OF JUDAS", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=nPd6TYduoQM&index=65&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE RAINBOW KID", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=ZRRWXMy_yEM&index=157&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "SEPTEMBERS OF SHIRAZ", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=hPwqzEtoG14&index=24&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "IMBISIBOL", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=zSKCk1ZDfuk&index=32&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "WE MONSTERS", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=pbNfV6G5dbI&index=42&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "URBAN HYMN", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=RWOxNagFcEY&index=76&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "P.S. JERUSALEM", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=HFqTVehJEyA&index=100&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE HERE AFTER", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=ZzJW3nYIhX4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=40" },
			{ name: "ANGRY INDIAN GODDESSES", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=feRWnYXe0X4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=5" },
			{ name: "3000 NIGHTS", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=tbKDxsvuhNg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=57" },
			{ name: "YAKUZA APOCALYPSE", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=Pn1fNww2XG8&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=122" },
			{ name: "BLACK", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=mnxq2RMCvZs&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=34" },
			{ name: "KEEPER", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=7sLgY6JbEyI&index=38&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg"  },
			{ name: "PHANTOM BOY", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=UqzDGMMqKfc&index=2&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg"  },
			{ name: "GUANTANAMO'S CHILD: OMAR KHADR", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=m7DBVUJNQQk&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=128" },
			{ name: "BLEAK STREET", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=aeqtG4mwsOg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=111" },
			{ name: "TRUMAN", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=2FeccZq_Esk&index=75&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LET THEM COME", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=Zplu_MO8e_c&index=19&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HE NAMED ME MALALA", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=FuKSR-bQSPk&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=115" },
			{ name: "VETERAN", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=MBj0HOLVQt8&index=87&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "WELCOME TO F.L.", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=eulrAJ4ctJ4&index=61&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "COUPLE IN A HOLE", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=oDo6U1BlFaM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=60" },
			{ name: "DEMON", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=Cn2zvlURSeU&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=91" },
			{ name: "THE DANISH GIRL", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=bJKly3XAR-I&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=9" },
			{ name: "LEGEND", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=g2gnTDMC51Y&index=146&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HORIZON", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=Csn2ZErcfLs&index=93&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "BOX", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=1FQgYt7OXrU&index=55&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "VILLE-MARIE", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=X34JTJn5ycM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=153" },
			{ name: "LOLO", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=qxqjG80VM1E&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=3" },
			{ name: "FAMILIES", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=JKwWkjBjntw&index=45&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "SUMMERTIME", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=5izgASn75GQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=143" },
			// SEPT 20
			{ name: "HONG KONG TRILOGY: PRESCHOOLED PREOCCUPIED PREPOSTEROUS", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=NO1Fodr71HA&index=62&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg"  },
			{ name: "HURT", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=NDLhsxNp8m4&index=98&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE OTHER SIDE", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=F3bEw8aoaJc&index=49&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LES COWBOYS", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=ICuVDVDYjHQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=39" },
			{ name: "THE EVENT", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=WP8XhlL9HEQ&index=23&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE CLUB", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=e8c2DYoF7lA&index=21&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "STARVE YOUR DOG", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=X6A2vO6c-VA&index=74&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LOLO", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=qxqjG80VM1E&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=3" },
			{ name: "THE PARADISE SUITE", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=wezLXi_1Xpg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=43"  },
			{ name: "THE FEAR", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=WVFQtznQMn8&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=4" },
			{ name: "WEDDING DOLL", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=gs9CeLe71pA&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=8" },
			{ name: "FIRE SONG", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=1HyRNI9kKkA&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=106" },
			{ name: "ANGRY INDIAN GODDESSES", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=feRWnYXe0X4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=5" },
			{ name: "A JOURNEY OF A THOUSAND MILES: PEACEKEEPERS", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=YAR3SXSme6c&index=99&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE MISSING GIRL", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=Xf286vpy-ls&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=92&spfreload=1" },
			{ name: "A YOUNG PATRIOT", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=AMv_KsCHVs8&index=108&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "MEN & CHICKEN", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=Ag1miLsTpeQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=117" },
			{ name: "IN THE ROOM", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=fZ8gQ109Sqk&index=56&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "DER NACHTMAHR", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=cyrp7VSEHdc&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=114" },
			{ name: "SPL 2: A TIME FOR CONSEQUENCES", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=wqa0-NrDNMs&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=120" },
			{ name: "THE ARDENNES", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=0c3-6qMpTho&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=41" },
			{ name: "JOURNEY TO THE SHORE", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=OWfKgKguOvQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=78" },
			{ name: "LAMB", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=VKh2M2ooD3w&index=81&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LONDON ROAD", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=CyBMYeG7pMM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=82" }
		];

		for (var i = 0;i < videos.length; i++) {
			func.getVideoInfo(videos[i], res, conn);
		};
		console.log("Insertion Completed");
	});
})

router.get('/search/date/:date', function(req, res) {
	// Load all the movies on given date
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			res.status(400).send(err);
		}
		var query = conn.query("SELECT * FROM movie WHERE tiff_date=" + req.params.date, function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			res.render('table', {movies: rows});
		});
	});
});

router.get('/search/name/:name', function(req, res) {
	// Load all the movies on given date
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			res.status(400).send(err);
		}
		var query = conn.query("SELECT * FROM movie WHERE name=" + req.params.name, function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			res.render('table', {movies: rows});
		});
	});
});

router.get('/all/movies', function(req, res) {
	// Load all the movies on given date
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			res.status(400).send(err);
		}
		var query = conn.query("SELECT * FROM movie", function (err, rows) {
			if (err) {
				res.status(400).send(err);
			}
			res.render('table', {movies: rows});
		});
	});
});

module.exports = router;
