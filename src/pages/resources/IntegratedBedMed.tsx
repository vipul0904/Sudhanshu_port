import { useState } from "react";
import { Link } from "react-router-dom";

interface InstitutionGroup {
  category: string;
  icon: string;
  institutions: string[];
}

const institutionGroups: InstitutionGroup[] = [
  {
    category: "Central / National Institutions",
    icon: "🏛️",
    institutions: [
      "Regional Institute of Education (RIE), NCERT, Bhopal",
      "Tata Institute of Social Sciences (TISS), Mumbai",
      "Central University of Kashmir, Ganderbal, Srinagar",
      "Mahatma Gandhi Antarrashtriya Hindi Vishwavidyalaya (MGAHV), Wardha"
    ]
  },
  {
    category: "State Universities",
    icon: "🎓",
    institutions: [
      "Indian Institute of Teacher Education (IITE), Gandhinagar",
      "Fakir Mohan University, Balasore, Odisha",
      "North Orissa University (Maharaja Sriram Chandra Bhanja Deo University), Odisha",
      "Sambalpur University, Odisha",
      "Shivaji University, Kolhapur"
    ]
  },
  {
    category: "Government Colleges / Institutes",
    icon: "🏫",
    institutions: [
      "Government College of Education, Jammu",
      "Government College of Education (IASE), Srinagar",
      "Rajendra College (Autonomous), Balangir"
    ]
  },
  {
    category: "Private Universities / Colleges",
    icon: "🧱",
    institutions: [
      "Lovely Professional University (LPU), Phagwara/Kapurthala, Punjab",
      "Sai Nath University, Ranchi",
      "Khalsa College of Education, Amritsar",
      "Kirorimal College of Education, Sonipat, Haryana"
    ]
  }
];

interface RegulatoryDoc {
  title: string;
  url: string;
}

interface RegulatoryCategory {
  category: string;
  icon: string;
  documents: RegulatoryDoc[];
}

const regulatoryCategories: RegulatoryCategory[] = [
  {
    category: "NCTE Gazette Notifications on Teacher Eligibility & TET Compliance",
    icon: "📜",
    documents: [
      { title: "Gazette Notification: Preamble", url: "https://drive.google.com/file/d/1qy-x67n82e_E1F3U87au1mprhZvcM0Sb/view?usp=drive_link" },
      { title: "Gazette Notification: Teacher Eligibility", url: "https://drive.google.com/file/d/133ZKO2onAxmzKiuODoXR23kC7omXhmKV/view?usp=drive_link" },
      { title: "Gazette Notification: Primary", url: "https://drive.google.com/file/d/1ez4OocVFhEQpN-gfY0YDFZ8E6VVq0Uq9/view?usp=drive_link" },
      { title: "Gazette Notification: Appendix 14", url: "https://drive.google.com/file/d/1zvPVaJyIv8M29WEkdC9V4IXhrMFwSSM7/view?usp=drive_link" }
    ]
  },
  {
    category: "Integrated B.Ed.–M.Ed. University Ordinance & Program Bifurcation Documents",
    icon: "🏫",
    documents: [
      { title: "University Ordinance & Guidelines", url: "https://drive.google.com/file/d/1aXim3_HWstVJLTbcv8dN5oaUy1Pnlt30/view?usp=drive_link" },
      { title: "Program Bifurcation Framework", url: "https://drive.google.com/file/d/1FRGNvVEgqboiimfMEoGTjQuh_nRicrHn/view?usp=drive_link" }
    ]
  },
  {
    category: "Master’s Degree Equivalence Certification",
    icon: "🎓",
    documents: [
      { title: "Equivalence Certification Document", url: "https://drive.google.com/file/d/1UIttby1ollN8PJDeURbprEwXcSRDGyrR/view?usp=drive_link" }
    ]
  },
  {
    category: "Delhi High Court WP(C) 3940/2020 – Petition & Final Judgment",
    icon: "⚖️",
    documents: [
      { title: "Writ Petition Filed Copy (WP(C) 3940/2020)", url: "https://drive.google.com/file/d/1W8Pano5iWZwBWoO0558v1-Leh7QRIGcU/view" },
      { title: "Delhi High Court Final Judgment & Order", url: "https://drive.google.com/file/d/1SlrfjGYNX3_y4p38OxGbriBYHqW0UDbO/view" }
    ]
  },
  {
    category: "Central Information Commission (CIC) Orders & Decisions",
    icon: "🏛️",
    documents: [
      { title: "CIC Decision & Order: NCTE-1", url: "https://drive.google.com/file/d/1THBtPc9uwLm85vd7rR4y90-mF-5LuTcz/view?usp=drive_link" },
      { title: "CIC Decision & Order: NCTE-2", url: "https://drive.google.com/file/d/1e_CARld4wKziLeNHCPJwCLCCbHWnGHHs/view?usp=drive_link" },
      { title: "CIC Decision & Order: UGC", url: "https://drive.google.com/file/d/1JjDwNzXz7kRief9F7rEqCZmxWm2c4nGN/view?usp=drive_link" }
    ]
  },
  {
    category: "NCTE & University Recognition Letters for RIE Bhopal",
    icon: "🏢",
    documents: [
      { title: "NCTE Recognition Order", url: "https://drive.google.com/file/d/1tc8bxzCSyxIWv0Ad-M3VxNGYAo9nS9b4/view?usp=drive_link" },
      { title: "University Affiliation (Old)", url: "https://drive.google.com/file/d/1p1cI_1HuMzv24sT6TyPMqbXPSYnZ38pF/view?usp=drive_link" },
      { title: "University Affiliation (Renewal)", url: "https://drive.google.com/file/d/1PySdEKLiPI5rBFB-glGnVUGc1MfJ1Ojk/view?usp=drive_link" }
    ]
  }
];

export default function IntegratedBedMed() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        .institutions-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--space-4) var(--space-6);
          background-color: var(--teal-pale);
          border: 2px solid var(--teal);
          border-radius: var(--radius-lg);
          cursor: pointer;
          text-align: left;
          margin-top: var(--space-8);
          margin-bottom: var(--space-6);
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }
        .institutions-toggle-btn:hover {
          background-color: var(--teal-pale) !important;
          border-color: var(--saffron) !important;
          box-shadow: var(--shadow-md) !important;
          transform: translateY(-2px);
        }
        .institutions-toggle-btn:active {
          transform: translateY(0);
        }
        .institutions-container {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: var(--white);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          margin-bottom: var(--space-8);
          box-shadow: var(--shadow-md);
        }
        .institution-card {
          background-color: var(--cream);
          border-left: 4px solid var(--saffron);
          border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-5);
          box-shadow: var(--shadow-xs);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .institution-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
        }
        .regulatory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-6);
          margin-top: var(--space-6);
        }
        .regulatory-card {
          background-color: var(--white);
          border: 1px solid var(--border-light);
          border-top: 4px solid var(--teal);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .regulatory-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-medium);
        }
        .regulatory-card__header {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }
        .regulatory-card__icon {
          font-size: var(--text-2xl);
          background-color: var(--teal-pale);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--teal-deep);
          border: 1px solid rgba(31, 111, 139, 0.15);
        }
        .regulatory-card__title {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--teal-deep);
          line-height: 1.4;
          margin: 0;
          padding-top: var(--space-1);
        }
        .regulatory-card__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          flex-grow: 1;
        }
        .regulatory-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3) var(--space-4);
          background-color: var(--cream);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--saffron-deep);
          font-weight: 600;
          font-size: var(--text-sm);
          text-decoration: none;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-xs);
        }
        .regulatory-link:hover {
          background-color: var(--saffron-pale);
          color: var(--saffron-deep);
          border-color: var(--saffron);
          transform: translateX(4px);
        }
      `}</style>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/resources">Resources</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">About Integrated B.Ed–M.Ed</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Integrated B.Ed–M.Ed</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">एकीकृत बीएड-एमएड</p>
          </div>

          <div className="content-section animate-on-scroll">
            <h2>About the Programme</h2>
            <p>The Integrated B.Ed.-M.Ed. is a three-year full-time postgraduate dual-degree professional programme in Education designed to prepare future teachers, teacher educators, and other educational professionals. The programme integrates foundational teacher education with advanced studies in educational research, leadership, and policy, providing a seamless pathway for learners without requiring separate B.Ed. and M.Ed. degrees. There is no provision for intermediate exit before completion of the programme.</p>
            <p>The programme aims to prepare competent professionals capable of contributing to diverse areas of education, including teaching, curriculum development, educational planning, policy analysis, school leadership, administration, supervision, and research. By integrating professional preparation with advanced educational studies, the programme enables students to develop both practical teaching competencies and research skills within a structured academic framework. Successful completion of the programme leads to the award of an Integrated B.Ed.-M.Ed. degree.</p>

            <h3>Key Features</h3>
            <ul>
              <li><strong>Duration:</strong> 3 years (Full-time)</li>
              <li><strong>Integrated Structure:</strong> Combines B.Ed. and M.Ed. into a single programme, reducing the overall duration compared to pursuing the degrees separately.</li>
              <li><strong>Comprehensive Curriculum:</strong> Includes teaching pedagogy, educational psychology, curriculum studies, educational research, and dissertation work.</li>
              <li><strong>School Internship:</strong> Provides structured and intensive school internship experiences for practical teaching exposure.</li>
              <li><strong>Research Orientation:</strong> Offers opportunities for engaging in educational research and scholarly inquiry.</li>
              <li><strong>Career Opportunities:</strong> Prepares graduates for professional roles such as:
                <ul>
                  <li>Teacher Educator</li>
                  <li>Curriculum Developer</li>
                  <li>Educational Policy Analyst</li>
                  <li>School Principal/Administrator</li>
                  <li>Educational Planner and Supervisor</li>
                  <li>Researcher in Education</li>
                </ul>
              </li>
            </ul>

            <h3>Eligibility</h3>
            <ul>
              <li>Candidates should possess a Postgraduate degree in Sciences, Social Sciences, or Humanities from a recognized institution with a minimum of 55% marks or an equivalent grade, in accordance with NCTE Regulations, 2014.</li>
              <li>Reservation and relaxation for SC/ST/OBC/PwD/EWS and other categories shall be applicable as per the Government of India/State Government norms.</li>
              <li>Admission to the programme shall be based on the prescribed selection process of the University or through the Combined University Entrance Test (Postgraduate) [CUET (PG)] conducted by the National Testing Agency (NTA).</li>
              <li><strong>CUET (PG) Test Paper Code:</strong> COQP03</li>
            </ul>

            <h2>Programme Structure</h2>
            <p>The Integrated B.Ed.-M.Ed. Programme is structured as a three-year full-time programme spread across six semesters, integrating the curricular components of both B.Ed. and M.Ed. within a unified framework. The programme follows a progressive and spiral structure where foundational understanding of teaching and learning gradually advances toward teacher education, research, specialization, and professional practice. The curriculum combines theoretical foundations, pedagogical preparation, field engagement, school internships, teacher education components, and research experiences, ensuring the development of both teaching competencies and advanced educational expertise.</p>

            <p>For ease of understanding, the programme may be viewed through two complementary components:</p>

            <h3>B.Ed. Component (Professional Teacher Preparation)</h3>
            <p>The B.Ed. component focuses on developing competencies required for effective teaching and school engagement through:</p>
            <ul>
              <li>Foundations of Education and Educational Psychology</li>
              <li>Pedagogy of School Subjects</li>
              <li>School Internship and Field Experiences</li>
              <li>Curriculum and Assessment Studies</li>
              <li>Community Engagement and School-Based Activities</li>
              <li>Practical teaching experiences and professional skill development</li>
            </ul>

            <h3>M.Ed. Component (Advanced Studies and Research)</h3>
            <p>The M.Ed. component focuses on advanced understanding of education and preparation for professional roles in teacher education through:</p>
            <ul>
              <li>Educational Research Methods and Dissertation Work</li>
              <li>Teacher Education Studies</li>
              <li>Educational Leadership and Policy Perspectives</li>
              <li>Theme-based Specialization Areas</li>
              <li>Research Seminars and Academic Writing</li>
              <li>Advanced educational inquiry and professional development</li>
            </ul>

            <p>Together, these integrated components prepare learners for careers as school teachers, teacher educators, curriculum developers, educational administrators, policy analysts, and researchers in the field of Education.</p>

            {/* Interactive Collapsible Institutions Section */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="institutions-toggle-btn"
              aria-expanded={isOpen}
            >
              <span style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)', 
                fontWeight: '700',
                color: 'var(--teal-deep)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                🏛️ Institutions/Universities Offering Integrated B.Ed.-M.Ed.
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition-base)',
                color: 'var(--teal-deep)'
              }}>
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="institutions-container">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-6)',
                }}>
                  {institutionGroups.map((group, index) => (
                    <div 
                      key={index}
                      className="institution-card"
                    >
                      <h4 style={{
                        color: 'var(--teal-deep)',
                        fontSize: 'var(--text-base)',
                        marginBottom: 'var(--space-3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        borderBottom: '1px solid var(--cream-dark)',
                        paddingBottom: 'var(--space-2)',
                        fontWeight: '700'
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>{group.icon}</span>
                        <span>{group.category}</span>
                      </h4>
                      <ul style={{ 
                        listStyle: 'none', 
                        paddingLeft: 0,
                        margin: 0,
                      }}>
                        {group.institutions.map((inst, i) => (
                          <li 
                            key={i}
                            style={{
                              fontSize: 'var(--text-sm)',
                              color: 'var(--charcoal-light)',
                              padding: 'var(--space-2) 0',
                              borderBottom: i === group.institutions.length - 1 ? 'none' : '1px dashed rgba(211, 84, 0, 0.08)',
                              lineHeight: '1.4',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--space-2)',
                            }}
                          >
                            <span style={{ color: 'var(--saffron-deep)', fontSize: '0.8rem', marginTop: '2px' }}>🔸</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 style={{ marginTop: 'var(--space-8)' }}>Official Regulatory Notifications</h3>
            
            <div className="regulatory-grid">
              {regulatoryCategories.map((cat, index) => (
                <div key={index} className="regulatory-card animate-on-scroll">
                  <div className="regulatory-card__header">
                    <div className="regulatory-card__icon">{cat.icon}</div>
                    <h4 className="regulatory-card__title">{cat.category}</h4>
                  </div>
                  <ul className="regulatory-card__list">
                    {cat.documents.map((doc, docIdx) => (
                      <li key={docIdx} className="regulatory-card__item">
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="regulatory-link"
                        >
                          <span>📄</span>
                          <span>{doc.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
