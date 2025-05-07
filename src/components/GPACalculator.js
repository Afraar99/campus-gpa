import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaDownload, FaSave, FaUpload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./GPACalculator.scss";
import {
  gradingSystems,
  calculateGPA,
  getClassDesignation,
  createEmptyCourse,
  calculateSemesterGPA,
} from "../utils/gpaUtils";
import GPAResult from "./GPAResult";
import SemesterBreakdown from "./SemesterBreakdown";

const GPACalculator = () => {
  const [courses, setCourses] = useState([createEmptyCourse()]);
  const [selectedGradingSystem, setSelectedGradingSystem] =
    useState("standard");
  const [gpaResult, setGpaResult] = useState(null);
  const [semesterResults, setSemesterResults] = useState(null);
  const [showSemesterBreakdown, setShowSemesterBreakdown] = useState(false);

  // Load saved courses from localStorage on initial load
  useEffect(() => {
    const savedCourses = localStorage.getItem("gpaCalculatorCourses");
    const savedGradingSystem = localStorage.getItem(
      "gpaCalculatorGradingSystem"
    );

    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        setCourses(parsedCourses);
      } catch (error) {
        console.error("Error parsing saved courses:", error);
      }
    }

    if (savedGradingSystem) {
      setSelectedGradingSystem(savedGradingSystem);
    }
  }, []);

  // Calculate GPA whenever courses or grading system changes
  useEffect(() => {
    if (courses.length > 0) {
      const validCourses = courses.filter(
        (course) => course.name && course.credits && course.grade
      );

      if (validCourses.length > 0) {
        const result = calculateGPA(
          validCourses,
          gradingSystems[selectedGradingSystem]
        );
        setGpaResult(result);

        // Calculate semester breakdown
        const semResults = calculateSemesterGPA(
          validCourses,
          gradingSystems[selectedGradingSystem]
        );
        setSemesterResults(semResults);
      } else {
        setGpaResult(null);
        setSemesterResults(null);
      }
    }
  }, [courses, selectedGradingSystem]);

  const handleGradingSystemChange = (e) => {
    const system = e.target.value;
    setSelectedGradingSystem(system);
    localStorage.setItem("gpaCalculatorGradingSystem", system);
  };

  const handleAddCourse = () => {
    setCourses([...courses, createEmptyCourse()]);
  };

  const handleRemoveCourse = (id) => {
    if (courses.length === 1) {
      toast.warning("You must have at least one course");
      return;
    }

    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem(
      "gpaCalculatorCourses",
      JSON.stringify(updatedCourses)
    );
  };

  const handleCourseChange = (id, field, value) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === id) {
        return { ...course, [field]: value };
      }
      return course;
    });

    setCourses(updatedCourses);
    localStorage.setItem(
      "gpaCalculatorCourses",
      JSON.stringify(updatedCourses)
    );
  };

  const handleSaveCourses = () => {
    localStorage.setItem("gpaCalculatorCourses", JSON.stringify(courses));
    toast.success("Courses saved successfully!");
  };

  const handleExportPDF = () => {
    if (!gpaResult) {
      toast.warning("Add valid courses before exporting");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("GPA Calculation Report", 105, 15, { align: "center" });

    // Add grading system used
    doc.setFontSize(12);
    doc.text(
      `Grading System: ${gradingSystems[selectedGradingSystem].name}`,
      14,
      30
    );

    // Add GPA result and class
    doc.setFontSize(14);
    doc.text(`Overall GPA: ${gpaResult.gpa.toFixed(2)}`, 14, 40);
    doc.text(
      `Class Designation: ${getClassDesignation(gpaResult.gpa)}`,
      14,
      50
    );
    doc.text(`Total Credits: ${gpaResult.totalCredits}`, 14, 60);

    // Add course details in table
    const tableColumn = [
      "Course Name",
      "Credits",
      "Grade",
      "Semester",
      "Grade Points",
      "Quality Points",
    ];
    const tableRows = gpaResult.courses.map((course) => [
      course.name,
      course.credits,
      course.grade,
      course.semester || "1",
      course.gradePoints.toFixed(1),
      course.coursePoints.toFixed(1),
    ]);

    doc.autoTable({
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [74, 105, 189] },
    });

    // Add semester breakdown if available
    if (semesterResults && semesterResults.semesters.length > 1) {
      const semesterStartY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Semester Breakdown", 14, semesterStartY);

      const semesterTableColumn = ["Semester", "Courses", "Credits", "GPA"];
      const semesterTableRows = semesterResults.semesters.map((sem) => {
        const semResult = semesterResults.semesterResults[sem];
        return [
          `Semester ${sem}`,
          semResult.courses.length,
          semResult.totalCredits,
          semResult.gpa.toFixed(2),
        ];
      });

      // Add cumulative row
      semesterTableRows.push([
        "Cumulative",
        gpaResult.courses.length,
        gpaResult.totalCredits,
        gpaResult.gpa.toFixed(2),
      ]);

      doc.autoTable({
        startY: semesterStartY + 5,
        head: [semesterTableColumn],
        body: semesterTableRows,
        theme: "striped",
        headStyles: { fillColor: [106, 137, 204] },
      });
    }

    // Save the PDF
    doc.save(`GPA_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF exported successfully!");
  };

  const handleImportCourses = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedCourses = JSON.parse(e.target.result);

        if (Array.isArray(importedCourses) && importedCourses.length > 0) {
          setCourses(importedCourses);
          localStorage.setItem(
            "gpaCalculatorCourses",
            JSON.stringify(importedCourses)
          );
          toast.success("Courses imported successfully!");
        } else {
          toast.error("Invalid course data format");
        }
      } catch (error) {
        console.error("Error parsing imported file:", error);
        toast.error("Could not parse the uploaded file");
      }
    };

    reader.readAsText(file);

    // Reset the file input
    e.target.value = null;
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(courses);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `GPA_Courses_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Courses exported as JSON");
  };

  const toggleSemesterBreakdown = () => {
    setShowSemesterBreakdown(!showSemesterBreakdown);
  };

  return (
    <div className="gpa-calculator">
      <div className="card">
        <h2>Course Information</h2>

        <div className="form-group grading-system">
          <label htmlFor="gradingSystem">Select Grading System:</label>
          <select
            id="gradingSystem"
            value={selectedGradingSystem}
            onChange={handleGradingSystemChange}
          >
            {Object.keys(gradingSystems).map((key) => (
              <option key={key} value={key}>
                {gradingSystems[key].name}
              </option>
            ))}
          </select>
        </div>

        <div className="courses-container">
          <div className="courses-header">
            <div className="course-name-header">Course Name</div>
            <div className="credits-header">Credits</div>
            <div className="grade-header">Grade</div>
            <div className="semester-header">Semester</div>
            <div className="actions-header">Actions</div>
          </div>

          {courses.map((course) => (
            <div className="course-row" key={course.id}>
              <div className="course-name">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={course.name}
                  onChange={(e) =>
                    handleCourseChange(course.id, "name", e.target.value)
                  }
                />
              </div>

              <div className="credits">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) =>
                    handleCourseChange(course.id, "credits", e.target.value)
                  }
                />
              </div>

              <div className="grade">
                <select
                  value={course.grade}
                  onChange={(e) =>
                    handleCourseChange(course.id, "grade", e.target.value)
                  }
                >
                  <option value="">Select Grade</option>
                  {gradingSystems[selectedGradingSystem].grades.map((grade) => (
                    <option key={grade.grade} value={grade.grade}>
                      {grade.grade} ({grade.points})
                    </option>
                  ))}
                </select>
              </div>

              <div className="semester">
                <select
                  value={course.semester || "1"}
                  onChange={(e) =>
                    handleCourseChange(course.id, "semester", e.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num.toString()}>
                      Semester {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="actions">
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveCourse(course.id)}
                  aria-label="Remove course"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <button className="add-course-btn" onClick={handleAddCourse}>
            <FaPlus /> Add Course
          </button>
        </div>

        <div className="actions-container">
          <button className="btn save-btn" onClick={handleSaveCourses}>
            <FaSave /> Save Data
          </button>

          <label className="btn import-btn">
            <FaUpload /> Import Courses
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleImportCourses}
            />
          </label>

          <button className="btn export-btn" onClick={handleExportJSON}>
            <FaDownload /> Export Courses
          </button>

          <button className="btn pdf-btn" onClick={handleExportPDF}>
            <FaDownload /> Export PDF
          </button>
        </div>
      </div>

      {gpaResult && (
        <>
          <GPAResult
            gpaResult={gpaResult}
            semesterResults={semesterResults}
            toggleSemesterBreakdown={toggleSemesterBreakdown}
            showSemesterBreakdown={showSemesterBreakdown}
          />

          {showSemesterBreakdown && semesterResults && (
            <SemesterBreakdown
              semesterResults={semesterResults}
              overallGPA={gpaResult.gpa}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GPACalculator;
