import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPoetry, subscribeToStore } from "../../lib/dataStore";
import type { PoemData } from "../../lib/dataStore";

export default function PoetryThoughts() {
  const [poetry, setPoetry] = useState<PoemData[]>(getPoetry());

  useEffect(() => {
    return subscribeToStore((store) => {
      setPoetry(store.poetry);
    });
  }, []);

  // Sort poetry by date descending
  const sortedPoetry = [...poetry].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/blogs">Blogs</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Poetry & Thoughts</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Poetry & Thoughts</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">कविता एवं विचार</p>
            <p className="section-heading__subtitle">Creative expressions, philosophical musings, and reflections on education, nature, and life.</p>
          </div>

          {sortedPoetry.length > 0 ? (
            sortedPoetry.map((item) => {
              if (item.isReflection) {
                // Prose Reflection Rendering
                return (
                  <div key={item.id} className="content-section animate-on-scroll" style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: 'var(--text-2xl)' }}>{item.title}</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-4)' }}>
                      {item.meta}
                    </p>
                    {(item.content || "").split("\n\n").map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                    {item.quote && (
                      <p style={{ fontStyle: 'italic', color: 'var(--saffron-deep)', fontWeight: 600, textAlign: 'center', marginTop: 'var(--space-6)' }}>
                        "{item.quote}" {item.quoteAuthor && `— ${item.quoteAuthor}`}
                      </p>
                    )}
                  </div>
                );
              } else {
                // Verse Poem Rendering (Hindi/English)
                return (
                  <div key={item.id} className="content-section animate-on-scroll" style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: 'var(--text-2xl)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>{item.title}</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                      {item.meta}
                    </p>

                    {/* Render Image if available */}
                    {item.image && (
                      <div style={{
                        maxWidth: '600px',
                        margin: '0 auto var(--space-8) auto',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid rgba(232, 199, 123, 0.25)',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{
                            width: '100%',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            display: 'block',
                            margin: '0 auto'
                          }} 
                        />
                      </div>
                    )}

                    <div style={{
                      fontFamily: item.isHindi ? 'var(--font-devanagari)' : 'var(--font-display)',
                      fontSize: 'var(--text-lg)',
                      lineHeight: item.isHindi ? 2.2 : 2,
                      color: 'var(--brown-deep)',
                      maxWidth: '600px',
                      margin: '0 auto',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: 'var(--brown-deep)' }}>
                        {(item.lines || []).map((line, lIdx) => (
                          <React.Fragment key={lIdx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    </div>

                    {/* Render Disclaimer if available */}
                    {item.disclaimer && (
                      <div style={{
                        background: 'rgba(232, 199, 123, 0.08)',
                        borderLeft: '4px solid var(--saffron-deep)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                        maxWidth: '600px',
                        margin: 'var(--space-8) auto 0 auto',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--charcoal-muted)',
                        textAlign: 'left',
                        lineHeight: 1.5,
                        fontStyle: 'italic'
                      }}>
                        {item.disclaimer}
                      </div>
                    )}
                  </div>
                );
              }
            })
          ) : (
            <p style={{ textAlign: "center", color: "var(--charcoal-muted)" }}>No poetry published yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
