import { Link } from "react-router-dom";

export default function ResourcesIndex() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Resources</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Educational Resources</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">शैक्षणिक संसाधन</p>
            <p className="section-heading__subtitle">A curated collection of educational materials, video lectures, career guidance, and technology-enhanced learning resources.</p>
          </div>
          <div className="card-grid--3 card-grid">
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">📚</div>
              <h3 className="icon-card__title">About Integrated B.Ed–M.Ed</h3>
              <p className="icon-card__desc">Syllabi, course outlines, practicum guides, and study materials for the Integrated B.Ed–M.Ed programme under NEP 2020.</p>
              <Link to="/resources/integrated-bed-med" className="btn btn--primary">Explore →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">🎬</div>
              <h3 className="icon-card__title">My Video Lectures</h3>
              <p className="icon-card__desc">Video lectures covering pedagogy, educational psychology, curriculum studies, and STEM teaching methodologies.</p>
              <Link to="/resources/video-lectures" className="btn btn--primary">Watch →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">🧭</div>
              <h3 className="icon-card__title">Career Guidance & Counselling</h3>
              <p className="icon-card__desc">Career maps, interview tips, competitive exam strategies, and mentoring resources for aspiring educators.</p>
              <Link to="/resources/career-guidance" className="btn btn--primary">Learn →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">💻</div>
              <h3 className="icon-card__title">EdTech Resources</h3>
              <p className="icon-card__desc">Tools, platforms, and proven strategies for integrating technology into classroom teaching and learning.</p>
              <Link to="/resources/edtech-resources" className="btn btn--primary">Discover →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">🏫</div>
              <h3 className="icon-card__title">Teacher Education Resources</h3>
              <p className="icon-card__desc">Professional development materials, NCTE guidelines, and resources for pre-service and in-service training.</p>
              <Link to="/resources/teacher-education" className="btn btn--primary">Access →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
