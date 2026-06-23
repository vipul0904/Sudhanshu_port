import { Link } from "react-router-dom";

export default function Experience() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/research">Research Profile</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Experience</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Professional Experience</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">व्यावसायिक अनुभव</p>
            <p className="section-heading__subtitle">A journey through teaching, research, and academic leadership roles.</p>
          </div>
          <div className="experience-document animate-on-scroll" style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 var(--space-6)'}}>
            <img
              src="https://res.cloudinary.com/dxvbx80hw/image/upload/f_auto,q_auto,w_900/v1776116384/Research_Profile_260414_024528.jpg_uvmy6d.jpg"
              srcSet="https://res.cloudinary.com/dxvbx80hw/image/upload/f_auto,q_auto,w_480/v1776116384/Research_Profile_260414_024528.jpg_uvmy6d.jpg 480w,
                     https://res.cloudinary.com/dxvbx80hw/image/upload/f_auto,q_auto,w_768/v1776116384/Research_Profile_260414_024528.jpg_uvmy6d.jpg 768w,
                     https://res.cloudinary.com/dxvbx80hw/image/upload/f_auto,q_auto,w_900/v1776116384/Research_Profile_260414_024528.jpg_uvmy6d.jpg 900w"
              sizes="(max-width: 500px) 480px, (max-width: 800px) 768px, 900px"
              alt="Professional Experience — Sudhanshu Ravi Rajaram Sharma"
              style={{width:'100%',maxWidth:'900px',borderRadius:'10px',boxShadow:'0 6px 28px rgba(0,0,0,0.10)',border:'2.5px solid rgba(230,126,34,0.25)',outline:'3px solid rgba(230,126,34,0.08)',outlineOffset:'4px'}}
              loading="lazy"
            />
            <div style={{marginTop:'var(--space-6)',textAlign:'center'}}>
              <a href="https://res.cloudinary.com/dxvbx80hw/image/upload/fl_attachment/v1776116384/Research_Profile_260414_024528.jpg_uvmy6d.jpg" className="btn btn--primary" download style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
                Download Research Profile
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
