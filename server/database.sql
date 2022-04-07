CREATE DATABASE jwtAuth

CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT
  uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL
);

// install uuid-ossp extention
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO users (user_name, user_email, user_password)
VALUES ('Ankan', 'ankan@gmail.com', '1234567'),
       ('Shayla', 'shayla@gmail.com', '1234567'),
       ('Adnan', 'adnan@gmail.com', '1234567');