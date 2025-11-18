CREATE DATABASE profolio_db;

USE profolio_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Table for Personal Details
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    name VARCHAR(255),
    headline VARCHAR(255),
    about TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    timezone VARCHAR(100),
    email VARCHAR(255),
    profile_image LONGTEXT, -- Storing Base64 image string
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Table for Skills
CREATE TABLE IF NOT EXISTS skills (
    user_id INT PRIMARY KEY,
    skills_list TEXT,
    certifications TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Table for Experience (One user can have multiple jobs)
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_title VARCHAR(255),
    company VARCHAR(255),
    start_year INT,
    end_year INT,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Table for Projects
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_name VARCHAR(255),
    role VARCHAR(255),
    description TEXT,
    link VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Table for Education
CREATE TABLE IF NOT EXISTS educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    school VARCHAR(255),
    degree VARCHAR(255),
    start_year INT,
    end_year INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT * FROM users;
SELECT * FROM profiles;
SELECT * FROM skills;
SELECT * FROM educations;
SELECT * FROM experiences;
SELECT * FROM projects;