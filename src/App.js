import React from "react";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GPACalculator from "./components/GPACalculator";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <GPACalculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
