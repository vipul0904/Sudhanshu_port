import { Link } from "react-router-dom";

export default function CV() {
  return (
    <>
      <style>{`
        .cv-wrap{max-width:100%;margin:0 auto;background:var(--white,#fff);border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;border:1px solid rgba(230,126,34,0.12)}
        .cv-header-card{display:flex;gap:1.75rem;align-items:flex-start;padding:2rem 2.5rem 1.5rem;border-bottom:2px solid rgba(230,126,34,0.12);background:linear-gradient(135deg,#FAF3E0 0%,#fff 100%)}
        .cv-avatar{width:88px;height:88px;border-radius:50%;border:3px solid rgba(230,126,34,0.3);flex-shrink:0;object-fit:cover}
        .cv-name{font-size:26px;font-weight:700;letter-spacing:-0.5px;margin-bottom:3px;color:var(--teal-deep,#1F6F8B);font-family:var(--font-display)}
        .cv-title-label{font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--saffron-deep,#D35400);margin-bottom:10px}
        .cv-contacts{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:#555;margin-bottom:10px}
        .cv-contacts span{display:flex;align-items:center;gap:5px}
        .cv-bio{font-size:13.5px;color:#555;line-height:1.75;font-style:italic}
        .cv-grid{display:grid;grid-template-columns:230px 1fr}
        .cv-left{background:#FAF8F3;border-right:1px solid rgba(230,126,34,0.1);padding:1.75rem 1.5rem}
        .cv-right{padding:1.75rem 2rem}
        .cv-sec{margin-bottom:1.75rem}
        .cv-sec-title{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--saffron-deep,#D35400);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(230,126,34,0.15)}
        .cv-tag{display:inline-block;background:#fff;border:1px solid rgba(230,126,34,0.2);border-radius:20px;font-size:12px;padding:3px 10px;margin:3px 2px 3px 0;color:#333}
        .award-tag{display:inline-block;background:rgba(230,126,34,0.08);border:1px solid rgba(230,126,34,0.25);border-radius:20px;font-size:12px;padding:3px 10px;margin:3px 2px 3px 0;color:#B85C1E;font-weight:500}
        .lang-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}
        .lang-name{width:55px;color:#333;font-weight:500}
        .lang-bar-bg{flex:1;height:5px;background:rgba(230,126,34,0.1);border-radius:3px}
        .lang-bar-fill{height:100%;background:linear-gradient(90deg,#E67E22,#D35400);border-radius:3px}
        .edu-item{margin-bottom:0.6rem;padding-bottom:0.6rem;border-bottom:1px solid rgba(230,126,34,0.08)}
        .edu-item:last-child{border-bottom:none}
        .edu-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:2px}
        .edu-degree{font-size:14px;font-weight:600;color:var(--teal-deep,#1F6F8B)}
        .edu-grade{font-size:11px;color:#B85C1E;background:rgba(230,126,34,0.08);padding:2px 8px;border-radius:10px;white-space:nowrap;font-weight:600;border:1px solid rgba(230,126,34,0.2)}
        .edu-inst{font-size:13px;font-style:italic;color:#666;margin-bottom:2px}
        .edu-years{font-size:12px;color:#999;margin-bottom:4px}
        .edu-desc{font-size:12.5px;color:#555;line-height:1.65}
        .cv-pub-sub{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--saffron-deep,#D35400);margin:10px 0 6px}
        .cv-pub-item{font-size:13px;line-height:1.65;margin-bottom:10px;padding-left:14px;position:relative;color:#333}
        .cv-pub-item::before{content:"\\2022";position:absolute;left:0;color:#D35400}
        .cv-pub-bold{font-weight:600}
        .honour-item{font-size:13px;line-height:1.65;margin-bottom:8px;padding-left:14px;position:relative;color:#333}
        .honour-item::before{content:"\\2022";position:absolute;left:0;color:#D35400}
        .honour-label{font-weight:600;color:var(--teal-deep,#1F6F8B)}
        .exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .exp-item{padding:10px 12px;background:#FAF8F3;border-radius:8px;border:1px solid rgba(230,126,34,0.1)}
        .exp-role{font-size:12.5px;font-weight:600;color:var(--teal-deep,#1F6F8B)}
        .exp-org{font-size:12px;color:#555}
        .exp-year{font-size:11px;color:#999;margin-top:2px}
        .ws-item{font-size:13px;margin-bottom:7px;color:#333}
        .ws-date{font-weight:600;color:var(--teal-deep,#1F6F8B)}
        .ws-desc{color:#666}
        .ref-item{margin-bottom:1rem}
        .ref-name{font-size:14px;font-weight:600;color:var(--teal-deep,#1F6F8B);margin-bottom:2px}
        .ref-role{font-size:12px;color:#666;margin-bottom:2px}
        .ref-email{font-size:12px}
        .ref-email a{color:var(--saffron-deep,#D35400)}
        .community-text{font-size:13px;color:#555;line-height:1.7}
        @media(max-width:700px){.cv-header-card{flex-direction:column;padding:1.5rem}.cv-grid{grid-template-columns:1fr}.cv-left{border-right:none;border-bottom:1px solid rgba(230,126,34,0.1)}.cv-right{padding:1.5rem}.exp-grid{grid-template-columns:1fr}}
      `}</style>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/research">Research Profile</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Curriculum Vitae</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Curriculum Vitae</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">पाठ्यचर्या कौशल</p>
            <p className="section-heading__subtitle">Academic qualifications, positions, publications, and professional achievements.</p>
          </div>
          <div className="cv-wrap animate-on-scroll">
            <div className="cv-header-card">
              <img src="https://res.cloudinary.com/dxvbx80hw/image/upload/f_auto,q_auto,w_180/v1775831017/WhatsApp_Image_2026-04-10_at_19.51.38_cate6z.jpg" alt="Sudhanshu Sharma" className="cv-avatar" />
              <div style={{flex:1}}>
                <div className="cv-name">Sudhanshu Sharma</div>
                <div className="cv-title-label">Research Scholar — Centre for Education Technology</div>
                <div className="cv-contacts"><span>📞 +91-98071 12687</span><span>✉ sudhanshu.skrs@gmail.com</span><span>📍 CET, IIT Jodhpur, Rajasthan, INDIA</span></div>
                <div className="cv-bio">I am an aspiring teacher, motivator, scholar, and lifelong learner. I love to lead a simple life and express my ideas and thoughts vibrantly. Colloquially, I have ardent faith in the ideas of spirituality and am firmly dedicated to world peace and nation-building.</div>
              </div>
            </div>
            <div className="cv-grid">
              <div className="cv-left">
                <div className="cv-sec"><div className="cv-sec-title">Expertise</div><span className="cv-tag">LbD / ABL</span><span className="cv-tag">Storytelling</span><span className="cv-tag">Design Thinking</span><span className="cv-tag">Qual. Research</span><span className="cv-tag">Teacher Education</span><span className="cv-tag">Indian Knowledge Systems</span><span className="cv-tag">Instructional Design</span></div>
                <div className="cv-sec"><div className="cv-sec-title">Awards</div><span className="award-tag">UGC–JRF (Education)</span><span className="award-tag">IIT–GATE (Chemistry)</span></div>
                <div className="cv-sec"><div className="cv-sec-title">Languages</div><div className="lang-row"><span className="lang-name">Hindi</span><div className="lang-bar-bg"><div className="lang-bar-fill" style={{width:'90%'}}></div></div></div><div className="lang-row"><span className="lang-name">English</span><div className="lang-bar-bg"><div className="lang-bar-fill" style={{width:'75%'}}></div></div></div></div>
                <div className="cv-sec"><div className="cv-sec-title">Hobbies</div><span className="cv-tag">Cooking</span><span className="cv-tag">Gardening</span><span className="cv-tag">Poetry & Storytelling</span><span className="cv-tag">Reading Books</span></div>
                <div className="cv-sec"><div className="cv-sec-title">Miscellaneous</div><div style={{fontSize:'13px',color:'#555',lineHeight:2}}><div><strong style={{color:'#333'}}>D.O.B.</strong> — 18 June, 1994</div><div><strong style={{color:'#333'}}>Citizenship</strong> — Indian</div></div></div>
                <div className="cv-sec"><div className="cv-sec-title">References</div><div className="ref-item"><div className="ref-name">Dr. Pankaj Chavan</div><div className="ref-role">Assistant Professor, CET, IIT Jodhpur</div><div className="ref-email"><a href="mailto:prankajchavan@iitj.ac.in">prankajchavan@iitj.ac.in</a></div></div><div className="ref-item"><div className="ref-name">Dr. Prateek Chaurasia</div><div className="ref-role">Assistant Professor, Banaras Hindu University</div><div className="ref-email"><a href="mailto:prateek.chaurasia@bhu.ac.in">prateek.chaurasia@bhu.ac.in</a></div></div></div>
              </div>
              <div className="cv-right">
                <div className="cv-sec"><div className="cv-sec-title">Education</div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree">Ph.D. (Education)</div><span className="edu-grade">DGPA: 8.000</span></div><div className="edu-inst">Indian Institute of Technology, Jodhpur</div><div className="edu-years">2023 – Present</div><div className="edu-desc">Working in <strong>Design Thinking in Teacher Education</strong> at CET. Thesis: <em>"Towards Pedagogical Design Thinking: Exploring the Role of Scaffolding in Pre-service Teacher's Development as Learning Designer"</em>.</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree">M.Tech. (Molecular Engineering)</div><span className="edu-grade">CGPA: 8.765</span></div><div className="edu-inst">Indian Institute of Technology, Delhi</div><div className="edu-years">2021 – 2023</div><div className="edu-desc">Theses: <em>"Spectroscopic Characterization of Fluorous Solvent"</em> and <em>"Thermophysical Investigation of Fluorous Solvents"</em>.</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree">Integrated B.Ed.–M.Ed.</div><span className="edu-grade">81.70%</span></div><div className="edu-inst">Regional Institute of Education (NCERT), Bhopal</div><div className="edu-years">2018 – 2021</div><div className="edu-desc">Thesis: <em>"A Study of Identification of Errors in Learning Integers and Its Alleviation"</em>. Internships at JNV, KVS, DMS, and State Schools.</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree">M.Sc. (Chemistry)</div><span className="edu-grade">CGPA: 8.430</span></div><div className="edu-inst">University of Allahabad, Prayagraj</div><div className="edu-years">2016 – 2018</div><div className="edu-desc">Specialization in Physical Chemistry.</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree">B.Sc.</div><span className="edu-grade">59.17%</span></div><div className="edu-inst">Chhatrapati Sahu Ji Maharaj University, Kanpur</div><div className="edu-years">2013 – 2016</div><div className="edu-desc">Chemistry, Physics, and Mathematics.</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree" style={{fontSize:'13px'}}>PG Diploma in Guidance & Counselling <span style={{fontWeight:400,color:'#555'}}>— Jamia Millia Islamia (Distance)</span></div><span className="edu-grade">69.00%</span></div><div className="edu-years">2023</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree" style={{fontSize:'13px'}}>PG Diploma in Translation <span style={{fontWeight:400,color:'#555'}}>— IGNOU (Distance)</span></div><span className="edu-grade">71.20%</span></div><div className="edu-years">2020</div></div>
                  <div className="edu-item"><div className="edu-top"><div className="edu-degree" style={{fontSize:'13px'}}>PG Diploma in Computer Application <span style={{fontWeight:400,color:'#555'}}>— Swami Vivekanand Shubharti Univ. (Distance)</span></div><span className="edu-grade">69.65%</span></div><div className="edu-years">2018</div></div>
                </div>
                <div className="cv-sec"><div className="cv-sec-title">Experience</div><div className="exp-grid"><div className="exp-item"><div className="exp-role">Internee Teacher (4 months)</div><div className="exp-org">Jawahar Navodaya Vidyalaya, Umaria</div><div className="exp-year">2019</div></div><div className="exp-item"><div className="exp-role">Internee Teacher (1 month)</div><div className="exp-org">Demonstration Multipurpose School, Bhopal</div><div className="exp-year">2019</div></div><div className="exp-item"><div className="exp-role">Internee Teacher (1 month)</div><div className="exp-org">Kendriya Vidyalaya No. 3, Bhopal</div><div className="exp-year">2019</div></div><div className="exp-item"><div className="exp-role">Internee Teacher (1 month)</div><div className="exp-org">Govt. Sr. Secondary Girls School, Bhopal</div><div className="exp-year">2018</div></div></div></div>
                <div className="cv-sec"><div className="cv-sec-title">Publications</div><div className="cv-pub-sub">Journals</div><div className="cv-pub-item">Deepika, N., <span className="cv-pub-bold">Sharma, S.</span>, Yadav, D., & Pandey, S. (2024). Anomalous fluorescence quenching in fluorous Solvent-Added media. <em>The Journal of Physical Chemistry B.</em> <a href="https://doi.org/10.1021/acs.jpcb.4c03947" target="_blank" rel="noopener noreferrer">doi</a></div><div className="cv-pub-item">Anthony, A., Sharma, S., & <span className="cv-pub-bold">Sharma, S.</span> (2025). Is ChatGPT The Future of Academic Writing? <em>Bulletin of Science Technology & Society.</em> <a href="https://doi.org/10.1177/02704676251353105" target="_blank" rel="noopener noreferrer">doi</a></div><div className="cv-pub-item"><span className="cv-pub-bold">शर्मा सुधांशु</span>, एवं गुप्ता संतोष कुमार (2024). पूर्णांकों को हमने कैसे समझा? <em>भारतीय आधुनिक शिक्षा, 16</em>(2).</div><div className="cv-pub-sub">Seminars</div><div className="cv-pub-item"><span className="cv-pub-bold">शर्मा सुधांशु</span> (2024). स्कूल इज़ ए मिनिएचर ऑफ़ सोसाइटी — Technical Hindi Seminar, IIT Jodhpur & Indore.</div><div className="cv-pub-item"><span className="cv-pub-bold">शर्मा सुधांशु</span> (2023). एआई के उपयोग द्वारा 'पाई' को अपरिमेय संख्या के रूप में विज़ुअलाइज़ेशन — Technical Hindi Seminar, IIT Jodhpur.</div></div>
                <div className="cv-sec"><div className="cv-sec-title">Workshops & Seminars</div><div className="ws-item"><span className="ws-date">Jan 2025 · IIT Gandhinagar</span> — <span className="ws-desc">Ganita Sammela, History of Indian Mathematics</span></div><div className="ws-item"><span className="ws-date">Dec 2024 · IIT Jodhpur & Indore</span> — <span className="ws-desc">Technical Hindi Seminar</span></div><div className="ws-item"><span className="ws-date">Dec 2023 · IIT Jodhpur</span> — <span className="ws-desc">Technology and Innovation in Math Education</span></div><div className="ws-item"><span className="ws-date">Dec 2023 · IIT Jodhpur</span> — <span className="ws-desc">Technical Hindi Seminar</span></div><div className="ws-item"><span className="ws-date">Nov 2023 · IIFM Bhopal</span> — <span className="ws-desc">Lifestyle for the Environment</span></div><div className="ws-item"><span className="ws-date">Nov 2020 · RIE (NCERT) Bhopal</span> — <span className="ws-desc">Emerging Trends in Learners Assessment</span></div><div className="ws-item"><span className="ws-date">Aug 2020 · Faridabad</span> — <span className="ws-desc">National FDP on Research Methodology</span></div></div>
                <div className="cv-sec"><div className="cv-sec-title">Honours</div><div className="honour-item"><span className="honour-label">National Award</span> — AICEeCC 204–25, Audio Category for "<strong>Panchmahabhoot</strong>" by CIET, NCERT (MoE).</div><div className="honour-item"><span className="honour-label">First Prize</span> — Technical Hindi Seminar 2023, IIT Jodhpur.</div><div className="honour-item"><span className="honour-label">First Prize</span> — Technical Hindi Seminar 2024, Rajbhasha Session, IIT Jodhpur.</div></div>
                <div className="cv-sec"><div className="cv-sec-title">Community Service</div><div className="community-text"><strong>National Service Scheme</strong> — Actively involved as a volunteer, leading awareness camps in villages and plantation drives during Van Mahotsav on the Institute Campus.</div></div>
              </div>
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:'var(--space-8)'}}>
            <button type="button" className="btn btn--primary" style={{display:'inline-flex',alignItems:'center',gap:'8px',cursor:'pointer',border:'none'}} onClick={()=>window.print()}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
              Download CV as PDF
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
