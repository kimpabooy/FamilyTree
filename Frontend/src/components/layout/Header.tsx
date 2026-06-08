import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../Ui/Button";
import { isLoggedIn, logout, getDisplayName } from "../../services/AuthService";

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
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const displayName = getDisplayName();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
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

      <Link to="/" className="header-logo-link">
        <img src={logo} alt="Familjearkivet Logo" />
        <h1>Familjearkivet</h1>
      </Link>

      <div className="header-right">
        <nav className="header-auth-nav">
          {loggedIn ? (
            <>
              {displayName && (
                <span className="header-greeting">
                  Välkommen, {displayName}
                </span>
              )}
              <Button
                label="Logga ut"
                variant="secondary"
                onClick={handleLogout}
              />
            </>
          ) : (
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
          {darkMode ? "🌞" : "🌚"}
        </button>
      </div>
    </header>
  );
}
