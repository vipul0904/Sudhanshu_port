import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs, subscribeToStore } from "../../lib/dataStore";
import type { BlogData } from "../../lib/dataStore";

export default function BlogsIndex() {
  const [blogs, setBlogs] = useState<BlogData[]>(getBlogs());

  useEffect(() => {
    return subscribeToStore((store) => {
      setBlogs(store.blogs);
    });
  }, []);

  // Sort by date descending and get latest 3 posts
  const recentPosts = [...blogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs"><ol className="breadcrumbs__list">
          <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
          <li className="breadcrumbs__sep">›</li>
          <li className="breadcrumbs__item" aria-current="page">Blogs</li>
        </ol></nav>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">Blog & Writings</h2>
            <div className="section-heading__line"></div>
            <p className="section-heading__devanagari">ब्लॉग एवं लेखन</p>
            <p className="section-heading__subtitle">Thoughts, reflections, and writings on STEM, education, poetry, and life.</p>
          </div>
          <div className="card-grid card-grid--3">
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">🔬</div>
              <h3 className="icon-card__title">STEM Blogs</h3>
              <p className="icon-card__desc">Exploring science, technology, engineering, and mathematics through the lens of education and everyday life.</p>
              <Link to="/blogs/stem-blogs" className="btn btn--primary">Read STEM →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">✏️</div>
              <h3 className="icon-card__title">Guest Posts</h3>
              <p className="icon-card__desc">Invited writings and collaborative articles published on other platforms and journals.</p>
              <Link to="/blogs/guest-posts" className="btn btn--primary">Read Posts →</Link>
            </div>
            <div className="icon-card animate-on-scroll">
              <div className="icon-card__icon">🪶</div>
              <h3 className="icon-card__title">Poetry & Thoughts</h3>
              <p className="icon-card__desc">Creative expressions through poetry, philosophical musings, and personal reflections on life and learning.</p>
              <Link to="/blogs/poetry-thoughts" className="btn btn--primary">Read Poetry →</Link>
            </div>
          </div>
          <div style={{marginTop:'var(--space-16)'}}>
            <h3 style={{fontSize:'var(--text-2xl)',color:'var(--saffron-deep)',marginBottom:'var(--space-8)',fontFamily:'var(--font-display)',textAlign:'center'}}>📝 Recent Posts</h3>
            
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="blog-post-item animate-on-scroll">
                  <div 
                    className="blog-post-item__image" 
                    style={{
                      background: post.gradient || 'linear-gradient(135deg,#E8C77B,#B85C1E)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}
                  >
                    {post.image || "📝"}
                  </div>
                  <div className="blog-post-item__content">
                    <div className="blog-post-item__meta">
                      <span>{post.type === "stem" ? "STEM" : "Guest Post"}</span>
                      <span>•</span>
                      <span>{post.meta.split("•")[1]?.trim() || post.meta}</span>
                    </div>
                    <h3 className="blog-post-item__title">{post.title}</h3>
                    <p className="blog-post-item__excerpt">{post.excerpt}</p>
                    <Link to={post.type === "stem" ? "/blogs/stem-blogs" : "/blogs/guest-posts"} className="card__link">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--charcoal-muted)" }}>No recent blog posts found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
