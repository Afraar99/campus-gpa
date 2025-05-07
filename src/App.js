import React, { useState, useEffect } from "react";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GPACalculator from "./components/GPACalculator";
import { toast } from "react-toastify";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved preference in local storage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.body.classList.add("dark-mode");
      toast.info("Dark mode enabled");
    } else {
      document.body.classList.remove("dark-mode");
      toast.info("Light mode enabled");
    }
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container">
        <GPACalculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
