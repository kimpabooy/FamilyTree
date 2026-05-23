// sidepanel.tsx
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  return (
    <>
      <div
        className={`side-panel-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`side-panel ${isOpen ? 'open' : ''}`}>
        <img src={logo} alt="Logo" />
        <h2>Side Panel</h2>
        <ul>
          <li><Link to="/" onClick={onClose}>Home</Link></li>
          <li><Link to="/familytree" onClick={onClose}>Family Tree</Link></li>
          <li><Link to="/about" onClick={onClose}>About</Link></li>
          <li><Link to="/contact" onClick={onClose}>Contact</Link></li>
        </ul>
      </aside>
    </>
  );
}