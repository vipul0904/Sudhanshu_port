import { useState, useEffect } from "react";
import LogoPopup from "../LogoPopup";

export default function Header() {
  const [dateTime, setDateTime] = useState({ dateStr: "Loading date...", timeStr: "" });
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const dateStr = now.toLocaleDateString('en-IN', options);
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setDateTime({ dateStr: `Today is ${dateStr}. Time is ${timeStr}`, timeStr });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('fontSizeMultiplier');
    if (saved) {
      const parsed = parseFloat(saved);
      setMultiplier(parsed);
      document.documentElement.style.setProperty('--font-size-multiplier', parsed.toString());
    }
  }, []);

  const applyFontSize = (newMultiplier: number) => {
    document.documentElement.style.setProperty('--font-size-multiplier', newMultiplier.toString());
    localStorage.setItem('fontSizeMultiplier', newMultiplier.toString());
    setMultiplier(newMultiplier);
  };

  return (
    <>
      <a href="#homepage" className="skip-link">Skip to Main Content</a>

      <div className="topbar" role="banner">
        <div className="container">
          <span className="topbar__date" id="topbar-date">{dateTime.dateStr}</span>
          <a href="#homepage" className="topbar__skip">Skip to Main Content</a>
          <div className="topbar__controls">
            <span className="topbar__font-label">Font Size</span>
            <button className="topbar__font-btn" title="Increase font size" aria-label="Increase font size" onClick={() => applyFontSize(Math.min(multiplier + 0.1, 1.5))}>A+</button>
            <button className="topbar__font-btn" title="Reset font size" aria-label="Reset font size" onClick={() => applyFontSize(1)}>A</button>
            <button className="topbar__font-btn" title="Decrease font size" aria-label="Decrease font size" onClick={() => applyFontSize(Math.max(multiplier - 0.1, 0.8))}>A−</button>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <div className="header__brand">
            <div className="header__text">
              <h1 className="header__title">Sudhanshu Sharma</h1>
              <span className="header__tagline">Lifelong Learner · Educator · Academecian · Researcher · Navigator | Exploring Design, Learning, and Meaningful Education</span>
            </div>
          </div>
          <div className="header__image-wrapper">
            <LogoPopup />
          </div>
        </div>
      </header>
    </>
  );
}
