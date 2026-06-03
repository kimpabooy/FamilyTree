import "../../App.css";
import heartiIcon from "../../assets/heart.png";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="copyright">
        {" "}
        &copy; {currentYear} Familjearkivet - Made with{" "}
        <img className="heart" src={heartiIcon} alt="heart" /> by Kim Andersson
      </p>
    </footer>
  );
}
