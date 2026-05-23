import '../App.css'
export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
            <div>
                <h2>Family Tree</h2>
                <p>Bevara familjehistoria för framtida generationer.</p>
            </div>
            <div>
                <h2>Om projektet</h2>
                <p>
                    En plattform för att dokumentera och bevara familjehistorian för framtida generationer.
                </p>
            </div>
            <div>
                <h2>Kontakt</h2>
                <p>
                    <b>Namn:</b> Kim Andersson <br />
                    <b>Adress:</b> Storgatan 51, 311 31 Falkenberg <br />
                    <b>Email:</b>{' '}
                    <a href="mailto: kim.andersson.dev@gmail.com">
                        kim.andersson.dev@gmail.com
                    </a>
                </p>
            </div>
            <p className="copyright">
                &copy; {currentYear} FamilyTree - Made with ❤️ by Kim Andersson
            </p>
        </footer>
  )
}