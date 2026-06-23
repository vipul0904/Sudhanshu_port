import { Link } from "react-router-dom";

const videos = [
  { id: "PN1qUxa4CgI", title: "Live Interaction on PMeVIDYA : Heat", channel: "NCERT OFFICIAL", channelUrl: "https://www.youtube.com/@NCERTOFFICIAL", url: "https://www.youtube.com/live/PN1qUxa4CgI" },
  { id: "3PFlqPxzUwE", title: "Live Interaction on PMeVIDYA : Chapter 3: Heat", channel: "NCERT OFFICIAL", channelUrl: "https://www.youtube.com/@NCERTOFFICIAL", url: "https://www.youtube.com/live/3PFlqPxzUwE" },
  { id: "xvtGiJ1nl-s", title: "PMeVIDYA : Chapter-9: Friction — Science (Class VIII)", channel: "NCERT OFFICIAL", channelUrl: "https://www.youtube.com/@NCERTOFFICIAL", url: "https://www.youtube.com/live/xvtGiJ1nl-s" },
  { id: "nJlWrWYUq44", title: "PMeVIDYA : Chemical Kinetics — The ABC of Chemical Reaction", channel: "NCERT OFFICIAL", channelUrl: "https://www.youtube.com/@NCERTOFFICIAL", url: "https://www.youtube.com/live/nJlWrWYUq44" },
  { id: "6L7yVZEovQg", title: "Live Interaction on PMeVIDYA : Acids, Bases and Salts", channel: "NCERT OFFICIAL", channelUrl: "https://www.youtube.com/@NCERTOFFICIAL", url: "https://www.youtube.com/watch?v=6L7yVZEovQg" },
  { id: "WpfzS3azj8U", title: "The Celebrity Number (π)", channel: "सुधांशु शर्मा", channelUrl: "https://www.youtube.com/@Its_SRRS", url: "https://youtu.be/WpfzS3azj8U" },
];

export default function VideoLectures() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/resources">Resources</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">My Video Lectures</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">My Video Lectures</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">मेरे वीडियो व्याख्यान</p>
            <p className="section-heading__subtitle">This page highlights my contribution through a series of live, interactive video lectures delivered to school students under the prestigious CIET, NCERT PM e-Vidya Programme, fostering accessible and impactful learning.</p>
          </div>
          <div className="card-grid card-grid--3" style={{marginTop:0}}>
            {videos.map(v => (
              <div className="card animate-on-scroll" key={v.id}>
                <a href={v.url} target="_blank" rel="noopener noreferrer" style={{display:'block',position:'relative'}}>
                  <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt="Video Lecture" style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',borderRadius:'10px 10px 0 0'}} loading="lazy" />
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{width:56,height:56,background:'rgba(230,126,34,0.9)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </a>
                <div className="card__body">
                  <a href={v.channelUrl} target="_blank" rel="noopener noreferrer" className="card__tag" style={{textDecoration:'none',cursor:'pointer'}}>{v.channel}</a>
                  <h3 className="card__title">{v.title}</h3>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="card__link">Watch Lecture →</a>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'3rem'}}>
            <a href="https://www.youtube.com/playlist?list=PLRkFDS9opv5b1Dbk22kVokPiS3l3knz4R" target="_blank" rel="noopener noreferrer" className="btn btn--primary">Learn More on YouTube</a>
          </div>
        </div>
      </section>
    </>
  );
}
