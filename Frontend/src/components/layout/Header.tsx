import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../Ui/Button";
import { isLoggedIn, logout } from "../../services/AuthService";

interface HeaderProps {
  onMenuToggle: () => void;
  onDarkModeToggle: () => void;
  darkMode: boolean;
}

export default function Header({
  onMenuToggle,
  onDarkModeToggle,
  darkMode,
}: HeaderProps) {
  const navigate  = useNavigate();
  const loggedIn  = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Vänster zon */}
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={onMenuToggle}
          aria-label="Öppna meny"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mitten zon — alltid centrerad */}
      <Link to="/" className="header-logo-link">
        <img src={logo} alt="Family Tree Logo" />
        <h1>Family Tree</h1>
      </Link>

      {/* Höger zon */}
      <div className="header-right">
        <nav className="header-auth-nav">
          {loggedIn ? (
            /* Inloggad — visa bara "Logga ut" */
            <Button
              label="Logga ut"
              variant="secondary"
              onClick={handleLogout}
            />
          ) : (
            /* Utloggad — visa "Logga in" + "Skapa konto" */
            <>
              <Button
                label="Logga in"
                variant="secondary"
                onClick={() => navigate("/login")}
              />
              <Button
                label="Skapa konto"
                variant="primary"
                onClick={() => navigate("/login")}
              />
            </>
          )}
        </nav>
        <button
          className="dark-mode-toggle"
          onClick={onDarkModeToggle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}