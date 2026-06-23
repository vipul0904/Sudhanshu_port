import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile, subscribeToStore } from "../../lib/dataStore";
import type { ProfileData } from "../../lib/dataStore";

export default function Footer() {
  const [profile, setProfile] = useState<ProfileData>(getProfile());

  useEffect(() => {
    // Subscribe to store updates (e.g. from Admin save)
    return subscribeToStore((store) => {
      setProfile(store.profile);
    });
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__brand">
          <h3 className="footer__brand-name">Sudhanshu</h3>
          <p className="footer__brand-desc">Educator, researcher, and knowledge enthusiast dedicated to advancing teacher education and integrating Indian Knowledge Systems with modern pedagogy.</p>
        </div>
        <div>
          <h4 className="footer__heading">Quick Links</h4>
          <div className="footer__links">
            <Link to="/">→ Home</Link>
            <Link to="/pages/publications.html">→ Publications</Link>
            <Link to="/pages/research/index.html">→ Research Profile</Link>
            <Link to="/pages/blogs/index.html">→ Blogs</Link>
          </div>
        </div>
        <div>
          <h4 className="footer__heading">Resources</h4>
          <div className="footer__links">
            <Link to="/pages/resources/integrated-bed-med.html">→ About Integrated B.Ed–M.Ed</Link>
            <Link to="/pages/resources/video-lectures.html">→ Video Lectures</Link>
            <Link to="/pages/resources/edtech-resources.html">→ EdTech</Link>
            <Link to="/pages/resources/teacher-education.html">→ Teacher Ed.</Link>
          </div>
        </div>
        <div>
          <h4 className="footer__heading">Connect</h4>
          <div className="footer__links">
            <Link to="/pages/contact.html">→ Contact Me</Link>
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">→ LinkedIn</a>
            )}
            {profile.socials.twitter && (
              <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer">→ X (Twitter)</a>
            )}
            {profile.socials.instagram && (
              <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer">→ Instagram</a>
            )}
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2026 Sudhanshu. All rights reserved. | Designed BY Vipul & Harsh for education | <Link to="/admin" style={{ color: "var(--saffron-light)", fontWeight: 600 }}>Admin Portal</Link></p>
        </div>
      </div>
    </footer>
  );
}
