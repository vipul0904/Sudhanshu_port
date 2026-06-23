import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setOpenDropdown(openDropdown === name ? null : name);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/index.html";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar" aria-label="Main Navigation" ref={navRef}>
      <div className="container">
        <button 
          className={`navbar__hamburger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation" 
          aria-expanded={isOpen}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`navbar__menu ${isOpen ? 'open' : ''}`} role="menubar">
          <li className="navbar__item">
            <Link to="/" className={`navbar__link ${isActive("/") ? 'navbar__link--active' : ''}`} role="menuitem">Home</Link>
          </li>
          <li className={`navbar__item ${openDropdown === 'research' ? 'open' : ''}`}>
            <Link to="/pages/research/index.html" className={`navbar__link ${isActive("/pages/research") ? 'navbar__link--active' : ''}`} role="menuitem" data-dropdown aria-haspopup="true" onClick={(e) => toggleDropdown(e, 'research')}>
              Research Profile <span className="arrow">▼</span>
            </Link>
            <div className="navbar__dropdown" role="menu">
              <Link to="/pages/research/cv.html" className="navbar__dropdown-link" role="menuitem">CV</Link>
              <Link to="/pages/research/experience.html" className="navbar__dropdown-link" role="menuitem">Experience</Link>
            </div>
          </li>
          <li className={`navbar__item ${openDropdown === 'resources' ? 'open' : ''}`}>
            <Link to="/pages/resources/index.html" className={`navbar__link ${isActive("/pages/resources") ? 'navbar__link--active' : ''}`} role="menuitem" data-dropdown aria-haspopup="true" onClick={(e) => toggleDropdown(e, 'resources')}>
              Resources <span className="arrow">▼</span>
            </Link>
            <div className="navbar__dropdown" role="menu">
              <Link to="/pages/resources/integrated-bed-med.html" className="navbar__dropdown-link" role="menuitem">Integrated BEd–MEd Docs</Link>
              <Link to="/pages/resources/video-lectures.html" className="navbar__dropdown-link" role="menuitem">My Video Lectures</Link>
              <Link to="/pages/resources/career-guidance.html" className="navbar__dropdown-link" role="menuitem">Career Guidance & Counselling</Link>
              <Link to="/pages/resources/edtech-resources.html" className="navbar__dropdown-link" role="menuitem">EdTech Resources</Link>
              <Link to="/pages/resources/teacher-education.html" className="navbar__dropdown-link" role="menuitem">Teacher Education Resources</Link>
            </div>
          </li>
          <li className={`navbar__item ${openDropdown === 'blogs' ? 'open' : ''}`}>
            <Link to="/pages/blogs/index.html" className={`navbar__link ${isActive("/pages/blogs") ? 'navbar__link--active' : ''}`} role="menuitem" data-dropdown aria-haspopup="true" onClick={(e) => toggleDropdown(e, 'blogs')}>
              Blogs <span className="arrow">▼</span>
            </Link>
            <div className="navbar__dropdown" role="menu">
              <Link to="/pages/blogs/stem-blogs.html" className="navbar__dropdown-link" role="menuitem">STEM Blogs</Link>
              <Link to="/pages/blogs/guest-posts.html" className="navbar__dropdown-link" role="menuitem">Guest Posts</Link>
              <Link to="/pages/blogs/poetry-thoughts.html" className="navbar__dropdown-link" role="menuitem">Poetry & Thoughts</Link>
            </div>
          </li>
          <li className="navbar__item">
            <Link to="/pages/publications.html" className={`navbar__link ${isActive("/pages/publications.html") ? 'navbar__link--active' : ''}`} role="menuitem">Publications</Link>
          </li>
          <li className="navbar__item">
            <Link to="/pages/internship-diaries.html" className={`navbar__link ${isActive("/pages/internship-diaries.html") ? 'navbar__link--active' : ''}`} role="menuitem">Internship Diaries</Link>
          </li>
          <li className="navbar__item">
            <Link to="/pages/contact.html" className={`navbar__link ${isActive("/pages/contact.html") ? 'navbar__link--active' : ''}`} role="menuitem">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
