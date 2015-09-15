var fs 					= require('fs');
var path 				= require('path');
var express 			= require('express');
var youtubedl 			= require('youtube-dl');
var router 				= express.Router();

var func = require('../public/js/function');

var table_query = 
			  "SELECT movie.name, movie.view_count, movie.webpage_url, movie.like_count, movie.tiff_date, " 
			+ "huff_post.recommanded as h_r, national_post.recommanded as n_r "
			+ "FROM `movie` "
			+ "LEFT JOIN `huff_post` on movie.name = huff_post.name "
			+ "LEFT JOIN `national_post` on movie.name = national_post.name "
			+ "UNION "
			+ "SELECT movie.name, movie.view_count, movie.webpage_url, movie.like_count, movie.tiff_date, "
			+ "huff_post.recommanded as h_r, national_post.recommanded as n_r "
			+ "FROM `movie` "
			+ "LEFT JOIN `huff_post` on movie.name = huff_post.name "
			+ "LEFT JOIN `national_post` on movie.name = national_post.name ";

router.get('/', function(req, res) {
	global.visitor_count += 1;
	console.log(global.visitor_count);
	res.render('index');
});

router.get('/all/movies', function(req, res) {
	// Load all the movies on given date
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			res.status(400).send(err);
			return false;
		}
		var query = conn.query(table_query, function (err, rows) {
			if (err) {
				res.status(400).send(err);
				return false;
			}
			res.render('search', {movies: rows});
		});
	});
});

router.get('/clear', function(req, res) {
	// Load the top 10 most popular movies
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err, " Cannot Connect");
			return false;
		}
		var query = conn.query("delete from movie", function (err, rows) {
			if (err) {
				res.status(400).send(err);
				return false;
			}
			res.status(200).send("DB Cleared");
		});
	});
});


router.get('/insertMovie', function(req, res){
		
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err, " Cannot Connect");
			return false;
		}

		conn.query("Truncate table movie", function (err, rows) {
			if (err) {
				res.status(400).send(err);
				return false;
			} 
			console.log("Table Truncated");
		});

		// Video Url
		var videos = [
			{ name: "THE PEOPLE VS FRITZ BAUER", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=nN5PvNQq86E" },
			{ name: "CROMO", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=Gpq3dLH_klU" },
			{ name: "BOX", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=1FQgYt7OXrU&index=55&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE PROMISED LAND", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=Heyy0umDP6A&index=94&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "MOUNTAINS MAY DEPART", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=YzkKT2wzCXk&index=97&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HORIZON", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=Csn2ZErcfLs&index=93&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HYENA ROAD", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=G95rPqBxPmQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=147" },
			{ name: "FAMILIES", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=JKwWkjBjntw&index=45&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "COUPLE IN A HOLE", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=oDo6U1BlFaM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=60" },
			{ name: "NO HOME MOVIE", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=X8ft_Gud9nE&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=83" },
			{ name: "THE WAITING ROOM", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=xZIPVOWfRtI&index=155&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "SPOTLIGHT", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=WwKqMV9bvR4&index=46&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "SLEEPING GIANT", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=2A25lvWI4mc&index=161&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "FULL CONTACT", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=nMOntJRNgJI&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=7" },
			{ name: "VETERAN", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=MBj0HOLVQt8&index=87&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "BLEAK STREET", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=aeqtG4mwsOg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=111" },
			{ name: "THE MISSING GIRL", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=Xf286vpy-ls&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=92&spfreload=1" },
			{ name: "SHERPA", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=_TL-ZbtvuT8&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=48" },
			{ name: "KEEPER", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=7sLgY6JbEyI&index=38&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "DOWNRIVER", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=vs47n0m48n4&index=36&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LAST CAB TO DARWIN", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=rduABldvIh0&index=80&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "FIRE SONG", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=1HyRNI9kKkA&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=106" },
			{ name: "WOMEN HE'S UNDRESSED", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=HaWDqVp9xj0&index=121&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "MAGALLANES", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=T3tOgzQEy7s&index=27&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "BLACK MASS", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=OwkjkQ5onSM&index=150&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "SEPTEMBERS OF SHIRAZ", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=hPwqzEtoG14&index=24&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "CEMETERY OF SPLENDOUR", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=2nt84GI_U3Y&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=112" },
			{ name: "THE PARADISE SUITE", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=wezLXi_1Xpg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=43" },
			{ name: "THE EVENT", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=WP8XhlL9HEQ&index=23&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LAMB", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=VKh2M2ooD3w&index=81&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "IN THE ROOM", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=fZ8gQ109Sqk&index=56&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE DRESSMAKER", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=_zXEGWXxgOg&index=142&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "COLLECTIVE INVENTION", tiff_date: 20150915, url: "https://www.youtube.com/watch?v=B5HkW--GAQ8&index=113&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },

			{ name: "THE HARD STOP", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=fLS3s189CAM" },
			{ name: "MUCH LOVED", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=V5tVHHz7N0Q" },
			{ name: "25 APRIL", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=gfeKrG74_uQ" },
			{ name: "THE HERE AFTER", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=ZzJW3nYIhX4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=40" }, 
			{ name: "THE ARDENNES", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=0c3-6qMpTho&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=41" },
			{ name: "HURT", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=NDLhsxNp8m4&index=98&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "CLOSET MONSTER", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=VSLEI55SS5s&index=131&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "KOZA", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=YyN56szYJ-w&index=79&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "BLEAK STREET", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=aeqtG4mwsOg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=111" }, 
			{ name: "THE CLAN", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=aWia2xcELuI&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=101" },
			{ name: "P.S. JERUSALEM", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=HFqTVehJEyA&index=100&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" }, 
			{ name: "LES ÊTRES CHERS", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=M-0eZz4g9oA&index=30&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "A YOUNG PATRIOT", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=AMv_KsCHVs8&index=108&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" }, 
			{ name: "WEDDING DOLL", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=gs9CeLe71pA&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=8" },
			{ name: "RIGHT NOW, WRONG THEN", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=wOE-Zznq_S4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=105" },
			{ name: "JOURNEY TO THE SHORE", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=OWfKgKguOvQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=78" },
			{ name: "DÉGRADÉ", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=qjVPSnnSp58&index=35&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "IT ALL STARTED AT THE END", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=YlbAXxKDZ9I&index=116&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "GUANTANAMO'S CHILD: OMAR KHADR", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=m7DBVUJNQQk&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=128" },
			{ name: "MEN & CHICKEN", tiff_date: 20150916, url: "https://www.youtube.com/watch?v=Ag1miLsTpeQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=117" },

			{ name: "SPL 2: A TIME FOR CONSEQUENCES", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=wuR4LEVJZBU" },
			{ name: "A TALE OF THREE CITIES", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=xK9XOT05-xQ" },
			{ name: "MUCH LOVED", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=V5tVHHz7N0Q" },
			{ name: "THE CLUB", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=e8c2DYoF7lA&index=21&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "NEON BULL", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=bFUx0jFKDLc" },
			{ name: "THE CLAN", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=aWia2xcELuI&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=101" },
			{ name: "NEON BULL", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=bFUx0jFKDLc" },
			{ name: "LAST CAB TO DARWIN", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=rduABldvIh0&index=80&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "SLEEPING GIANT", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=2A25lvWI4mc&index=161&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE KIND WORDS", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=_jxWK1F6QJU&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=69" }, 
			{ name: "KEEPER", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=7sLgY6JbEyI&index=38&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "MISSISSIPPI GRIND", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=xNzvD3LcEcE&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=59" },
			{ name: "PRICE OF LOVE", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=-g_1fxcRAHk&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=84" },
			{ name: "WOMEN HE'S UNDRESSED", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=HaWDqVp9xj0&index=121&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" }, 
			{ name: "THE STEPS", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=bMjUawYWWQc&index=15&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "DOWNRIVER", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=vs47n0m48n4&index=36&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LAMB", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=VKh2M2ooD3w&index=81&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" }, 
			{ name: "THE MARTIAN", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=S6U8DXzsce4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=141" },
			{ name: "SICARIO", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=ccnYuqcQyFg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=144" }, 
			{ name: "THE WAITING ROOM", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=xZIPVOWfRtI&index=155&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "NO HOME MOVIE", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=X8ft_Gud9nE&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=83" },
			{ name: "IN THE ROOM", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=fZ8gQ109Sqk&index=56&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "DER NACHTMAHR", tiff_date: 20150917, url: "https://www.youtube.com/watch?v=cyrp7VSEHdc&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=114" },

			{ name: "NEON BULL", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=bFUx0jFKDLc" },
			{ name: "THE PEARL BUTTON", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=RDi4KtrwcsU" },
			{ name: "THE MARTIAN", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=S6U8DXzsce4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=141" },
			{ name: "THE SKY TREMBLES AND THE EARTH IS AFRAID AND THE TWO EYES ARE NOT BROTHERS", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=PNapgNaZZGM&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=72" },
			{ name: "THE CLUB", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=e8c2DYoF7lA&index=21&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "ANGRY INDIAN GODDESSES", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=feRWnYXe0X4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=5" },
			{ name: "A YOUNG PATRIOT", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=AMv_KsCHVs8&index=108&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LAST CAB TO DARWIN", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=rduABldvIh0&index=80&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "BEING AP", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=mrIbDGwwE7Y&index=110&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "PRICE OF LOVE", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=-g_1fxcRAHk&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=84" },
			{ name: "DER NACHTMAHR", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=cyrp7VSEHdc&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=114" },
			{ name: "WOMEN HE'S UNDRESSED", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=HaWDqVp9xj0&index=121&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "GRANNY'S DANCING ON THE TABLE", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=HnE66bfYwMs&index=11&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "WEDDING DOLL", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=PO8CNTqu3_g&index=13&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "A HEAVY HEART", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=i9EWvO6usQo&index=18&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "MAGALLANES", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=T3tOgzQEy7s&index=27&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "RIGHT NOW, WRONG THEN", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=wOE-Zznq_S4&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=105" },
			{ name: "THANK YOU FOR BOMBING", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=ch77-ieeZ6k&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=73" },
			{ name: "HELLIONS", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=lXScot-j1T8&index=107&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HONOR THY FATHER", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=1MwgB4Jk8j0&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=90" },
			{ name: "RETURN OF THE ATOM", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=knGZtYzQA6o&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=119" },
			{ name: "A FLICKERING TRUTH", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=_OMZxj0Qgk0&index=33&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE PEOPLE VS FRITZ BAUER", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=nN5PvNQq86E" },
			{ name: "CROMO", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=Gpq3dLH_klU" },
			{ name: "25 APRIL", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=gfeKrG74_uQ" },
			{ name: "FULL CONTACT", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=nMOntJRNgJI&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=7" },
			{ name: "MUCH LOVED", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=V5tVHHz7N0Q" },
			{ name: "OUR LAST TANGO", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=FQW_NSMSZmM&index=118&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "YOUTH", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=-T7CM4di_0c" },
			{ name: "BLACK MASS", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=OwkjkQ5onSM&index=150&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LOLO", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=qxqjG80VM1E&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=3" },
			{ name: "STONEWALL", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=LGEJmPwB4yI" },
			{ name: "KOZA", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=YyN56szYJ-w&index=79&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "JOURNEY TO THE SHORE", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=OWfKgKguOvQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=78" },
			{ name: "A TALE OF THREE CITIES", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=xK9XOT05-xQ" },
			{ name: "THE WITCH", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=iQXmlf3Sefg" },
			{ name: "YAKUZA APOCALYPSE", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=Pn1fNww2XG8&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=122" },
			{ name: "CUCKOLD", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=dVWyyZ0IJDE" },
			{ name: "THE HARD STOP", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=fLS3s189CAM" },
			{ name: "SPL 2: A TIME FOR CONSEQUENCES", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=wuR4LEVJZBU" },
			{ name: "THE REFLEKTOR TAPES", tiff_date: 20150918, url: "https://www.youtube.com/watch?v=41P68KAVosA&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=123" },

			{ name: "THE WITCH", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=iQXmlf3Sefg" },
			{ name: "STONEWALL", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=LGEJmPwB4yI" },
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
			{ name: "KEEPER", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=7sLgY6JbEyI&index=38&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "PHANTOM BOY", tiff_date: 20150919, url: "https://www.youtube.com/watch?v=UqzDGMMqKfc&index=2&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
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

			{ name: "A TALE OF THREE CITIES", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=xK9XOT05-xQ" },
			{ name: "NEON BULL", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=bFUx0jFKDLc" },
			{ name: "HONG KONG TRILOGY: PRESCHOOLED PREOCCUPIED PREPOSTEROUS", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=NO1Fodr71HA&index=62&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "HURT", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=NDLhsxNp8m4&index=98&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE OTHER SIDE", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=F3bEw8aoaJc&index=49&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LES COWBOYS", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=ICuVDVDYjHQ&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=39" },
			{ name: "THE EVENT", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=WP8XhlL9HEQ&index=23&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "THE CLUB", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=e8c2DYoF7lA&index=21&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "STARVE YOUR DOG", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=X6A2vO6c-VA&index=74&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg" },
			{ name: "LOLO", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=qxqjG80VM1E&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=3" },
			{ name: "THE PARADISE SUITE", tiff_date: 20150920, url: "https://www.youtube.com/watch?v=wezLXi_1Xpg&list=PL1tg47x0U7tGkGf5LF31q9rF_Mf1JWMPg&index=43" },
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

module.exports = router;
