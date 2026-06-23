import { Link } from "react-router-dom";

export default function ResearchProfile() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Research Profile</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Research Profile</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">शोध प्रोफ़ाइल</p>
            <p className="section-heading__subtitle">Exploring the intersections of teacher education, pedagogy, and Indian Knowledge Systems.</p>
          </div>

          <div className="card-grid card-grid--2">
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">📄</div>
              <h3 className="icon-card__title">Curriculum Vitae</h3>
              <p className="icon-card__desc">View my complete academic CV with education, positions held, publications, awards, and professional activities.</p>
              <Link to="/research/cv" className="btn btn--primary">View CV →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">💼</div>
              <h3 className="icon-card__title">Experience</h3>
              <p className="icon-card__desc">Detailed overview of my academic, teaching, and research experience across institutions.</p>
              <Link to="/research/experience" className="btn btn--primary">View Experience →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
