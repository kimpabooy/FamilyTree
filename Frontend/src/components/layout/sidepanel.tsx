import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { isLoggedIn, logout } from "../../services/AuthService";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  return (
    <>
      <div
        className={`side-panel-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`side-panel ${isOpen ? "open" : ""}`}>
        <img src={logo} alt="Logo" />
        <h2>Side Panel</h2>
        <ul>
          <li><Link to="/" onClick={onClose}>Hem</Link></li>
          <li><Link to="/familytree" onClick={onClose}>Familjeträd</Link></li>
          <li><Link to="/about" onClick={onClose}>Om sidan</Link></li>
          <li><Link to="/contact" onClick={onClose}>Kontakt</Link></li>
        </ul>

        {/* Auth-knappar — speglar headerns logik */}
        <div className="side-panel-auth">
          {loggedIn ? (
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logga ut
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => handleNav("/login")}
              >
                Logga in
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleNav("/login")}
              >
                Skapa konto
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}