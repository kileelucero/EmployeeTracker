USE employee_db;

INSERT INTO department (id, name)
VALUES (1,'Dept1'),
(2,'Dept2'),
(3,'Dept3');

INSERT INTO role (id, title, salary, department_id)
VALUES (1,'Role1',200000,1),
(2,'Role2',150000,2),
(3,'Role3',100000,3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES (1,'Kilee','Auxepo',2, 5),
(2,'Jacee','Auxepo',2,5),
(3,'Kieler','Auxepo',3,6),
(4,'Zoee','Auxepo',3,6),
(5,'Lisa','Auxepo',1, NULL),
(6,'Jack','Auxepo',1, NULL);