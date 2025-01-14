

CREATE DATABASE WeatherConditions;

USE WeatherConditions;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE searches (
    search_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);