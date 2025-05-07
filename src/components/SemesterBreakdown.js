import React from "react";
import { getClassDesignation } from "../utils/gpaUtils";
import "./SemesterBreakdown.scss";

const SemesterBreakdown = ({ semesterResults, overallGPA }) => {
  if (!semesterResults || !semesterResults.semesters) return null;

  const { semesters, semesterResults: results } = semesterResults;

  return (
    <div className="semester-breakdown card">
      <h2>Semester Breakdown</h2>

      <div className="breakdown-table">
        <div className="table-header">
          <div className="header-cell semester">Semester</div>
          <div className="header-cell">Courses</div>
          <div className="header-cell">Credits</div>
          <div className="header-cell">GPA</div>
          <div className="header-cell">Class</div>
        </div>

        {semesters.map((semester) => {
          const semResult = results[semester];
          return (
            <div className="table-row" key={semester}>
              <div className="table-cell semester">Semester {semester}</div>
              <div className="table-cell">{semResult.courses.length}</div>
              <div className="table-cell">{semResult.totalCredits}</div>
              <div className="table-cell gpa-cell">
                {semResult.gpa.toFixed(2)}
              </div>
              <div className="table-cell class-cell">
                {getClassDesignation(semResult.gpa)}
              </div>
            </div>
          );
        })}

        <div className="table-row cumulative">
          <div className="table-cell semester">Cumulative</div>
          <div className="table-cell">{results.cumulative.courses.length}</div>
          <div className="table-cell">{results.cumulative.totalCredits}</div>
          <div className="table-cell gpa-cell">{overallGPA.toFixed(2)}</div>
          <div className="table-cell class-cell">
            {getClassDesignation(overallGPA)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterBreakdown;
