import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { addMessage, getProfile, subscribeToStore } from "../lib/dataStore";
import type { ProfileData } from "../lib/dataStore";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(getProfile());

  useEffect(() => {
    // Subscribe to store updates (e.g. from Admin save)
    return subscribeToStore((store) => {
      setProfile(store.profile);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (name && email && subject && message) {
      addMessage(name, email, subject, message);
      setSubmitted(true);
    }
  };

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Contact</li>
        </ol></nav>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Get in Touch</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">संपर्क करें</p>
            <p className="section-heading__subtitle">I'd love to hear from you! Whether it's about research collaboration, guest lectures, or just a conversation about education.</p>
          </div>

          <div className="card-grid card-grid--2">
            {/* Contact Form */}
            <div className="content-section animate-on-scroll">
              <h2>Send a Message</h2>
              {submitted ? (
                <div id="contact-success" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--green)', fontWeight: 600, fontSize: 'var(--text-lg)' }}>
                  ✅ Thank you! Your message has been received. I'll get back to you soon.
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name *</label>
                    <input type="text" id="contact-name" name="name" required placeholder="Enter your full name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input type="email" id="contact-email" name="email" required placeholder="your.email@example.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject">Subject *</label>
                    <select id="contact-subject" name="subject" required>
                      <option value="">Select a topic...</option>
                      <option value="collaboration">Research Collaboration</option>
                      <option value="guest-lecture">Guest Lecture Invitation</option>
                      <option value="mentoring">Mentoring &amp; Guidance</option>
                      <option value="resources">Resource Request</option>
                      <option value="feedback">Feedback / Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Your Message *</label>
                    <textarea id="contact-message" name="message" required placeholder="Write your message here..."></textarea>
                  </div>
                  <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message ✉️</button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="animate-on-scroll">
              <div className="content-section" style={{ marginBottom: 'var(--space-6)' }}>
                <h2>Contact Information</h2>
                <div className="contact-info">
                  <div className="contact-item">
                    <div className="contact-item__icon">📧</div>
                    <div className="contact-item__text">
                      <h4>Email</h4>
                      <p><a href="mailto:sudhanshu.skrs@gmail.com" style={{ textDecoration: 'none', color: 'inherit' }}>sudhanshu.skrs@gmail.com</a></p>
                    </div>
                  </div>
                  {profile.address && (
                    <div className="contact-item">
                      <div className="contact-item__icon">📍</div>
                      <div className="contact-item__text">
                        <h4>Location</h4>
                        <p style={{ margin: 0 }}>
                          {profile.address.split("\n").map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="contact-item">
                      <div className="contact-item__icon">📱</div>
                      <div className="contact-item__text">
                        <h4>Phone</h4>
                        <p><a href={`tel:${profile.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>{profile.phoneDisplay}</a></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {Object.values(profile.socials).some(link => link) && (
                <div className="content-section">
                  <h2>Connect on Social Media</h2>
                  <div className="hero__social-icons" style={{ marginTop: 'var(--space-4)', justifyContent: 'flex-start', gap: 'var(--space-4)' }}>
                    {profile.socials.facebook && (
                      <a href={profile.socials.facebook} className="social-icon" title="Facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                    )}
                    {profile.socials.twitter && (
                      <a href={profile.socials.twitter} className="social-icon" title="X (Twitter)" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {profile.socials.instagram && (
                      <a href={profile.socials.instagram} className="social-icon" title="Instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                    {profile.socials.linkedin && (
                      <a href={profile.socials.linkedin} className="social-icon" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {profile.socials.youtube && (
                      <a href={profile.socials.youtube} className="social-icon" title="YouTube" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
