import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs, subscribeToStore } from "../../lib/dataStore";
import type { BlogData } from "../../lib/dataStore";

export default function GuestPosts() {
  const [blogs, setBlogs] = useState<BlogData[]>(getBlogs());

  useEffect(() => {
    return subscribeToStore((store) => {
      setBlogs(store.blogs);
    });
  }, []);

  // Filter guest posts and sort by date descending
  const guestPosts = blogs
    .filter(b => b.type === "guest")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Find our specific rainy day post to show in full detail
  const featuredPost = guestPosts.find(b => b.id === "rainy-day") || guestPosts[0];

  // All other guest posts (if any exist/added by admin)
  const otherPosts = guestPosts.filter(b => b.id !== featuredPost?.id);

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item"><Link to="/blogs">Blogs</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Guest Posts</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Guest Posts</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">अतिथि ब्लॉग</p>
            <p className="section-heading__subtitle">Invited articles and collaborative writings published across various platforms.</p>
          </div>

          {/* About Guest Corner Introduction section */}
          <div className="about-guest-corner animate-on-scroll" style={{
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
              🤝
            </div>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-xl)",
              color: "var(--saffron-deep)",
              marginBottom: "var(--space-3)",
              fontWeight: 700
            }}>
              Welcome to the Guest Corner.........
            </h3>
            <p style={{
              color: "var(--charcoal-muted)",
              fontSize: "var(--text-base)",
              lineHeight: 1.7,
              margin: 0
            }}>
              This corner is a space I've provided for my friends and Followers, So that they can share their articles, thoughts and ideas to the Blog for the free Flow of knowledge and wisdom. You just need to follow the blog and share your article to the email I've provided on the homepage and after due screening your post will be shared over here. Everybody is invited for their contributions.
            </p>
          </div>

          {/* Featured Guest Post - Full details */}
          {featuredPost ? (
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
                  background: "rgba(30, 60, 114, 0.1)",
                  color: "#1e3c72",
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-4)"
                }}>
                  ✍️ Blog contribution by Manjay.....
                </div>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-2xl)",
                  color: "var(--teal-deep)",
                  lineHeight: 1.3,
                  fontWeight: 800,
                  marginBottom: "var(--space-3)"
                }}>
                  {featuredPost.title}
                </h3>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-4)",
                  color: "var(--charcoal-muted)",
                  fontSize: "var(--text-sm)"
                }}>
                  <span>📅 28th April 2020</span>
                  <span>•</span>
                  <span>👤 Manjay</span>
                  <span>•</span>
                  <span>🎓 CIE, University of Delhi</span>
                </div>
              </header>

              {/* Image Section - Conditional (only show for non-rainy-day posts with valid URLs) */}
              {featuredPost.id !== "rainy-day" && featuredPost.image && featuredPost.image.startsWith("http") && (
                <div style={{
                  margin: "var(--space-6) 0 var(--space-8) 0",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "var(--shadow-sm)",
                  background: "#ffffff"
                }}>
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    style={{
                      width: "100%",
                      maxHeight: "380px",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto"
                    }} 
                  />
                </div>
              )}

              {/* Content Body */}
              <div className="blog-post-content" style={{
                color: "var(--charcoal-dark)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7
              }}>
                {featuredPost.id === "rainy-day" ? (
                  <>
                    <p style={{ marginBottom: "var(--space-6)" }}>
                      The literature eulogizes rain while the mainstream cinema romanticises it. But the reality is only partially true. One can enjoy the little droplets of rain falling while standing at the balcony sipping tea/ coffee. But how can a person enjoy the rain, when rainwaters are dripping from his/her mud house. For them, each droplets of rain are nothing short of a hailstorm. A more privileged person can capture the rainbow from their mobile featured with high resolution camera and then, post it on Instagram with a caption which is copied from internet by googling best quotes on rainbow. (Of course, there will be no credits given to whom the quote originally belongs). For a poor person, the rainbow does not bring such excitement, it just gives them the hope that just like after the troublesome rains there is a soothing rainbow, there will be a happiness in their life once this rough phase ends. Alas, their hopes seldom turn into reality.
                    </p>

                    <p style={{ marginBottom: "var(--space-6)" }}>
                      For most of the people, rain gives an opportunity to cook some delicious food like fritters and enjoy it with Family watching television (or, maybe NetFlix). Not, everyone is so lucky, in some families all the members are forced to assemble in a tiny room since they can't access <em>veranda</em> or other open spaces. Similarly, they can not afford some special food since being daily wage workers, they could find no work on a rainy day. Compare it with those who tread in the city during rain by personal cars. Poor children can find solace through putting their paper boat in the water logged near them. Sadly, their boat is destined to drown.
                    </p>

                    <p style={{ marginBottom: "var(--space-6)" }}>
                      Dancing in the rain can be fun when you have a roof top. But, dancing in the mud is highly unhygienic and makes you prone to diseases. The overflowing sewage on the roads will surely affect you more if you live along the roadside and have no personal vehicle for movement than those who don't need to put their feet on the road (or, land metaphorically).
                    </p>

                    <p style={{ marginBottom: "var(--space-6)" }}>
                      In short, rains bring bliss for few while misery for many. To conclude, although the life of haves and haves not are in stark contrast and few things make it more visible than the incessant rains. We need a bit more focus on infrastructure and fair distribution of resources so that rain can bring such happiness as portrayed in poems and songs.
                    </p>

                    {/* Epilogue Block */}
                    <div style={{
                      background: "rgba(30, 60, 114, 0.05)",
                      borderLeft: "4px solid #1e3c72",
                      padding: "var(--space-4) var(--space-6)",
                      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                      marginBottom: "var(--space-8)",
                      fontSize: "var(--text-sm)",
                      fontStyle: "italic",
                      color: "var(--charcoal-dark)"
                    }}>
                      <strong>Epilogue:</strong> In case if it is not clear by now, let me clarify that this piece is written (oops! typed) by someone who hates rain.
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
                        <div style={{ fontWeight: 700, color: "var(--teal-deep)", fontSize: "var(--text-base)" }}>– Manjay</div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--saffron-deep)", fontWeight: 500, marginTop: "4px" }}>CIE, University of Delhi</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>{featuredPost.excerpt}</p>
                )}
              </div>
            </article>
          ) : (
            <p style={{ textAlign: "center", color: "var(--charcoal-muted)" }}>No Guest Posts published yet.</p>
          )}

          {/* Other Guest Posts List (dynamic check for items added through Admin Panel) */}
          {otherPosts.length > 0 && (
            <div style={{ marginTop: "var(--space-12)" }}>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xl)",
                color: "var(--saffron-deep)",
                marginBottom: "var(--space-6)",
                fontWeight: 700
              }}>
                📚 Other Guest Contributions
              </h3>
              <div className="other-blogs-list" style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-6)"
              }}>
                {otherPosts.map((blog) => (
                  <div key={blog.id} className="blog-post-item animate-on-scroll">
                    <div 
                      className="blog-post-item__image" 
                      style={{
                        background: blog.gradient || 'linear-gradient(135deg,#9B4A30,#5A1A0A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}
                    >
                      {blog.image || "✏️"}
                    </div>
                    <div className="blog-post-item__content">
                      <div className="blog-post-item__meta">
                        <span>{blog.meta.split("•")[0]?.trim() || "Guest Post"}</span>
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
