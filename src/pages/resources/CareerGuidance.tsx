import { Link } from "react-router-dom";

export default function CareerGuidance() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/resources">Resources</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Career Guidance & Counselling</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Career Guidance & Counselling</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">करियर मार्गदर्शन एवं परामर्श</p>
            <p className="section-heading__subtitle">Resources and guidance for building a rewarding career in education and academia.</p>
          </div>
          
          <style>{`
            @keyframes floatIcon {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-12px) rotate(3deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
          `}</style>

          <div className="coming-soon-container animate-on-scroll" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-12) var(--space-6)",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(232, 199, 123, 0.3)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            textAlign: "center",
            maxWidth: "680px",
            margin: "var(--space-8) auto 0 auto",
            position: "relative",
            overflow: "hidden"
          }}>
            <div className="coming-soon-icon" style={{
              fontSize: "4.5rem",
              marginBottom: "var(--space-4)",
              animation: "floatIcon 4s ease-in-out infinite",
              filter: "drop-shadow(0 8px 16px rgba(184, 92, 30, 0.15))",
              display: "inline-block"
            }}>
              🧭
            </div>
            
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-3xl)",
              background: "linear-gradient(135deg, var(--teal-deep), var(--saffron-deep))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "var(--space-6)",
              fontWeight: 800,
              letterSpacing: "-0.02em"
            }}>
              Coming Soon
            </h3>
            
            <Link to="/resources" className="btn btn--primary" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "var(--space-3) var(--space-6)",
              transition: "transform var(--transition-fast)"
            }}>
              ← Back to Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
