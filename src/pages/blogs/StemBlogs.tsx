import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs, subscribeToStore } from "../../lib/dataStore";
import type { BlogData } from "../../lib/dataStore";

export default function StemBlogs() {
  const [blogs, setBlogs] = useState<BlogData[]>(getBlogs());

  useEffect(() => {
    return subscribeToStore((store) => {
      setBlogs(store.blogs);
    });
  }, []);

  // Filter STEM blogs and sort by date descending
  const stemBlogs = blogs
    .filter(b => b.type === "stem")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Find our specific osmotic pressure blog to show in full detail
  const featuredBlog = stemBlogs.find(b => b.id === "osmotic-pressure") || stemBlogs[0];
  
  // All other STEM blogs (if any exist/added by admin)
  const otherBlogs = stemBlogs.filter(b => b.id !== featuredBlog?.id);

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/blogs">Blogs</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">STEM Blogs</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">STEM Blogs</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">एसटीईएम ब्लॉग</p>
            <p className="section-heading__subtitle">Exploring the wonders of science, technology, engineering, and mathematics through education.</p>
          </div>

          {/* About STEM Blogs Introduction section */}
          <div className="about-stem-blogs animate-on-scroll" style={{
            background: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(232, 199, 123, 0.25)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6) var(--space-8)",
            marginBottom: "var(--space-10)",
            boxShadow: "var(--shadow-sm)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              fontSize: "6rem",
              opacity: 0.08,
              pointerEvents: "none",
              userSelect: "none"
            }}>
              🔬
            </div>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-xl)",
              color: "var(--teal-deep)",
              marginBottom: "var(--space-3)",
              fontWeight: 700
            }}>
              What is STEM Blogs?
            </h3>
            <p style={{
              color: "var(--charcoal-muted)",
              fontSize: "var(--text-base)",
              lineHeight: 1.7,
              margin: 0
            }}>
              <strong>STEM</strong> is an acronym for <em>"Science, Technology, Engineering and Mathematics"</em>. The idea behind STEM is to make the Nation more competitive in technology development by bringing up generations of students who can excel in high-tech jobs (we like to call this generation, <strong>"STEMists"</strong>). We are going to discuss various questions related to this over here. If you want to get answers to your questions, just write it up and send me through various media I'm available upon. One can find links on the homepage. Queries are most welcomed.
            </p>
          </div>

          {/* Featured Article - Full details as requested */}
          {featuredBlog ? (
            <article className="featured-blog-post animate-on-scroll" style={{
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(232, 199, 123, 0.3)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-8) var(--space-8)",
              boxShadow: "var(--shadow-md)",
              marginBottom: "var(--space-12)"
            }}>
              {/* Header */}
              <header style={{ marginBottom: "var(--space-6)" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  background: "var(--saffron-light)",
                  color: "var(--saffron-deep)",
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-4)"
                }}>
                  🧪 Featured STEM Article
                </div>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-2xl)",
                  color: "var(--teal-deep)",
                  lineHeight: 1.3,
                  fontWeight: 800,
                  marginBottom: "var(--space-3)"
                }}>
                  {featuredBlog.title}
                </h3>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-4)",
                  color: "var(--charcoal-muted)",
                  fontSize: "var(--text-sm)"
                }}>
                  <span>📅 {featuredBlog.meta.split("•")[1]?.trim() || featuredBlog.meta}</span>
                  <span>•</span>
                  <span>👤 Sudhanshu R.R. Sharma</span>
                  <span>•</span>
                  <span>🎓 M.Sc-Chemistry, University of Allahabad</span>
                </div>
              </header>

              {/* Image Section */}
              <div style={{
                margin: "var(--space-6) 0 var(--space-8) 0",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "var(--shadow-sm)",
                background: "#ffffff"
              }}>
                <img 
                  src={featuredBlog.id === "osmotic-pressure" ? "https://res.cloudinary.com/dgv0vuctj/image/upload/v1779552001/idmh6ysesmmb0pqsftgy.jpg" : (featuredBlog.image.startsWith("http") ? featuredBlog.image : "https://res.cloudinary.com/dgv0vuctj/image/upload/v1779552001/idmh6ysesmmb0pqsftgy.jpg")} 
                  alt="Osmosis and Osmotic Pressure Diagram" 
                  style={{
                    width: "100%",
                    maxHeight: "380px",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto"
                  }} 
                />
                <div style={{
                  background: "var(--cream-light)",
                  padding: "var(--space-2) var(--space-4)",
                  fontSize: "var(--text-xs)",
                  color: "var(--charcoal-muted)",
                  textAlign: "center",
                  borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                  fontStyle: "italic"
                }}>
                  Pic Source: Internet / Educational Representation
                </div>
              </div>

              {/* Content Body */}
              <div className="blog-post-content" style={{
                color: "var(--charcoal-dark)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7
              }}>
                {featuredBlog.id === "osmotic-pressure" ? (
                  <>
                    <p style={{ marginBottom: "var(--space-6)" }}>
                      In physical chemistry, determining the molecular mass of macromolecules (such as proteins, polymers, and synthetic resins) accurately is essential. While several thermodynamic properties can be used for this purpose, <strong>Osmotic Pressure</strong> is widely preferred over other options.
                    </p>

                    <div style={{
                      background: "rgba(232, 199, 123, 0.1)",
                      borderLeft: "4px solid var(--saffron-deep)",
                      padding: "var(--space-4) var(--space-6)",
                      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                      marginBottom: "var(--space-6)"
                    }}>
                      <h4 style={{
                        fontSize: "var(--text-base)",
                        color: "var(--teal-deep)",
                        fontWeight: 700,
                        marginBottom: "var(--space-2)"
                      }}>
                        The four Colligative properties are:
                      </h4>
                      <ul style={{
                        listStyleType: "circle",
                        paddingLeft: "var(--space-5)",
                        margin: 0,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "var(--space-2)"
                      }}>
                        <li>Depression in Freezing Point</li>
                        <li>Elevation in Boiling Point</li>
                        <li>Lowering in Vapour Pressure</li>
                        <li style={{ fontWeight: 700, color: "var(--saffron-deep)" }}>Osmotic Pressure</li>
                      </ul>
                    </div>

                    <p style={{ marginBottom: "var(--space-6)" }}>
                      Osmotic Pressure is preferred to calculate the molecular mass of macromolecules because of three critical experimental and mathematical advantages:
                    </p>

                    {/* Key Advantages Grid */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "var(--space-4)",
                      marginBottom: "var(--space-8)"
                    }}>
                      <div style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-5)",
                        boxShadow: "var(--shadow-sm)"
                      }}>
                        <h5 style={{ fontWeight: 700, color: "var(--teal-deep)", marginBottom: "var(--space-2)" }}>1. Calculated at Room Temperature</h5>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--charcoal-muted)", margin: 0 }}>
                          All other colligative properties require abnormal temperature conditions (e.g., extremely high for boiling point elevation or freezing for freezing point depression), which can denature delicate biological macromolecules. In contrast, Osmotic Pressure can be easily measured at <strong>Room Temperature</strong> (around 25°C).
                        </p>
                      </div>

                      <div style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-5)",
                        boxShadow: "var(--shadow-sm)"
                      }}>
                        <h5 style={{ fontWeight: 700, color: "var(--teal-deep)", marginBottom: "var(--space-2)" }}>2. Involves Molarity (M)</h5>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--charcoal-muted)", margin: 0 }}>
                          Its calculation involves <strong>'Molarity (M)'</strong> instead of <strong>'Molality (m)'</strong>. Molarity is experimentally easier to prepare and work with, and does not depend on temperature changes during standard measurements.
                        </p>
                      </div>

                      <div style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-5)",
                        boxShadow: "var(--shadow-sm)",
                        gridColumn: "1 / -1"
                      }}>
                        <h5 style={{ fontWeight: 700, color: "var(--teal-deep)", marginBottom: "var(--space-2)" }}>3. Very Large Magnitude</h5>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--charcoal-muted)", margin: 0 }}>
                          Macromolecules have very high molecular masses, meaning their dilute solutions have extremely low molar concentrations. Other colligative properties would yield values so small they are virtually unmeasurable with standard laboratory tools. However, Osmotic Pressure yields a <strong>very large magnitude</strong> of pressure, which is easily and highly accurately measurable.
                        </p>
                      </div>
                    </div>

                    <div style={{
                      textAlign: "center",
                      fontSize: "var(--text-lg)",
                      fontFamily: "var(--font-display)",
                      color: "var(--teal-deep)",
                      fontWeight: 700,
                      margin: "var(--space-6) 0 var(--space-8) 0",
                      padding: "var(--space-4)",
                      borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
                    }}>
                      Hence, it is highly feasible and preferred to calculate the molecular mass of macromolecules using Osmotic Pressure.
                    </div>

                    {/* Author Signature */}
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "var(--space-6)"
                    }}>
                      <div style={{
                        textAlign: "right",
                        background: "rgba(232, 199, 123, 0.05)",
                        padding: "var(--space-4) var(--space-6)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(232, 199, 123, 0.15)"
                      }}>
                        <div style={{ fontWeight: 700, color: "var(--teal-deep)", fontSize: "var(--text-base)" }}>- Sudhanshu R.R. Sharma</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--charcoal-muted)", marginTop: "2px" }}>01.05.2020</div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--saffron-deep)", fontWeight: 500, marginTop: "4px" }}>M.Sc-Chemistry, University of Allahabad</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>{featuredBlog.excerpt}</p>
                )}
              </div>
            </article>
          ) : (
            <p style={{ textAlign: "center", color: "var(--charcoal-muted)" }}>No STEM blogs published yet.</p>
          )}

          {/* Other STEM Articles List (dynamic check for items added through Admin Panel) */}
          {otherBlogs.length > 0 && (
            <div style={{ marginTop: "var(--space-12)" }}>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xl)",
                color: "var(--saffron-deep)",
                marginBottom: "var(--space-6)",
                fontWeight: 700
              }}>
                📚 Other STEM Articles
              </h3>
              <div className="other-blogs-list" style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-6)"
              }}>
                {otherBlogs.map((blog) => (
                  <div key={blog.id} className="blog-post-item animate-on-scroll">
                    <div 
                      className="blog-post-item__image" 
                      style={{
                        background: blog.gradient || 'linear-gradient(135deg,#E8C77B,#B85C1E)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}
                    >
                      {blog.image || "🧠"}
                    </div>
                    <div className="blog-post-item__content">
                      <div className="blog-post-item__meta">
                        <span>{blog.meta.split("•")[0]?.trim() || "STEM"}</span>
                        <span>•</span>
                        <span>{blog.meta.split("•")[1]?.trim() || blog.meta}</span>
                      </div>
                      <h3 className="blog-post-item__title">{blog.title}</h3>
                      <p className="blog-post-item__excerpt">{blog.excerpt}</p>
                      <a href={blog.link} target={blog.link !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="card__link">
                        Read Full Article →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
