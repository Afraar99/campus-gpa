/**
 * Sri Lankan university grading systems
 */
export const gradingSystems = {
  standard: {
    name: "Standard Grading System",
    grades: [
      { grade: "A+", points: 4.0 },
      { grade: "A", points: 4.0 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3.0 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2.0 },
      { grade: "C-", points: 1.7 },
      { grade: "D+", points: 1.3 },
      { grade: "D", points: 1.0 },
      { grade: "E", points: 0.0 },
    ],
  },
  engineering: {
    name: "Engineering Faculty",
    grades: [
      { grade: "A+", points: 4.2 },
      { grade: "A", points: 4.0 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3.0 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2.0 },
      { grade: "C-", points: 1.7 },
      { grade: "D", points: 1.0 },
      { grade: "F", points: 0.0 },
    ],
  },
  medical: {
    name: "Medical Faculty",
    grades: [
      { grade: "A+", points: 4.0 },
      { grade: "A", points: 4.0 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3.0 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2.0 },
      { grade: "D", points: 1.0 },
      { grade: "F", points: 0.0 },
    ],
  },
  science: {
    name: "Science Faculty",
    grades: [
      { grade: "A+", points: 4.0 },
      { grade: "A", points: 4.0 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3.0 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2.0 },
      { grade: "C-", points: 1.7 },
      { grade: "D+", points: 1.3 },
      { grade: "D", points: 1.0 },
      { grade: "E", points: 0.0 },
    ],
  },
};

/**
 * Calculate GPA based on courses
 * @param {Array} courses - Array of course objects with grade and credits
 * @param {Object} gradingSystem - The grading system to use
 * @returns {Object} - GPA result with value and additional stats
 */
export const calculateGPA = (courses, gradingSystem) => {
  if (!courses || courses.length === 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalPoints: 0,
      courses: [],
    };
  }

  let totalCredits = 0;
  let totalPoints = 0;

  const coursesWithPoints = courses.map((course) => {
    const courseCredits = parseFloat(course.credits);
    const gradeInfo = gradingSystem.grades.find(
      (g) => g.grade === course.grade
    );
    const gradePoints = gradeInfo ? gradeInfo.points : 0;
    const coursePoints = courseCredits * gradePoints;

    totalCredits += courseCredits;
    totalPoints += coursePoints;

    return {
      ...course,
      gradePoints,
      coursePoints,
    };
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

  return {
    gpa: parseFloat(gpa),
    totalCredits,
    totalPoints,
    courses: coursesWithPoints,
  };
};

/**
 * Get the class designation based on GPA
 * @param {Number} gpa - The calculated GPA
 * @returns {String} - Class designation
 */
export const getClassDesignation = (gpa) => {
  if (gpa >= 3.7) return "First Class Honours";
  if (gpa >= 3.3) return "Second Class Honours (Upper Division)";
  if (gpa >= 3.0) return "Second Class Honours (Lower Division)";
  if (gpa >= 2.0) return "Pass";
  return "Fail";
};

/**
 * Generate a blank course template
 * @returns {Object} - Empty course object
 */
export const createEmptyCourse = () => ({
  id: Date.now().toString(),
  name: "",
  credits: "",
  grade: "",
  semester: "1",
});

/**
 * Group courses by semester
 * @param {Array} courses - Array of course objects
 * @returns {Object} - Courses grouped by semester
 */
export const groupBySemester = (courses) => {
  return courses.reduce((acc, course) => {
    const semester = course.semester || "1";
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(course);
    return acc;
  }, {});
};

/**
 * Calculate semester-wise and cumulative GPA
 * @param {Array} courses - Array of course objects
 * @param {Object} gradingSystem - The grading system to use
 * @returns {Object} - Semester and cumulative GPA calculations
 */
export const calculateSemesterGPA = (courses, gradingSystem) => {
  const semesterGroups = groupBySemester(courses);
  const semesters = Object.keys(semesterGroups).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  let cumulativeCourses = [];
  const results = {};

  semesters.forEach((semester) => {
    const semesterCourses = semesterGroups[semester];
    results[semester] = calculateGPA(semesterCourses, gradingSystem);

    cumulativeCourses = [...cumulativeCourses, ...semesterCourses];
    results.cumulative = calculateGPA(cumulativeCourses, gradingSystem);
  });

  return {
    semesterResults: results,
    semesters,
  };
};
