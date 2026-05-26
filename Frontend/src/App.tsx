import "./App.css";
import Footer from "./components/layout/Footer.tsx";
import Header from "./components/layout/Header.tsx";
import SidePanel from "./components/layout/sidepanel.tsx";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx.tsx";
import Familytree from "./pages/Familytree.tsx";
import { useState } from "react";
import CreateFamily from "./pages/CreateFamily.tsx";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Header
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        onDarkModeToggle={() => setDarkMode((prev) => !prev)}
        darkMode={darkMode}
      />
      <SidePanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/familytree" element={<Familytree />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/familytree/new" element={<CreateFamily />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
