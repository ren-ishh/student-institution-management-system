// ============================================
//  INSTITUTION CONFIG — edit only this file
//  to customise the entire portal for any college
// ============================================

const INSTITUTION = {
  // Basic identity
  name: "Greenfield University",
  shortName: "GFU",
  tagline: "Manage Your Institution Intelligently",
  established: "1998",
  address: "123 College Road, Bengaluru, Karnataka",
  phone: "+91 80 1234 5678",
  email: "admin@greenfield.edu.in",
  website: "www.greenfield.edu.in",

  // Branding — change these two lines to rebrand completely
  colors: {
    navy: "#0B1D3A",       // primary dark color
    gold: "#C9992A",       // accent color
    goldLight: "#E8B84B",
  },

  // Academic structure
  academicYear: "2025–26",
  departments: [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Business Administration",
  ],

  // Leave policy — each institution can differ
  leavePolicy: {
    maxLeavesPerSemester: 15,
    requiresDocument: true,       // must upload medical cert etc
    autoRejectAfterDays: 7,       // auto reject if admin doesn't respond
    minAttendancePercent: 75,     // warn student if below this
  },

  // Grading scale
  gradingScale: [
    { grade: "O",  label: "Outstanding", minPercent: 90 },
    { grade: "A+", label: "Excellent",   minPercent: 80 },
    { grade: "A",  label: "Very Good",   minPercent: 70 },
    { grade: "B+", label: "Good",        minPercent: 60 },
    { grade: "B",  label: "Average",     minPercent: 50 },
    { grade: "F",  label: "Fail",        minPercent: 0  },
  ],

  // Features to show/hide per institution
  features: {
    leaveManagement: true,
    attendanceTracking: true,
    marksAndGrades: true,
    announcements: true,
    feeManagement: false,      // not built yet — set true when ready
    timetable: false,
  },
};

export default INSTITUTION;