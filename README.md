# CampusGPA

A web application specifically designed for Sri Lankan university students to calculate their GPA with faculty-specific grading systems.

## Features

- Calculate GPA using the formula: GPA = (Sum of (Grade Points \* Credit Hours)) / Total Credit Hours
- Support for multiple Sri Lankan university grading scales and credit systems
- Input courses with names, grades, and credit hours
- Real-time calculation with instant results
- Save and export results as PDF
- Responsive design for all devices
- Dark/Light mode toggle
- Local storage to save student data between sessions
- Semester-wise and cumulative GPA calculation
- Import/Export functionality to backup and restore your course data

## Supported Grading Systems

- Standard Grading System
- Engineering Faculty
- Medical Faculty
- Science Faculty

## Technologies Used

- React.js - Frontend UI framework
- SCSS - Styling with nested rules and variables
- jsPDF - PDF generation
- React Icons - For UI icons
- React Toastify - For toast notifications
- LocalStorage - For saving user data

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/campus-gpa.git
cd campus-gpa
```

2. Install dependencies

```
npm install
```

3. Start the development server

```
npm start
```

The application will open at `http://localhost:3000`.

## Build for Production

```
npm run build
```

This will create an optimized production build in the `build` folder.

## How to Use

1. Select your appropriate grading system (Standard, Engineering, Medical, Science)
2. Add your courses with course name, credits, grade, and semester
3. The GPA will be calculated in real-time
4. Use the buttons at the bottom to save, import, export or generate PDF reports
5. Toggle semester breakdown to see semester-wise GPA and progression

## Future Enhancements

- Support for more faculty-specific grading systems
- Enhanced data visualization of academic progress
- Integration with university academic systems
- Custom grading system creator
- Goal setting and tracking
- Course recommendation based on GPA targets

## License

This project is licensed under the MIT License.

## Acknowledgments

- Developed for Sri Lankan university students
- Inspired by the need for a simple, accurate GPA calculation tool
