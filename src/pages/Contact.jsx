
import { useNavigate } from "react-router-dom";
import "./Contact.css";
import logo from "../assets/homeservice-logo.jpg";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="contact-brand">
          <img src={logo} alt="Home Service Logo" />
          <div>
            <h2>Home Service</h2>
            <p>We're here to help you</p>
          </div>
        </div>

        <button
          className="contact-home-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </header>

      <main className="contact-main">
        <section className="contact-hero">
          <span>GET IN TOUCH</span>
          <h1>How can we help you?</h1>
          <p>
            Have questions about a service or booking? Contact our team
            and we'll help you find the right solution for your home.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-details">
            <h2>Contact Information</h2>
            <p>
              Reach out to us for assistance with services, bookings,
              or general enquiries.
            </p>

            <div className="contact-detail-card">
              <div className="contact-icon">✉</div>
              <div>
                <h3>Email Support</h3>
                <p>Contact us for booking and service enquiries.</p>
                <span>Use the form to send your message.</span>
              </div>
            </div>

            <div className="contact-detail-card">
              <div className="contact-icon">⌂</div>
              <div>
                <h3>Home Service Support</h3>
                <p>Questions about our household services?</p>
                <span>We're happy to help you.</span>
              </div>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();

              const form = event.currentTarget;
              const formData = new FormData(form);

              const name = formData.get("name");
              const email = formData.get("email");
              const subject = formData.get("subject");
              const message = formData.get("message");

              const mailtoLink =
                `mailto:?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(
                  `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                )}`;

              window.location.href = mailtoLink;
            }}
          >
            <h2>Send Us a Message</h2>
            <p>Fill in the details below to contact our team.</p>

            <label htmlFor="contact-name">Full Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
            />

            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="What do you need help with?"
              required
            />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              placeholder="Write your message here..."
              required
            />

            <button type="submit" className="contact-submit-btn">
              Send Message →
            </button>

            <p className="contact-form-note">
              This opens your default email application with your message
              prepared. It does not send the message automatically.
            </p>
          </form>
        </section>
      </main>

      <footer className="contact-footer">
        <img src={logo} alt="" />
        <strong>Home Service</strong>
        <span>Making everyday home care simpler.</span>
      </footer>
    </div>
  );
}
