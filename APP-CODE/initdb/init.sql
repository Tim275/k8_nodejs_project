CREATE DATABASE sql_login;
CREATE TABLE users (id SERIAL PRIMARY KEY, firstname VARCHAR(256), lastname VARCHAR(256), email VARCHAR(256), password VARCHAR(256));
INSERT INTO users (firstname, lastname, email, password) VALUES ('John', 'Doe', 'john.doe@example.com', 'password123');
