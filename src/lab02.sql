CREATE TABLE "public".users (
	id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(254) NOT NULL,
	email VARCHAR(254) NOT NULL,
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(254) NOT NULL
)