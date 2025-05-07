import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getClassDesignation } from "../utils/gpaUtils";
import "./GPAResult.scss";

const GPAResult = ({
  gpaResult,
  semesterResults,
  toggleSemesterBreakdown,
  showSemesterBreakdown,
}) => {
  if (!gpaResult) return null;

  const { gpa, totalCredits, totalPoints } = gpaResult;
  const hasMultipleSemesters =
    semesterResults && semesterResults.semesters.length > 1;

  return (
    <div className="gpa-result card">
      <h2>GPA Results</h2>

      <div className="result-container">
        <div className="gpa-display">
          <div className="gpa-value">
            <span>{gpa.toFixed(2)}</span>
          </div>
          <div className="gpa-label">Overall GPA</div>
        </div>

        <div className="gpa-details">
          <div className="detail-item">
            <span className="detail-label">Class Designation:</span>
            <span className="detail-value class">
              {getClassDesignation(gpa)}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Total Credits:</span>
            <span className="detail-value">{totalCredits}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Total Grade Points:</span>
            <span className="detail-value">{totalPoints.toFixed(2)}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Total Courses:</span>
            <span className="detail-value">{gpaResult.courses.length}</span>
          </div>

          {hasMultipleSemesters && (
            <button
              className="semester-toggle-btn"
              onClick={toggleSemesterBreakdown}
              aria-expanded={showSemesterBreakdown}
            >
              {showSemesterBreakdown ? (
                <>
                  <FaChevronUp /> Hide Semester Breakdown
                </>
              ) : (
                <>
                  <FaChevronDown /> Show Semester Breakdown
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPAResult;
