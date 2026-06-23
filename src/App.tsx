import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Placeholder from "./pages/Placeholder";

// Research
import ResearchProfile from "./pages/ResearchProfile";
import CV from "./pages/research/CV";
import Experience from "./pages/research/Experience";

// Resources
import ResourcesIndex from "./pages/resources/ResourcesIndex";
import IntegratedBedMed from "./pages/resources/IntegratedBedMed";
import VideoLectures from "./pages/resources/VideoLectures";
import CareerGuidance from "./pages/resources/CareerGuidance";
import EdtechResources from "./pages/resources/EdtechResources";
import TeacherEducation from "./pages/resources/TeacherEducation";

// Blogs
import BlogsIndex from "./pages/blogs/BlogsIndex";
import StemBlogs from "./pages/blogs/StemBlogs";
import GuestPosts from "./pages/blogs/GuestPosts";
import PoetryThoughts from "./pages/blogs/PoetryThoughts";

// Standalone pages
import Publications from "./pages/Publications";
import InternshipDiaries from "./pages/InternshipDiaries";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";

import { useEffect } from "react";
import "./index.css";

function App() {
  useEffect(() => {
    // Prevent dragging of any image element
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "IMG" || target.closest("img"))) {
        e.preventDefault();
      }
    };

    // Prevent right-click/context-menu on any image element
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "IMG" || target.closest("img"))) {
        e.preventDefault();
      }
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Panel */}
        <Route path="admin" element={<Admin />} />
        <Route path="pages/admin.html" element={<Admin />} />

        <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<Home />} />
          <Route path="index.html" element={<Home />} />

          {/* Research — clean paths */}
          <Route path="research" element={<ResearchProfile />} />
          <Route path="research/cv" element={<CV />} />
          <Route path="research/experience" element={<Experience />} />
          {/* Research — legacy paths */}
          <Route path="pages/research/index.html" element={<ResearchProfile />} />
          <Route path="pages/research/cv.html" element={<CV />} />
          <Route path="pages/research/experience.html" element={<Experience />} />

          {/* Resources — clean paths */}
          <Route path="resources" element={<ResourcesIndex />} />
          <Route path="resources/integrated-bed-med" element={<IntegratedBedMed />} />
          <Route path="resources/video-lectures" element={<VideoLectures />} />
          <Route path="resources/career-guidance" element={<CareerGuidance />} />
          <Route path="resources/edtech-resources" element={<EdtechResources />} />
          <Route path="resources/teacher-education" element={<TeacherEducation />} />
          {/* Resources — legacy paths */}
          <Route path="pages/resources/index.html" element={<ResourcesIndex />} />
          <Route path="pages/resources/integrated-bed-med.html" element={<IntegratedBedMed />} />
          <Route path="pages/resources/video-lectures.html" element={<VideoLectures />} />
          <Route path="pages/resources/career-guidance.html" element={<CareerGuidance />} />
          <Route path="pages/resources/edtech-resources.html" element={<EdtechResources />} />
          <Route path="pages/resources/teacher-education.html" element={<TeacherEducation />} />

          {/* Blogs — clean paths */}
          <Route path="blogs" element={<BlogsIndex />} />
          <Route path="blogs/stem-blogs" element={<StemBlogs />} />
          <Route path="blogs/guest-posts" element={<GuestPosts />} />
          <Route path="blogs/poetry-thoughts" element={<PoetryThoughts />} />
          {/* Blogs — legacy paths */}
          <Route path="pages/blogs/index.html" element={<BlogsIndex />} />
          <Route path="pages/blogs/stem-blogs.html" element={<StemBlogs />} />
          <Route path="pages/blogs/guest-posts.html" element={<GuestPosts />} />
          <Route path="pages/blogs/poetry-thoughts.html" element={<PoetryThoughts />} />

          {/* Standalone — clean paths */}
          <Route path="publications" element={<Publications />} />
          <Route path="internship-diaries" element={<InternshipDiaries />} />
          <Route path="contact" element={<Contact />} />
          {/* Standalone — legacy paths */}
          <Route path="pages/publications.html" element={<Publications />} />
          <Route path="pages/internship-diaries.html" element={<InternshipDiaries />} />
          <Route path="pages/contact.html" element={<Contact />} />

          {/* Fallback */}
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
