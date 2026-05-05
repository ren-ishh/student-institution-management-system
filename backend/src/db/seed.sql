-- ============================================
--  SEED DATA — demo institution + users
-- ============================================

-- Institution
INSERT INTO institutions (name, short_name, email, address, academic_year)
VALUES ('Greenfield University', 'GFU',
        'admin@greenfield.edu.in',
        '123 College Road, Bengaluru, Karnataka',
        '2025-26');

-- Departments
INSERT INTO departments (institution_id, name, code) VALUES
(1, 'Computer Science',      'CS'),
(1, 'Electronics',           'EC'),
(1, 'Mechanical',            'ME'),
(1, 'Civil',                 'CV'),
(1, 'Business Administration','BA');

-- Users (passwords are bcrypt of the demo passwords)
-- student: 1234 | admin: admin | faculty: faculty
INSERT INTO users (institution_id, email, password_hash, role) VALUES
(1, 'arjun.singh@greenfield.edu.in',
 '$2b$10$QWds3whtvMfPFyfv0cVnW.1QY7KIy5varmtOu.H5fjiTUG/frCBrq', 'student'),
(1, 'priya.mehta@greenfield.edu.in',
 '$2b$10$QBnXtKpUZQV4Pqj3HDYeqeP3IMmhhLrr2V2a.KH88AqZF9wvNpic.', 'admin'),
(1, 'anand.kumar@greenfield.edu.in',
 '$2b$10$MWyXVBSOlZB0u41YGCC/4uSNuvKavQcyxGSoYC74us/L8WhnDLnu.', 'faculty');

-- Student profile
INSERT INTO students
  (user_id, institution_id, department_id, name, roll_number, semester, batch, phone)
VALUES
  (1, 1, 1, 'Arjun Singh', 'CS2023001', 5, '2023-27', '+91 98765 43210');

-- Faculty profile
INSERT INTO faculty
  (user_id, institution_id, department_id, name, employee_id, designation, phone)
VALUES
  (3, 1, 1, 'Prof. Anand Kumar', 'FAC042', 'Associate Professor', '+91 98123 45678');

-- Subjects
INSERT INTO subjects (institution_id, department_id, faculty_id, name, code, semester, section) VALUES
(1, 1, 1, 'Data Structures',      'CS301', 5, 'A'),
(1, 1, 1, 'Operating Systems',    'CS302', 5, 'A'),
(1, 1, 1, 'Algorithm Design',     'CS401', 7, 'B');

-- Enroll student in subjects
INSERT INTO enrollments (student_id, subject_id) VALUES (1,1),(1,2),(1,3);

-- Sample attendance
INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES
(1, 1, '2026-04-25', 'present', 1),
(1, 1, '2026-04-23', 'present', 1),
(1, 1, '2026-04-21', 'absent',  1),
(1, 2, '2026-04-26', 'present', 1),
(1, 2, '2026-04-24', 'present', 1);

-- Sample marks
INSERT INTO marks (student_id, subject_id, exam_type, internal, external, entered_by) VALUES
(1, 1, 'semester', 28, 71, 1),
(1, 2, 'semester', 25, 68, 1),
(1, 3, 'semester', 26, 74, 1);

-- Sample leave
INSERT INTO leaves (student_id, type, from_date, to_date, days, reason, status, admin_comment)
VALUES (1, 'Medical Leave', '2025-12-12', '2025-12-14', 3,
        'Fever and viral infection', 'approved', 'Approved. Get well soon.');

-- Sample notice
INSERT INTO notices (institution_id, title, tag, posted_by) VALUES
(1, 'End Semester Exam Schedule Released', 'Exam',    2),
(1, 'Holiday on Apr 30 — Maharashtra Day', 'Holiday', 2),
(1, 'Internal Assessment Marks Published',  'Marks',   2);