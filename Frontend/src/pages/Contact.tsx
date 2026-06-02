import qrLinkedIn from "../assets/qr-linkedin-icon.png";
import qrGitHub from "../assets/qr-github-icon.png";
import qrInstagram from "../assets/qr-instagram-icon.png";
import picture from "../assets/picture.jpg";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <img className="contact-image" src={picture} alt="Profile picture" />
        <div className="contact-info">
          <h1>Kontakt</h1>
          <p>Ta kontakt med mig!</p>
          <p>
            <b>Namn:</b> Kim Andersson <br />
            <b>Adress:</b> Storgatan 51, 311 31 Falkenberg <br />
            <b>Email:</b>{" "}
            <a href="mailto:kim.andersson.dev@gmail.com">
              kim.andersson.dev@gmail.com
            </a>
          </p>
        </div>

        <div className="contact-social">
          <h2>Sociala medier</h2>

          <div className="social-list">
            <div className="social-item">
              <a
                href="https://www.linkedin.com/in/kim-andersson-dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <img src={qrLinkedIn} alt="QR code for LinkedIn" />
            </div>

            <div className="social-item">
              <a
                href="https://github.com/kimpabooy"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <img src={qrGitHub} alt="QR code for GitHub" />
            </div>
            <div className="social-item">
              <a
                href="https://www.instagram.com/kimpabooy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <img src={qrInstagram} alt="QR code for Instagram" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
