import qrLinkedIn from "../assets/qr-linkedin-icon.png";
import qrGitHub from "../assets/qr-github-icon.png";

export default function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact</h1>
      <p>Get in touch with me!</p>

      <div className="contact-card">
        <h2>Kontakt</h2>
        <p>
          <b>Namn:</b> Kim Andersson <br />
          <b>Adress:</b> Storgatan 51, 311 31 Falkenberg <br />
          <b>Email:</b>{" "}
          <a href="mailto:kim.andersson.dev@gmail.com">
            kim.andersson.dev@gmail.com
          </a>
        </p>

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
          </div>
        </div>
      </div>
    </div>
  );
}
