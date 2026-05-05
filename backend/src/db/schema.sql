-- ============================================
--  EDUPORTAL DATABASE SCHEMA
-- ============================================

-- Clean slate (order matters for foreign keys)
DROP TABLE IF EXISTS notices         CASCADE;
DROP TABLE IF EXISTS marks           CASCADE;
DROP TABLE IF EXISTS attendance      CASCADE;
DROP TABLE IF EXISTS hostel_leaves   CASCADE;
DROP TABLE IF EXISTS leaves          CASCADE;
DROP TABLE IF EXISTS enrollments     CASCADE;
DROP TABLE IF EXISTS subjects        CASCADE;
DROP TABLE IF EXISTS students        CASCADE;
DROP TABLE IF EXISTS faculty         CASCADE;
DROP TABLE IF EXISTS users           CASCADE;
DROP TABLE IF EXISTS departments     CASCADE;
DROP TABLE IF EXISTS institutions    CASCADE;

-- INSTITUTIONS
CREATE TABLE institutions (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  short_name    VARCHAR(20)  NOT NULL,
  email         VARCHAR(100),
  address       TEXT,
  academic_year VARCHAR(20),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- DEPARTMENTS
CREATE TABLE departments (
  id             SERIAL PRIMARY KEY,
  institution_id INT REFERENCES institutions(id) ON DELETE CASCADE,
  name           VARCHAR(100) NOT NULL,
  code           VARCHAR(10)  NOT NULL,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- USERS (all roles share this table)
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  institution_id INT REFERENCES institutions(id) ON DELETE CASCADE,
  email          VARCHAR(100) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20)  NOT NULL CHECK (role IN ('student','admin','faculty')),
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- STUDENTS
CREATE TABLE students (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id) ON DELETE CASCADE,
  institution_id INT REFERENCES institutions(id),
  department_id  INT REFERENCES departments(id),
  name           VARCHAR(100) NOT NULL,
  roll_number    VARCHAR(30)  UNIQUE NOT NULL,
  semester       INT NOT NULL,
  batch          VARCHAR(20),
  phone          VARCHAR(20),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- FACULTY
CREATE TABLE faculty (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id) ON DELETE CASCADE,
  institution_id INT REFERENCES institutions(id),
  department_id  INT REFERENCES departments(id),
  name           VARCHAR(100) NOT NULL,
  employee_id    VARCHAR(30)  UNIQUE NOT NULL,
  designation    VARCHAR(100),
  phone          VARCHAR(20),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- SUBJECTS
CREATE TABLE subjects (
  id             SERIAL PRIMARY KEY,
  institution_id INT REFERENCES institutions(id),
  department_id  INT REFERENCES departments(id),
  faculty_id     INT REFERENCES faculty(id),
  name           VARCHAR(100) NOT NULL,
  code           VARCHAR(20)  UNIQUE NOT NULL,
  semester       INT NOT NULL,
  section        VARCHAR(5),
  credits        INT DEFAULT 4,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ENROLLMENTS (student <-> subject)
CREATE TABLE enrollments (
  id         SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id) ON DELETE CASCADE,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(student_id, subject_id)
);

-- LEAVES
CREATE TABLE leaves (
  id           SERIAL PRIMARY KEY,
  student_id   INT REFERENCES students(id) ON DELETE CASCADE,
  type         VARCHAR(50) NOT NULL,
  from_date    DATE NOT NULL,
  to_date      DATE NOT NULL,
  days         INT NOT NULL,
  reason       TEXT NOT NULL,
  status       VARCHAR(20) DEFAULT 'pending'
               CHECK (status IN ('pending','approved','rejected')),
  doc_url      VARCHAR(255),
  admin_comment TEXT,
  applied_on   TIMESTAMP DEFAULT NOW(),
  reviewed_on  TIMESTAMP,
  reviewed_by  INT REFERENCES users(id)
);

-- HOSTEL LEAVES
CREATE TABLE hostel_leaves (
  id             SERIAL PRIMARY KEY,
  student_id     INT REFERENCES students(id) ON DELETE CASCADE,
  reason         VARCHAR(100) NOT NULL,
  description    TEXT,
  from_date      DATE NOT NULL,
  from_time      TIME NOT NULL,
  to_date        DATE NOT NULL,
  to_time        TIME NOT NULL,
  destination    TEXT NOT NULL,
  parent_phone   VARCHAR(20) NOT NULL,
  status         VARCHAR(20) DEFAULT 'pending'
                 CHECK (status IN ('pending','approved','rejected')),
  warden_comment TEXT,
  applied_on     TIMESTAMP DEFAULT NOW(),
  reviewed_on    TIMESTAMP,
  reviewed_by    INT REFERENCES users(id)
);

-- ATTENDANCE
CREATE TABLE attendance (
  id          SERIAL PRIMARY KEY,
  student_id  INT REFERENCES students(id) ON DELETE CASCADE,
  subject_id  INT REFERENCES subjects(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      VARCHAR(10) NOT NULL CHECK (status IN ('present','absent')),
  marked_by   INT REFERENCES faculty(id),
  marked_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_id, date)
);

-- MARKS
CREATE TABLE marks (
  id          SERIAL PRIMARY KEY,
  student_id  INT REFERENCES students(id) ON DELETE CASCADE,
  subject_id  INT REFERENCES subjects(id) ON DELETE CASCADE,
  exam_type   VARCHAR(30) DEFAULT 'semester',
  internal    INT DEFAULT 0 CHECK (internal >= 0 AND internal <= 30),
  external    INT DEFAULT 0 CHECK (external >= 0 AND external <= 95),
  total       INT GENERATED ALWAYS AS (internal + external) STORED,
  entered_by  INT REFERENCES faculty(id),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_id, exam_type)
);

-- NOTICES
CREATE TABLE notices (
  id             SERIAL PRIMARY KEY,
  institution_id INT REFERENCES institutions(id),
  title          TEXT NOT NULL,
  tag            VARCHAR(30),
  department_id  INT REFERENCES departments(id),
  posted_by      INT REFERENCES users(id),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_leaves_student     ON leaves(student_id);
CREATE INDEX idx_leaves_status      ON leaves(status);
CREATE INDEX idx_hostel_student     ON hostel_leaves(student_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_subject ON attendance(subject_id);
CREATE INDEX idx_attendance_date    ON attendance(date);
CREATE INDEX idx_marks_student      ON marks(student_id);
CREATE INDEX idx_marks_subject      ON marks(subject_id);