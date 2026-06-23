import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Re-initialize Intersection Observer for animate-on-scroll elements on every route change
  useEffect(() => {
    // Small delay to let the new page DOM render before querying elements
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      if (!elements.length) return;

      // Remove 'visible' class from all elements so they can re-animate
      elements.forEach(el => el.classList.remove('visible'));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Header />
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
