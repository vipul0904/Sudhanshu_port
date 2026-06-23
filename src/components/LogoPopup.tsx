import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function LogoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ display: 'inline-block' }}
    >
      <img 
        src="https://res.cloudinary.com/dxvbx80hw/image/upload/v1778926800/logo_w6ptpf.png" 
        alt="Logo" 
        className="header__image" 
        style={{ cursor: "default" }}
      />
      {isOpen && createPortal(
        <div className="logo-popup-overlay active" style={{ pointerEvents: 'none' }}>
          <div className="logo-popup-card">
            <div className="logo-popup-text-hi">
              जिन लोगों का अज्ञान सच्चे ज्ञान से नष्ट हो जाता है, उनके लिए वह ज्ञान सूर्य की तरह प्रकाश देता है और उन्हें परम सत्य का बोध कराता है।
            </div>
            <div className="logo-popup-text-en">
              For those whose ignorance has been destroyed by true knowledge, that knowledge shines like the sun and reveals the highest truth.
            </div>
            <div className="logo-popup-source">
              ~श्रीमद्भगवद्गीता ५-१६ | ~śrīmadbhagavadgītā 5-16
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
