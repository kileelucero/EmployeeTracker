-- update employee role
UPDATE employee
SET role_id = 17 -- {input role_id}
WHERE id = 27 -- {input employee_id}
;

-- update manager
UPDATE employee
SET manager_id= 3 -- {input manager_id}
WHERE id= 8 -- {input employee_id}
;

-- add employee
INSERT INTO employee
(first_name, last_name, role_id, manager_id);

-- remove employee
DELETE FROM employee
WHERE id= -- {input employee id}
;
