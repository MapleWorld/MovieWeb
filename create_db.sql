-- Tested with MySQL v5.1.73

-- CREATE SCHEMA movies;

-- insert into user (username, password, created_date, email, mailing_address, phone, gender, money, organization, interest, admin) values 
--	('admin','111111', '2014-10-23 20:04:25', 'test1@email.com', 'toronto', '416-888-8888', 'male', 999999, 'Uoft', 'health', 1); 
	
create table movie (
	-- General Data
	id int AUTO_INCREMENT PRIMARY KEY,
	title varchar(255) NOT NULL,
	url varchar(2083) NOT NULL,
	webpage_url varchar(2083) NOT NULL,
	view_count int NOT NULL,
	like_count int NOT NULL,
	dislike_count int NOT NULL,
	upload_date int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
