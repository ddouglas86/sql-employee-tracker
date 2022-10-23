INSERT INTO department (name)
VALUES ("Corporate"),
("Accounting"),
("Marketing"),
("Sales"),
("PeopleOps"),
("IT"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 500000, 1),
("CFO", 450000, 1),
("Accountant", 70000, 2),
("Sr. Digital Manager", 180000, 3),
("Data Analyst", 95000, 3),
("Sr. Accountant", 100000, 2),
("Designer", 55000, 3),
("Inbound Consultant", 47000, 4),
("Sr. Counsel", 200000, 7),
("Assistant", 110000, 1),
("Chat Consultant", 40000, 4),
("Sr. Developer", 190000, 6),
("Manager", 70000, 4),
("VP", 100000, 1),
("Recruiter", 74000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Josie", "Frost", 1, NULL),
("Michael", "McAulay", 2, NULL),
("Jemma", "Mahone", 5, 9),
("Pamela", "Thatchet", 9, NULL),
("John", "Carrot", 10, 1),
("Regina", "Kay", 4, 1),
("Raeshel", "McDaniels", 13, 8),
("Jamie", "Folger", 14, 2),
("Tom", "Fellows", 14, 1),
("Macy", "Sorbet", 11, 7);

