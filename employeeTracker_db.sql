DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role VARCHAR(30) NOT NULL,
    manager VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO department (id, name)
VALUES ("1", "Web Development");

INSERT INTO role (id, title, salary, department_id, department_name)
VALUES ("01", "Back-End Developer", "150000", "1", "Web Development"),
("02", "Software Engineer", "200000", "1", "Web Development");

INSERT INTO employee (id, first_name, last_name, role, manager)
VALUES ("001", "Kilee", "Auxepo", "Back-End Developer", "Dave"),
("002", "Jacee", "Auxepo", "Software Engineer", "Lisa");