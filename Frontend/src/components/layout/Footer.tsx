import '../../App.css'
export default function Footer() {

const currentYear = new Date().getFullYear();

return (
    <footer className="footer">
        <p className="copyright"> &copy; {currentYear} FamilyTree - Made with <img className="heart" src="../src/assets/heart.png" alt="heart" /> by Kim Andersson</p>
    </footer>
    )
}