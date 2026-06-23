import { Link } from "react-router-dom";

export default function Publications() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Publications</li>
        </ol></nav>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Publications</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">प्रकाशन</p>
            <p className="section-heading__subtitle">Research papers, journal articles, and book chapters in education, pedagogy, and STEM.</p>
          </div>


          <div className="pub-item animate-on-scroll">
            <h3 className="pub-item__title">
              <a href="https://doi.org/10.1177/02704676251353105" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', transition: 'color var(--transition-fast)' }} className="pub-title-hover">
                Is ChatGPT the future of academic writing? A sequential explanatory study to explore generative conversational AI as an academic writing support tool for research scholars
              </a>
            </h3>
            <p className="pub-item__authors">A Anthony, S Sharma, <strong>S Sharma</strong></p>
            <p className="pub-item__journal">Bulletin of Science, Technology &amp; Society, 45 (1-2), pp. 23–39 (2025)</p>
            <div className="pub-item__links">
              <a href="https://doi.org/10.1177/02704676251353105" target="_blank" rel="noopener noreferrer" className="pub-item__link">View Paper →</a>
            </div>
          </div>

          <div className="pub-item animate-on-scroll">
            <h3 className="pub-item__title">
              <a href="https://library.apsce.net/index.php/ICCE/article/view/6083" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', transition: 'color var(--transition-fast)' }} className="pub-title-hover">
                Towards Pedagogical Design Thinking: Exploring the Role of Scaffolding in Pre-Service Teachers Development as Learning Designer
              </a>
            </h3>
            <p className="pub-item__authors"><strong>S SHARMA</strong></p>
            <p className="pub-item__journal">Proceedings of the 33rd International Conference on Computers in Education (ICCE 2025)</p>
            <div className="pub-item__links">
              <a href="https://library.apsce.net/index.php/ICCE/article/view/6083" target="_blank" rel="noopener noreferrer" className="pub-item__link">View Paper →</a>
            </div>
          </div>


          <div className="pub-item animate-on-scroll">
            <h3 className="pub-item__title">
              <a href="https://doi.org/10.1021/acs.jpcb.4c03947" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', transition: 'color var(--transition-fast)' }} className="pub-title-hover">
                Anomalous Fluorescence Quenching in Fluorous Solvent-Added Media
              </a>
            </h3>
            <p className="pub-item__authors">Deepika, <strong>S Sharma</strong>, D Yadav, S Pandey</p>
            <p className="pub-item__journal">The Journal of Physical Chemistry B, 128 (34), pp. 8194–8206 (2024)</p>
            <div className="pub-item__links">
              <a href="https://doi.org/10.1021/acs.jpcb.4c03947" target="_blank" rel="noopener noreferrer" className="pub-item__link">View Paper →</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
