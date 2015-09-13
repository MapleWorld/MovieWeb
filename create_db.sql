-- EXECUTED THIS FIRST
CREATE SCHEMA movies;

-- EXECUTED THIS INSIDE movies AFTER YOU CREATED THE SCHEMA 
create table movie (
	-- General Data
	id int AUTO_INCREMENT PRIMARY KEY,
	title varchar(255) NOT NULL,
	url varchar(2083) NOT NULL,
	webpage_url varchar(2083) NOT NULL,
	view_count int NOT NULL,
	like_count int NOT NULL,
	dislike_count int NOT NULL,
	upload_date int NOT NULL,
	tiff_date int
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
