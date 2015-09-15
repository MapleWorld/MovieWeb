SELECT movie.name, movie.webpage_url, movie.like_count, movie.tiff_date, huff_post.recommanded as h_r, national_post.recommanded as n_r
FROM `movie`
LEFT JOIN `huff_post` on movie.name = huff_post.name
LEFT JOIN `national_post` on movie.name = national_post.name 

UNION

SELECT movie.name, movie.webpage_url, movie.like_count, movie.tiff_date, huff_post.recommanded as h_r, national_post.recommanded as n_r
FROM `movie`
LEFT JOIN `huff_post` on movie.name = huff_post.name
LEFT JOIN `national_post` on movie.name = national_post.name ;

INSERT INTO huff_post (name, recommanded) VALUES 
	("BEASTS OF NO NATION", "YES"),
	("BEEBA BOYS", "YES"),
	("BLACK MASS", "YES"),
	("BROOKLYN", "YES"),
	("THE DANISH GIRL", "YES"),
	("DEMOLITION", "YES"),
	("THE DRESSMAKER", "YES"),
	("EYE IN THE SKY", "YES"),
	("FORSAKEN", "YES"),
	("FREEHELD", "YES"),
	("HYENA ROAD", "YES"),
	("I SMILE BACK", "YES"),
	("LEGEND", "YES"),
	("THE LOBSTER", "YES"),
	("LOLO", "YES"),
	("THE MAN WHO KNEW INFINITY", "YES"),
	("THE MARTIAN", "YES"),
	("THE PROGRAM", "YES"),
	("REMEMBER", "YES"),
	("SEPTEMBERS OF SHIRAZ", "YES"),
	("SPOTLIGHT", "YES"),
	("STONEWALL", "YES"),
	("COLONIA", "YES"),
	("DESIERTO", "YES"),
	("FAMILIES", "YES"),
	("THE FAMILY FANG", "YES"),
	("GUILTY", "YES"),
	("THE IDOL", "YES"),
	("THE LADY IN THE VAN", "YES"),
	("MAGGIE'S PLAN", "YES"),
	("PARCHED", "YES"),
	("ROOM", "YES"),
	("SUNSET SONG", "YES"),
	("TRUMBO", "YES"),
	("WHERE TO INVADE NEXT", "YES"),
	("YOUTH", "YES");

INSERT INTO national_post (name, recommanded) VALUES 
	("THE TREASURE", "YES"),
	("DHEEPAN", "YES"),
	("SPOTLIGHT", "YES"),
	("SLEEPING GIANT", "YES"),
	("45 YEARS", "YES"),
	("THE MARTIAN", "YES"),
	("MISSISSIPPI GRIND", "YES"),
	("FRANCOFONIA", "YES"),
	("EVERY THING WILL BE FINE", "YES"),
	("LAND OF MINE", "YES"),
	("SICARIO", "YES");









