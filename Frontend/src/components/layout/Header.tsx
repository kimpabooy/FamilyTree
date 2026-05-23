import { Link } from "react-router-dom";
import logo from '../../assets/logo.png'

interface HeaderProps {
  onMenuToggle: () => void;
  onDarkModeToggle: () => void;
  darkMode: boolean;
}

export default function Header({ onMenuToggle, onDarkModeToggle, darkMode }: HeaderProps) {
  return (
    <header className="header">
      <button className="menu-toggle" onClick={onMenuToggle} aria-label="Öppna meny">
        <span /><span /><span />
      </button>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        
        <h1><img src={logo} alt="Family Tree Logo" />Family Tree</h1>
      </Link>
      <button className="dark-mode-toggle" onClick={onDarkModeToggle} aria-label="Toggle dark mode">
        {darkMode ? '☀️' : '🌙'}
      </button>
    </header>
  );
}