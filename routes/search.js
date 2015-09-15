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

router.get('/search', function(req, res) {
	res.render('search');
});

router.get('/search/date/:date', function(req, res) {

	global.visitor_count += 1;
	console.log(global.visitor_count);
	// Load all the movies on given date
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			res.status(400).send(err);
			return false;
		}
		var query = conn.query("SELECT * FROM (" + table_query + ") as tables WHERE tables.tiff_date=" + req.params.date + " ORDER BY tables.like_count DESC", function (err, rows) {
			if (err) {
				res.status(400).send(err);
				return false;
			}
			res.render('search', {movies: rows});
		});
	});
});

router.get('/search/name/:name', function(req, res) {
	// Load all the movies on given date
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			res.status(400).send(err);
			return false;
		}
		var query = conn.query("SELECT * FROM (" + table_query + ") as tables WHERE tables.name=" + req.params.name, function (err, rows) {
			if (err) {
				res.status(400).send(err);
				return false;
			}
			res.render('search', {movies: rows});
		});
	});
});

module.exports = router;
