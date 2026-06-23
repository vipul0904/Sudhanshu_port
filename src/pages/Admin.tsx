import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStore,
  saveStore,
  getMessages,
  deleteMessage,
  toggleMessageRead,
  subscribeToMessages,
  fetchMessagesFromServer,
  fetchPortfolioFromServer
} from "../lib/dataStore";
import type {
  ProfileData,
  SlideData,
  BlogData,
  PoemData,
  PortfolioStore,
  ContactMessage
} from "../lib/dataStore";

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"profile" | "contact" | "slides" | "blogs" | "guestPosts" | "poetry" | "messages">("profile");

  // Cloudinary upload states
  const [profileUploading, setProfileUploading] = useState(false);
  const [slideUploadingIndex, setSlideUploadingIndex] = useState<number | null>(null);  
  // Form states loaded from storage
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [poetry, setPoetry] = useState<PoemData[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  // Active edit states
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Auto-save states
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const isLoadedRef = useRef(false);

  // Debounced auto-save effect
  useEffect(() => {
    if (!profile || !isAuthenticated) return;

    if (!isLoadedRef.current) {
      isLoadedRef.current = true;
      return;
    }

    setSaveStatus("saving");

    const delayDebounceFn = setTimeout(async () => {
      try {
        const store: PortfolioStore = {
          profile,
          slides,
          blogs,
          poetry
        };
        await saveStore(store);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("error");
      }
    }, 1500); // 1.5s debounce to protect server/db from keystroke-level spam

    return () => clearTimeout(delayDebounceFn);
  }, [profile, slides, blogs, poetry, isAuthenticated]);

  // Load initial data on mount/auth — verifies existing JWT if present
  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin_authenticated") === "true";
    const existingToken = sessionStorage.getItem("admin_jwt_token");
    const existingRefresh = sessionStorage.getItem("admin_refresh_token");
    
    if (isAuthed && (existingToken || existingRefresh)) {
      // Verify the existing JWT token is still valid on the server
      const verifyAndSync = async () => {
        try {
          const verifyRes = await fetch("/api/auth/verify", {
            headers: { "Authorization": `Bearer ${existingToken}` }
          });
          
          if (!verifyRes.ok) {
            // Token expired or invalid — force re-login
            sessionStorage.removeItem("admin_jwt_token");
            sessionStorage.removeItem("admin_refresh_token");
            sessionStorage.removeItem("admin_authenticated");
            setIsAuthenticated(false);
            showToast("Session expired. Please log in again.", "error");
            return;
          }
          
          setIsAuthenticated(true);
          await fetchPortfolioFromServer();
          await fetchMessagesFromServer();
          loadStoreData();
        } catch (err) {
          console.error("Token verification failed:", err);
          setIsAuthenticated(true); // Allow offline access with cached data
          loadStoreData();
        }
      };
      verifyAndSync();
    }
  }, []);

  // Listen for changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Initial fetch of messages
    setMessages(getMessages());

    const unsubscribeStore = subscribeToMessages((msgs) => {
      setMessages(msgs);
    });

    return () => {
      unsubscribeStore();
    };
  }, [isAuthenticated]);

  const loadStoreData = () => {
    isLoadedRef.current = false;
    const store = getStore();
    setProfile(JSON.parse(JSON.stringify(store.profile)));
    setSlides(JSON.parse(JSON.stringify(store.slides)));
    setBlogs(JSON.parse(JSON.stringify(store.blogs)));
    setPoetry(JSON.parse(JSON.stringify(store.poetry)));
    setMessages(getMessages());
    setSaveStatus("saved");
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCloudinaryUpload = async (file: File, onUploadSuccess: (url: string) => void) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || cloudName.includes("here") || uploadPreset.includes("here")) {
      showToast("Cloudinary configuration missing. Please check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await res.json();
      onUploadSuccess(data.secure_url);
      showToast("Image uploaded to Cloudinary successfully!", "success");
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Error uploading image to Cloudinary.", "error");
    }
  };

  const deleteCloudinaryImage = async (url: string) => {
    if (!url || !url.includes("cloudinary.com")) return;
    try {
      const token = sessionStorage.getItem("admin_jwt_token") || "";
      const response = await fetch("/api/media/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });
      
      if (response.ok) {
        const resData = await response.json();
        console.log("Delete media API response:", resData);
      } else {
        console.warn("Failed to call delete media API:", await response.text());
      }
    } catch (error) {
      console.error("Error calling delete media API:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Authenticate via backend JWT login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setAuthError(data.error || "Incorrect password. Please try again.");
        return;
      }
      
      // Store both JWT tokens securely in sessionStorage
      sessionStorage.setItem("admin_jwt_token", data.accessToken);
      sessionStorage.setItem("admin_refresh_token", data.refreshToken);
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      
      // Fetch fresh data from MongoDB Atlas upon login
      await fetchPortfolioFromServer();
      await fetchMessagesFromServer();
      
      loadStoreData();
      showToast("Access Granted. Welcome, Administrator!");
    } catch (error) {
      console.error("Login request failed:", error);
      setAuthError("Login failed. Server is unreachable or offline.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_jwt_token");
    sessionStorage.removeItem("admin_refresh_token");
    setPassword("");
    showToast("Logged out successfully.", "info");
  };

  // ────────────────────────────────────────────────────────
  // CONTACT MESSAGES ACTIONS
  // ────────────────────────────────────────────────────────
  const handleDeleteMessage = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this contact response?")) {
      deleteMessage(id);
      if (selectedMessageId === id) {
        setSelectedMessageId(null);
      }
      showToast("Message deleted successfully.", "success");
    }
  };

  const handleToggleRead = (id: string) => {
    toggleMessageRead(id);
  };

  // ────────────────────────────────────────────────────────
  // SAVE STORE CHANGES
  // ────────────────────────────────────────────────────────
  const handleSaveAll = async () => {
    if (!profile) return;
    setSaveStatus("saving");
    try {
      const store: PortfolioStore = {
        profile,
        slides,
        blogs,
        poetry
      };
      await saveStore(store);
      setSaveStatus("saved");
      showToast("All changes saved and synchronized successfully!", "success");
    } catch (err) {
      console.error("Manual save failed:", err);
      setSaveStatus("error");
      showToast("Failed to save changes to the database.", "error");
    }
  };

  // ────────────────────────────────────────────────────────
  // TABS: PROFILE & INTRO PANEL
  // ────────────────────────────────────────────────────────
  const handleProfileChange = (key: keyof ProfileData, value: any) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [key]: value
    });
  };

  const handleBioParagraphChange = (index: number, text: string) => {
    if (!profile) return;
    const nextBio = [...profile.bioParagraphs];
    nextBio[index] = text;
    handleProfileChange("bioParagraphs", nextBio);
  };

  const handleAddBioParagraph = () => {
    if (!profile) return;
    handleProfileChange("bioParagraphs", [...profile.bioParagraphs, ""]);
  };

  const handleRemoveBioParagraph = (index: number) => {
    if (!profile) return;
    if (profile.bioParagraphs.length <= 1) {
      showToast("At least one biography paragraph is required.", "error");
      return;
    }
    const nextBio = profile.bioParagraphs.filter((_, i) => i !== index);
    handleProfileChange("bioParagraphs", nextBio);
  };

  // ────────────────────────────────────────────────────────
  // TABS: CONTACT CARD & SOCIALS
  // ────────────────────────────────────────────────────────
  const handleSocialChange = (key: string, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socials: {
        ...profile.socials,
        [key]: value
      }
    });
  };

  // ────────────────────────────────────────────────────────
  // TABS: CAROUSEL SLIDESHOW
  // ────────────────────────────────────────────────────────
  const handleSlideChange = (index: number, key: keyof SlideData, value: string) => {
    const nextSlides = [...slides];
    nextSlides[index] = {
      ...nextSlides[index],
      [key]: value
    };
    setSlides(nextSlides);
  };

  const handleAddSlide = () => {
    setSlides([...slides, { img: "", caption: "" }]);
  };

  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) {
      showToast("At least one slideshow item is required.", "error");
      return;
    }
    const removedSlide = slides[index];
    if (removedSlide && removedSlide.img) {
      deleteCloudinaryImage(removedSlide.img);
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === slides.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const nextSlides = [...slides];
    const temp = nextSlides[index];
    nextSlides[index] = nextSlides[targetIndex];
    nextSlides[targetIndex] = temp;
    setSlides(nextSlides);
  };

  // ────────────────────────────────────────────────────────
  // TABS: BLOGS PANEL
  // ────────────────────────────────────────────────────────
  const handleAddBlog = (type: "stem" | "guest" = "stem") => {
    const newId = "blog-" + Date.now();
    const newBlog: BlogData = {
      id: newId,
      type: type,
      title: type === "stem" ? "New STEM Blog Post" : "New Guest Post",
      meta: (type === "stem" ? "STEM" : "Guest") + " • " + new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
      excerpt: "Short blog excerpt summarising the post.",
      link: "#",
      image: type === "stem" ? "🔬" : "✏️",
      gradient: type === "stem" ? "linear-gradient(135deg, #E8C77B, #B85C1E)" : "linear-gradient(135deg, #7BE8C7, #1E5CB8)",
      date: new Date().toISOString().split("T")[0]
    };
    setBlogs([newBlog, ...blogs]);
    setSelectedBlogId(newId);
  };

  const handleUpdateBlog = (id: string, key: keyof BlogData, value: string) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const handleRemoveBlog = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(b => b.id !== id));
      if (selectedBlogId === id) setSelectedBlogId(null);
      showToast("Blog post removed.", "info");
    }
  };

  // ────────────────────────────────────────────────────────
  // TABS: POETRY & REFLECTIONS
  // ────────────────────────────────────────────────────────
  const handleAddPoetry = () => {
    const newId = "poetry-" + Date.now();
    const newPoetry: PoemData = {
      id: newId,
      title: "New Poem or Thought",
      meta: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
      isHindi: false,
      isReflection: false,
      lines: ["Line 1 of poem...", "Line 2 of poem..."],
      date: new Date().toISOString().split("T")[0]
    };
    setPoetry([newPoetry, ...poetry]);
    setSelectedPoemId(newId);
  };

  const handleUpdatePoetry = (id: string, key: keyof PoemData, value: any) => {
    setPoetry(poetry.map(p => p.id === id ? { ...p, [key]: value } : p));
  };

  const handlePoemLinesChange = (id: string, linesText: string) => {
    const lines = linesText.split("\n");
    handleUpdatePoetry(id, "lines", lines);
  };

  const handleRemovePoetry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this poetry entry?")) {
      setPoetry(poetry.filter(p => p.id !== id));
      if (selectedPoemId === id) setSelectedPoemId(null);
      showToast("Poetry entry removed.", "info");
    }
  };

  // Return to Home
  const handleReturnHome = () => {
    navigate("/");
  };

  // Render auth prompt if not logged in
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <AdminStyles />
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-login-emblem">🪶</span>
            <h2>Portfolio Administration</h2>
            <p>Enter the master passkey to make updates</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="passkey">Admin Passkey</label>
              <div className="password-input-container">
                <input
                  id="passkey"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
              {authError && <p className="error-message">{authError}</p>}
            </div>
            <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">
              Access Dashboard
            </button>
            <button type="button" onClick={handleReturnHome} className="admin-btn admin-btn--secondary admin-btn--block" style={{ marginTop: "10px" }}>
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render complete premium admin dashboard
  return (
    <div className="admin-dashboard">
      <AdminStyles />
      
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "ℹ"}
          </span>
          <span className="toast-msg">{toast.message}</span>
        </div>
      )}

      <header className="admin-header">
        <div className="admin-header__brand">
          <span className="admin-header__emblem">🎛️</span>
          <div>
            <h1>Sudhanshu's Portfolio Administrator</h1>
            <p>Change your website content dynamically in real-time</p>
          </div>
        </div>
        
        <div className="admin-header__actions">
          <div className={`admin-save-status status-${saveStatus}`}>
            {saveStatus === "saved" && (
              <>
                <span className="dot dot-green"></span>
                <span>Saved to Database & Web</span>
              </>
            )}
            {saveStatus === "saving" && (
              <>
                <span className="dot dot-amber animate-pulse"></span>
                <span>Saving...</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <span className="dot dot-red"></span>
                <span>Connection Error</span>
              </>
            )}
          </div>
          
          <button onClick={handleSaveAll} className="admin-btn admin-btn--success" title="Force save all changes now">
            {saveStatus === "saving" ? "⏳ Saving..." : "💾 Force Save"}
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn--danger">
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="admin-main">
        {/* Navigation Tabs */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              onClick={() => setActiveTab("profile")}
              className={`admin-nav-item ${activeTab === "profile" ? "active" : ""}`}
            >
              🙋 Intro Panel & Profile Pic
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`admin-nav-item ${activeTab === "contact" ? "active" : ""}`}
            >
              📇 Contact Info Card
            </button>
            <button
              onClick={() => setActiveTab("slides")}
              className={`admin-nav-item ${activeTab === "slides" ? "active" : ""}`}
            >
              🖼️ Slideshow Carousel
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`admin-nav-item ${activeTab === "blogs" ? "active" : ""}`}
            >
              🔬 STEM Blogs
            </button>
            <button
              onClick={() => setActiveTab("guestPosts")}
              className={`admin-nav-item ${activeTab === "guestPosts" ? "active" : ""}`}
            >
              ✏️ Guest Posts
            </button>
            <button
              onClick={() => setActiveTab("poetry")}
              className={`admin-nav-item ${activeTab === "poetry" ? "active" : ""}`}
            >
              🪶 Poetry & Thoughts
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`admin-nav-item ${activeTab === "messages" ? "active" : ""}`}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>📨 Contact Messages</span>
              {messages.filter(m => !m.read).length > 0 && (
                <span style={{
                  background: "var(--saffron-deep)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "2px 8px",
                  fontSize: "var(--text-xs)",
                  fontWeight: "bold"
                }}>
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>
          </nav>
          <div className="admin-sidebar-footer">
            <button onClick={handleReturnHome} className="admin-btn admin-btn--secondary admin-btn--block">
              ← View Live Website
            </button>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="admin-content">
          {/* TAB 1: INTRO PANEL & PROFILE PICTURE */}
          {activeTab === "profile" && profile && (
            <div className="admin-tab-pane">
              <h2>🙋 Intro Panel & Profile Picture</h2>
              <p className="tab-description">Modify your welcome message, profile photo, and biography paragraphs visible in the hero block.</p>
              
              <div className="admin-card">
                <h3>Welcome & Image</h3>
                <div className="grid grid--2">
                  <div className="form-group">
                    <label>Greeting Title</label>
                    <input
                      type="text"
                      value={profile.greeting}
                      onChange={(e) => handleProfileChange("greeting", e.target.value)}
                      placeholder="e.g., नमस्ते | Namaste 🙏"
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Image</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <label className={`admin-btn admin-btn--primary admin-btn--sm ${profileUploading ? "disabled" : ""}`} style={{ cursor: "pointer", margin: 0, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        {profileUploading ? "⌛ Uploading..." : "📤 Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={profileUploading}
                           onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const oldUrl = profile.heroImage;
                            setProfileUploading(true);
                            await handleCloudinaryUpload(file, (url) => {
                              handleProfileChange("heroImage", url);
                              if (oldUrl) {
                                deleteCloudinaryImage(oldUrl);
                              }
                            });
                            setProfileUploading(false);
                          }}
                          style={{ display: "none" }}
                        />
                      </label>
                      {profile.heroImage && (
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--cream-darker)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "200px" }} title={profile.heroImage}>
                          Stored: {profile.heroImage.substring(profile.heroImage.lastIndexOf("/") + 1)}
                        </span>
                      )}
                    </div>
                    <small className="help-text">Directly upload a new photo to Cloudinary.</small>
                  </div>
                </div>
                {profile.heroImage && (
                  <div className="admin-image-preview">
                    <span>Preview:</span>
                    <img src={profile.heroImage} alt="Profile Preview" />
                  </div>
                )}
              </div>

              <div className="admin-card">
                <div className="admin-card__header">
                  <h3>Biography Paragraphs</h3>
                  <button onClick={handleAddBioParagraph} className="admin-btn admin-btn--primary admin-btn--sm">
                    ＋ Add Paragraph
                  </button>
                </div>
                
                <div className="bio-paragraphs-list">
                  {profile.bioParagraphs.map((para, index) => (
                    <div key={index} className="bio-paragraph-item">
                      <div className="paragraph-header">
                        <span>Paragraph #{index + 1}</span>
                        <button
                          onClick={() => handleRemoveBioParagraph(index)}
                          className="admin-btn admin-btn--danger admin-btn--xs"
                        >
                          Delete
                        </button>
                      </div>
                      <textarea
                        value={para}
                        onChange={(e) => handleBioParagraphChange(index, e.target.value)}
                        placeholder="Write paragraph biography details..."
                        rows={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT DETAILS & SOCIALS */}
          {activeTab === "contact" && profile && (
            <div className="admin-tab-pane">
              <h2>📇 Contact Info Card</h2>
              <p className="tab-description">Edit your details printed in the small highlight card on the left side of the hero section.</p>
              
              <div className="admin-card">
                <h3>Profile Card Details</h3>
                <div className="grid grid--2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Professional Title</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => handleProfileChange("title", e.target.value)}
                      placeholder="e.g. Scholar & Educator"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number (Raw)</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      placeholder="e.g., +919807112687"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number (Display Format)</label>
                    <input
                      type="text"
                      value={profile.phoneDisplay}
                      onChange={(e) => handleProfileChange("phoneDisplay", e.target.value)}
                      placeholder="e.g., (+91)-9807112687"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label>Tagline Description</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => handleProfileChange("tagline", e.target.value)}
                    placeholder="Short description text"
                  />
                </div>

                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label>Physical Address (Multi-line)</label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleProfileChange("address", e.target.value)}
                    placeholder="Provide your college / office address detail..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="admin-card">
                <h3>Social Profiles Links</h3>
                <div className="grid grid--2">
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      value={profile.socials.linkedin}
                      onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>X / Twitter</label>
                    <input
                      type="text"
                      value={profile.socials.twitter}
                      onChange={(e) => handleSocialChange("twitter", e.target.value)}
                      placeholder="https://x.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Instagram</label>
                    <input
                      type="text"
                      value={profile.socials.instagram}
                      onChange={(e) => handleSocialChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Facebook</label>
                    <input
                      type="text"
                      value={profile.socials.facebook}
                      onChange={(e) => handleSocialChange("facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>YouTube Channel</label>
                    <input
                      type="text"
                      value={profile.socials.youtube}
                      onChange={(e) => handleSocialChange("youtube", e.target.value)}
                      placeholder="https://youtube.com/@..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLIDESHOW CAROUSEL */}
          {activeTab === "slides" && (
            <div className="admin-tab-pane">
              <div className="admin-card__header">
                <div>
                  <h2>🖼️ Slideshow Carousel</h2>
                  <p className="tab-description">Manage images and caption slides running in the seamless homepage banner slider.</p>
                </div>
                <button onClick={handleAddSlide} className="admin-btn admin-btn--primary">
                  ＋ Add New Slide
                </button>
              </div>

              <div className="slides-editor-list">
                {slides.map((slide, index) => (
                  <div key={index} className="admin-card slide-editor-item">
                    <div className="slide-editor-header">
                      <h4>Slide #{index + 1}</h4>
                      <div className="slide-editor-actions">
                        <button
                          onClick={() => moveSlide(index, "up")}
                          disabled={index === 0}
                          className="admin-btn admin-btn--secondary admin-btn--xs"
                        >
                          ▲ Move Up
                        </button>
                        <button
                          onClick={() => moveSlide(index, "down")}
                          disabled={index === slides.length - 1}
                          className="admin-btn admin-btn--secondary admin-btn--xs"
                        >
                          ▼ Move Down
                        </button>
                        <button
                          onClick={() => handleRemoveSlide(index)}
                          className="admin-btn admin-btn--danger admin-btn--xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid--2">
                      <div className="form-group">
                        <label>Slide Image</label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <label className={`admin-btn admin-btn--primary admin-btn--sm ${slideUploadingIndex === index ? "disabled" : ""}`} style={{ cursor: "pointer", margin: 0, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            {slideUploadingIndex === index ? "⌛ Uploading..." : "📤 Upload Image"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={slideUploadingIndex === index}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const oldUrl = slide.img;
                                setSlideUploadingIndex(index);
                                await handleCloudinaryUpload(file, (url) => {
                                  handleSlideChange(index, "img", url);
                                  if (oldUrl) {
                                    deleteCloudinaryImage(oldUrl);
                                  }
                                });
                                setSlideUploadingIndex(null);
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                          {slide.img && (
                            <span style={{ fontSize: "var(--text-xs)", color: "var(--cream-darker)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "200px" }} title={slide.img}>
                              Stored: {slide.img.substring(slide.img.lastIndexOf("/") + 1)}
                            </span>
                          )}
                        </div>
                        <small className="help-text">Directly upload a slide image to Cloudinary.</small>
                      </div>
                      <div className="form-group">
                        <label>Caption Overlay Title</label>
                        <input
                          type="text"
                          value={slide.caption}
                          onChange={(e) => handleSlideChange(index, "caption", e.target.value)}
                          placeholder="Caption summary text..."
                        />
                      </div>
                    </div>

                    {slide.img && (
                      <div className="slide-preview-small" style={{ marginTop: "10px" }}>
                        <span>Image Preview:</span>
                        <img 
                          src={slide.img.startsWith("images/") ? `/${slide.img}` : slide.img} 
                          alt="Slide preview" 
                          style={{ maxHeight: "80px", borderRadius: "4px", border: "1px solid var(--cream-dark)" }}
                          onError={(e) => {
                            // If local image fails to find in root, preview with fallback or alert
                            (e.target as HTMLImageElement).style.borderColor = "red";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STEM BLOGS */}
          {activeTab === "blogs" && (
            <div className="admin-tab-pane">
              <div className="admin-card__header">
                <div>
                  <h2>🔬 STEM Blogs</h2>
                  <p className="tab-description">Add, edit, or delete dynamic listings for your STEM blog articles.</p>
                </div>
                <button onClick={() => handleAddBlog("stem")} className="admin-btn admin-btn--primary">
                  ＋ Add New STEM Blog
                </button>
              </div>

              <div className="blogs-editor-container">
                <div className="blogs-sidebar-list">
                  <div className="blogs-list-nav">
                    {blogs.filter(b => b.type === "stem").map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBlogId(b.id)}
                        className={`blog-nav-item ${selectedBlogId === b.id ? "active" : ""}`}
                      >
                        <span className="blog-icon">{b.image || "🔬"}</span>
                        <div className="blog-nav-text">
                          <span className="blog-title-short">{b.title}</span>
                          <span className="blog-category-label">STEM</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="blog-editor-form">
                  {selectedBlogId && blogs.find(b => b.id === selectedBlogId)?.type === "stem" ? (
                    (() => {
                      const blog = blogs.find(b => b.id === selectedBlogId);
                      if (!blog) return <p className="no-selection-msg">Select a post from the list or add one to start editing.</p>;
                      return (
                        <div className="admin-card">
                          <div className="blog-edit-title-row">
                            <h3>Edit STEM Blog Details</h3>
                            <button
                              onClick={() => handleRemoveBlog(blog.id)}
                              className="admin-btn admin-btn--danger admin-btn--sm"
                            >
                              Delete Post
                            </button>
                          </div>

                          <div className="form-group">
                            <label>Post Category Type</label>
                            <select
                              value={blog.type}
                              onChange={(e) => handleUpdateBlog(blog.id, "type", e.target.value as "stem" | "guest")}
                            >
                              <option value="stem">🔬 STEM Blog</option>
                              <option value="guest">✏️ Guest Post</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>Blog Post Title</label>
                            <input
                              type="text"
                              value={blog.title}
                              onChange={(e) => handleUpdateBlog(blog.id, "title", e.target.value)}
                              placeholder="e.g. Why Computational Thinking matters..."
                            />
                          </div>

                          <div className="grid grid--2" style={{ marginTop: "12px" }}>
                            <div className="form-group">
                              <label>Metadata Info Label</label>
                              <input
                                type="text"
                                value={blog.meta}
                                onChange={(e) => handleUpdateBlog(blog.id, "meta", e.target.value)}
                                placeholder="e.g., Science • March 2026"
                              />
                            </div>
                            <div className="form-group">
                              <label>Publish Date (YYYY-MM-DD)</label>
                              <input
                                type="date"
                                value={blog.date}
                                onChange={(e) => handleUpdateBlog(blog.id, "date", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid--2" style={{ marginTop: "12px" }}>
                            <div className="form-group">
                              <label>Post Emoji Icon</label>
                              <input
                                type="text"
                                value={blog.image}
                                onChange={(e) => handleUpdateBlog(blog.id, "image", e.target.value)}
                                placeholder="e.g., 🧪, 🧠, 🌐"
                              />
                            </div>
                            <div className="form-group">
                              <label>Card Highlight Gradient</label>
                              <input
                                type="text"
                                value={blog.gradient}
                                onChange={(e) => handleUpdateBlog(blog.id, "gradient", e.target.value)}
                                placeholder="linear-gradient(...) style"
                              />
                              <small className="help-text">Used for card thumbnails.</small>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>External Read Link URL</label>
                            <input
                              type="text"
                              value={blog.link}
                              onChange={(e) => handleUpdateBlog(blog.id, "link", e.target.value)}
                              placeholder="e.g., https://site.com/article"
                            />
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>Short Content Excerpt Description</label>
                            <textarea
                              value={blog.excerpt}
                              onChange={(e) => handleUpdateBlog(blog.id, "excerpt", e.target.value)}
                              placeholder="Write a summary description of the article..."
                              rows={5}
                            />
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="no-selection-box">
                      <span>👈</span>
                      <p>Select a STEM blog post from the sidebar list to modify details, or click "Add New STEM Blog" above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.5: GUEST POSTS */}
          {activeTab === "guestPosts" && (
            <div className="admin-tab-pane">
              <div className="admin-card__header">
                <div>
                  <h2>📝 Guest Posts</h2>
                  <p className="tab-description">Add, edit, or delete dynamic listings for your external Guest writing and features.</p>
                </div>
                <button onClick={() => handleAddBlog("guest")} className="admin-btn admin-btn--primary">
                  ＋ Add New Guest Post
                </button>
              </div>

              <div className="blogs-editor-container">
                <div className="blogs-sidebar-list">
                  <div className="blogs-list-nav">
                    {blogs.filter(b => b.type === "guest").map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBlogId(b.id)}
                        className={`blog-nav-item ${selectedBlogId === b.id ? "active" : ""}`}
                      >
                        <span className="blog-icon">{b.image || "✏️"}</span>
                        <div className="blog-nav-text">
                          <span className="blog-title-short">{b.title}</span>
                          <span className="blog-category-label">GUEST</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="blog-editor-form">
                  {selectedBlogId && blogs.find(b => b.id === selectedBlogId)?.type === "guest" ? (
                    (() => {
                      const blog = blogs.find(b => b.id === selectedBlogId);
                      if (!blog) return <p className="no-selection-msg">Select a post from the list or add one to start editing.</p>;
                      return (
                        <div className="admin-card">
                          <div className="blog-edit-title-row">
                            <h3>Edit Guest Post Details</h3>
                            <button
                              onClick={() => handleRemoveBlog(blog.id)}
                              className="admin-btn admin-btn--danger admin-btn--sm"
                            >
                              Delete Post
                            </button>
                          </div>

                          <div className="form-group">
                            <label>Post Category Type</label>
                            <select
                              value={blog.type}
                              onChange={(e) => handleUpdateBlog(blog.id, "type", e.target.value as "stem" | "guest")}
                            >
                              <option value="stem">🔬 STEM Blog</option>
                              <option value="guest">✏️ Guest Post</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>Guest Post Title</label>
                            <input
                              type="text"
                              value={blog.title}
                              onChange={(e) => handleUpdateBlog(blog.id, "title", e.target.value)}
                              placeholder="e.g. Guest review in educational journal..."
                            />
                          </div>

                          <div className="grid grid--2" style={{ marginTop: "12px" }}>
                            <div className="form-group">
                              <label>Metadata Info Label</label>
                              <input
                                type="text"
                                value={blog.meta}
                                onChange={(e) => handleUpdateBlog(blog.id, "meta", e.target.value)}
                                placeholder="e.g., Pedagogy • April 2026"
                              />
                            </div>
                            <div className="form-group">
                              <label>Publish Date (YYYY-MM-DD)</label>
                              <input
                                type="date"
                                value={blog.date}
                                onChange={(e) => handleUpdateBlog(blog.id, "date", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid--2" style={{ marginTop: "12px" }}>
                            <div className="form-group">
                              <label>Post Emoji Icon</label>
                              <input
                                type="text"
                                value={blog.image}
                                onChange={(e) => handleUpdateBlog(blog.id, "image", e.target.value)}
                                placeholder="e.g., 🧪, 🧠, 🌐"
                              />
                            </div>
                            <div className="form-group">
                              <label>Card Highlight Gradient</label>
                              <input
                                type="text"
                                value={blog.gradient}
                                onChange={(e) => handleUpdateBlog(blog.id, "gradient", e.target.value)}
                                placeholder="linear-gradient(...) style"
                              />
                              <small className="help-text">Used for card thumbnails.</small>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>External Read Link URL</label>
                            <input
                              type="text"
                              value={blog.link}
                              onChange={(e) => handleUpdateBlog(blog.id, "link", e.target.value)}
                              placeholder="e.g., https://site.com/article"
                            />
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>Short Content Excerpt Description</label>
                            <textarea
                              value={blog.excerpt}
                              onChange={(e) => handleUpdateBlog(blog.id, "excerpt", e.target.value)}
                              placeholder="Write a summary description of the article..."
                              rows={5}
                            />
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="no-selection-box">
                      <span>👈</span>
                      <p>Select a Guest post from the sidebar list to modify details, or click "Add New Guest Post" above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POETRY & REFLECTIONS */}
          {activeTab === "poetry" && (
            <div className="admin-tab-pane">
              <div className="admin-card__header">
                <div>
                  <h2>🪶 Poetry & Reflections</h2>
                  <p className="tab-description">Dynamically post creative expressions, poems (Hindi/English), and deep reflections with custom quotes.</p>
                </div>
                <button onClick={handleAddPoetry} className="admin-btn admin-btn--primary">
                  ＋ Add New Entry
                </button>
              </div>

              <div className="blogs-editor-container">
                <div className="blogs-sidebar-list">
                  <div className="blogs-list-nav">
                    {poetry.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPoemId(p.id)}
                        className={`blog-nav-item ${selectedPoemId === p.id ? "active" : ""}`}
                      >
                        <span className="blog-icon">{p.isReflection ? "💭" : "🪶"}</span>
                        <div className="blog-nav-text">
                          <span className="blog-title-short">{p.title}</span>
                          <span className="blog-category-label">
                            {p.isReflection ? "REFLECTION" : p.isHindi ? "HINDI POEM" : "POEM"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="blog-editor-form">
                  {selectedPoemId ? (
                    (() => {
                      const poem = poetry.find(p => p.id === selectedPoemId);
                      if (!poem) return <p className="no-selection-msg">Select an entry from the list or add one to start editing.</p>;
                      return (
                        <div className="admin-card">
                          <div className="blog-edit-title-row">
                            <h3>Edit Poetry / Reflection</h3>
                            <button
                              onClick={() => handleRemovePoetry(poem.id)}
                              className="admin-btn admin-btn--danger admin-btn--sm"
                            >
                              Delete Entry
                            </button>
                          </div>

                          <div className="grid grid--3">
                            <div className="form-group checkbox-group">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={poem.isReflection}
                                  onChange={(e) => handleUpdatePoetry(poem.id, "isReflection", e.target.checked)}
                                />
                                Is Reflection (Prose)?
                              </label>
                            </div>
                            <div className="form-group checkbox-group">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={poem.isHindi}
                                  onChange={(e) => handleUpdatePoetry(poem.id, "isHindi", e.target.checked)}
                                  disabled={poem.isReflection}
                                />
                                Hindi Language font?
                              </label>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label>Entry Title</label>
                            <input
                              type="text"
                              value={poem.title}
                              onChange={(e) => handleUpdatePoetry(poem.id, "title", e.target.value)}
                              placeholder="e.g., The Classroom Window..."
                            />
                          </div>

                          <div className="grid grid--2" style={{ marginTop: "12px" }}>
                            <div className="form-group">
                              <label>Metadata Info Subtitle</label>
                              <input
                                type="text"
                                value={poem.meta}
                                onChange={(e) => handleUpdatePoetry(poem.id, "meta", e.target.value)}
                                placeholder="e.g., February 2026 • Hindi"
                              />
                            </div>
                            <div className="form-group">
                              <label>Publish Date</label>
                              <input
                                type="date"
                                value={poem.date}
                                onChange={(e) => handleUpdatePoetry(poem.id, "date", e.target.value)}
                              />
                            </div>
                          </div>

                          {poem.isReflection ? (
                            /* Reflection (Prose text + quote) fields */
                            <div className="reflection-fields-editor" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid var(--border-light)" }}>
                              <h4>Reflection Prose Configuration</h4>
                              
                              <div className="form-group" style={{ marginTop: "10px" }}>
                                <label>Prose Paragraph Content (supports multiple paragraphs, separated by newlines)</label>
                                <textarea
                                  value={poem.content || ""}
                                  onChange={(e) => handleUpdatePoetry(poem.id, "content", e.target.value)}
                                  placeholder="Write your reflection paragraphs here..."
                                  rows={8}
                                />
                              </div>

                              <div className="grid grid--2" style={{ marginTop: "12px" }}>
                                <div className="form-group">
                                  <label>Standalone Highlight Quote</label>
                                  <input
                                    type="text"
                                    value={poem.quote || ""}
                                    onChange={(e) => handleUpdatePoetry(poem.id, "quote", e.target.value)}
                                    placeholder="e.g. The mind is a fire to be kindled..."
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Quote Author</label>
                                  <input
                                    type="text"
                                    value={poem.quoteAuthor || ""}
                                    onChange={(e) => handleUpdatePoetry(poem.id, "quoteAuthor", e.target.value)}
                                    placeholder="e.g. Plutarch"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Poem line-by-line editor */
                            <div className="poem-fields-editor" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid var(--border-light)" }}>
                              <h4>Poem Verse Stanza Editor</h4>
                              <p className="field-note">Type your poem line-by-line below. Enter stanzas as empty blank lines.</p>
                              
                              <div className="form-group" style={{ marginTop: "10px" }}>
                                <label>Poem Verses (One line per row)</label>
                                <textarea
                                  value={poem.lines?.join("\n") || ""}
                                  onChange={(e) => handlePoemLinesChange(poem.id, e.target.value)}
                                  placeholder="Through the classroom window, I see&#10;A world unfolding, wild and free..."
                                  rows={12}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="no-selection-box">
                      <span>👈</span>
                      <p>Select a poem or thought from the sidebar list to modify details, or click "Add New Entry" above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT MESSAGES */}
          {activeTab === "messages" && (
            <div className="admin-tab-pane">
              <div className="admin-card__header">
                <div>
                  <h2>📨 Contact Messages</h2>
                  <p className="tab-description">Read and manage inquiries sent through the website contact form.</p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to mark all messages as read?")) {
                        messages.forEach(m => {
                          if (!m.read) toggleMessageRead(m.id);
                        });
                        showToast("All messages marked as read.", "success");
                      }
                    }} 
                    className="admin-btn admin-btn--secondary"
                    disabled={messages.filter(m => !m.read).length === 0}
                  >
                    Mark All Read
                  </button>
                </div>
              </div>

              <div className="blogs-editor-container">
                <div className="blogs-sidebar-list">
                  <div className="blogs-list-nav">
                    {messages.length === 0 ? (
                      <p className="no-selection-msg" style={{ padding: "var(--space-4)" }}>No messages received yet.</p>
                    ) : (
                      messages.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedMessageId(m.id);
                            if (!m.read) {
                              toggleMessageRead(m.id);
                            }
                          }}
                          className={`blog-nav-item ${selectedMessageId === m.id ? "active" : ""}`}
                          style={{
                            fontWeight: m.read ? "normal" : "bold",
                            borderLeft: m.read ? "none" : "4px solid var(--teal)"
                          }}
                        >
                          <span className="blog-icon">{m.read ? "📩" : "✉️"}</span>
                          <div className="blog-nav-text">
                            <span className="blog-title-short">{m.name}</span>
                            <span className="blog-category-label">
                              {m.date}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="blog-editor-form">
                  {selectedMessageId ? (
                    (() => {
                      const msg = messages.find(m => m.id === selectedMessageId);
                      if (!msg) return <p className="no-selection-msg">Select a message from the sidebar list to view details.</p>;
                      return (
                        <div className="admin-card" style={{ animation: "fadeInUp 0.3s ease" }}>
                          <div className="blog-edit-title-row" style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                            <div>
                              <h3 style={{ fontSize: "var(--text-xl)", color: "var(--teal-deep)" }}>{msg.subject || "No Subject"}</h3>
                              <span style={{ fontSize: "var(--text-xs)", color: "var(--charcoal-muted)", display: "block", marginTop: "var(--space-1)" }}>
                                Received on: {msg.date}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-2)" }}>
                              <button
                                onClick={() => handleToggleRead(msg.id)}
                                className={`admin-btn admin-btn--sm ${msg.read ? "admin-btn--secondary" : "admin-btn--success"}`}
                              >
                                {msg.read ? "✉️ Mark Unread" : "📩 Mark Read"}
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="admin-btn admin-btn--danger admin-btn--sm"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>

                          <div className="grid grid--2" style={{ background: "var(--cream)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)", border: "1px solid var(--cream-dark)" }}>
                            <div>
                              <label style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--teal)" }}>Sender Name</label>
                              <p style={{ margin: "4px 0 0 0", fontSize: "var(--text-sm)", color: "var(--charcoal)" }}>{msg.name}</p>
                            </div>
                            <div>
                              <label style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--teal)" }}>Email Address</label>
                              <p style={{ margin: "4px 0 0 0", fontSize: "var(--text-sm)", color: "var(--charcoal)" }}>
                                <a href={`mailto:${msg.email}`} style={{ color: "var(--saffron-deep)", textDecoration: "none" }}>{msg.email}</a>
                              </p>
                            </div>
                          </div>

                          <div className="form-group">
                            <label style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--teal)" }}>Message Body</label>
                            <div style={{
                              whiteSpace: "pre-wrap",
                              background: "var(--white)",
                              border: "1px solid var(--border-light)",
                              borderRadius: "var(--radius-md)",
                              padding: "var(--space-4)",
                              fontSize: "var(--text-sm)",
                              lineHeight: 1.6,
                              color: "var(--charcoal)",
                              marginTop: "var(--space-2)",
                              minHeight: "150px"
                            }}>
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="no-selection-box">
                      <span>📩</span>
                      <p>Select a message from the sidebar list to view the full details and body text.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// PREMIUM STYLE OVERLAYS FOR THE ADMIN PORTAL
// ────────────────────────────────────────────────────────
function AdminStyles() {
  return (
    <style>{`
      /* Root styles for admin panel specifically */
      .admin-login-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--parchment);
        padding: var(--space-4);
      }
      
      .admin-login-card {
        background: var(--white);
        border: 2px solid var(--saffron-light);
        border-radius: var(--radius-xl);
        padding: var(--space-8);
        max-width: 440px;
        width: 100%;
        box-shadow: var(--shadow-xl);
        backdrop-filter: blur(10px);
        animation: fadeInUp 0.5s ease-out;
      }
      
      .admin-login-header {
        text-align: center;
        margin-bottom: var(--space-6);
      }
      
      .admin-login-emblem {
        font-size: 3rem;
        display: block;
        margin-bottom: var(--space-2);
        animation: spin 8s linear infinite alternate;
      }
      
      .admin-login-header h2 {
        font-family: var(--font-heading);
        color: var(--teal);
        font-size: var(--text-2xl);
        margin-bottom: var(--space-1);
      }
      
      .admin-login-header p {
        color: var(--charcoal-muted);
        font-size: var(--text-sm);
      }
      
      .admin-login-form .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-bottom: var(--space-5);
      }
      
      .admin-login-form label {
        font-weight: 600;
        font-size: var(--text-sm);
        color: var(--charcoal);
      }
      
      .admin-login-form input {
        padding: var(--space-3) var(--space-4);
        border: 1px solid var(--cream-dark);
        border-radius: var(--radius-md);
        background: var(--cream);
        color: var(--charcoal);
        font-size: var(--text-base);
        outline: none;
        transition: border var(--transition-fast);
      }
      
      .admin-login-form input:focus {
        border-color: var(--saffron);
      }
      
      .password-input-container {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
      }
      
      .password-input-container input {
        width: 100%;
        padding-right: 42px !important;
      }
      
      .password-toggle-btn {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--charcoal-muted);
        outline: none;
        user-select: none;
        transition: color var(--transition-fast);
      }
      
      .password-toggle-btn:hover {
        color: var(--saffron-deep);
      }
      
      .error-message {
        color: #d9534f;
        font-size: var(--text-xs);
        margin-top: 4px;
        font-weight: 500;
      }

      /* Admin Buttons */
      .admin-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
        outline: none;
        white-space: nowrap;
      }
      
      .admin-btn--block {
        width: 100%;
      }
      
      .admin-btn--primary {
        background: var(--saffron-deep);
        color: #fff;
      }
      .admin-btn--primary:hover {
        background: var(--saffron);
        transform: translateY(-1px);
      }
      
      .admin-btn--secondary {
        background: var(--cream-dark);
        color: var(--charcoal);
      }
      .admin-btn--secondary:hover {
        background: var(--cream);
      }
      
      .admin-btn--success {
        background: #27ae60;
        color: #fff;
      }
      .admin-btn--success:hover {
        background: #2ecc71;
        transform: translateY(-1px);
      }
      
      .admin-btn--accent {
        background: var(--teal);
        color: #fff;
      }
      .admin-btn--accent:hover {
        background: var(--teal-light);
        transform: translateY(-1px);
      }
      
      .admin-btn--info {
        background: #2980b9;
        color: #fff;
      }
      .admin-btn--info:hover {
        background: #3498db;
        transform: translateY(-1px);
      }
      
      .admin-btn--warning {
        background: #f39c12;
        color: #fff;
      }
      .admin-btn--warning:hover {
        background: #f1c40f;
      }
      
      .admin-btn--danger {
        background: #c0392b;
        color: #fff;
      }
      .admin-btn--danger:hover {
        background: #e74c3c;
      }

      .admin-btn--sm {
        padding: var(--space-1) var(--space-3);
        font-size: var(--text-xs);
      }
      
      .admin-btn--xs {
        padding: 2px var(--space-2);
        font-size: 0.7rem;
      }

      /* Dashboard Layout */
      .admin-dashboard {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--parchment);
      }
      
      .admin-header {
        background: var(--cream);
        border-bottom: 3px solid var(--saffron);
        padding: var(--space-4) var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
      }
      
      @media (min-width: 900px) {
        .admin-header {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
      
      .admin-header__brand {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      
      .admin-header__emblem {
        font-size: 2.2rem;
      }
      
      .admin-header__brand h1 {
        font-size: var(--text-xl);
        font-weight: 800;
        color: var(--teal);
        margin: 0;
        line-height: 1.2;
      }
      
      .admin-header__brand p {
        margin: 0;
        font-size: var(--text-xs);
        color: var(--charcoal-muted);
      }
      
      .admin-header__actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      .admin-save-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: var(--radius-md);
        background: var(--cream-dark);
        border: 1px solid var(--cream-darker);
        color: var(--charcoal);
        transition: all var(--transition-fast);
      }
      .admin-save-status.status-saved {
        border-color: #27ae60;
        background: rgba(39, 174, 96, 0.05);
        color: #27ae60;
      }
      .admin-save-status.status-saving {
        border-color: #f39c12;
        background: rgba(243, 156, 18, 0.05);
        color: #f39c12;
      }
      .admin-save-status.status-error {
        border-color: #c0392b;
        background: rgba(192, 57, 43, 0.05);
        color: #c0392b;
      }

      .admin-save-status .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .admin-save-status .dot-green {
        background-color: #27ae60;
        box-shadow: 0 0 8px #27ae60;
      }
      .admin-save-status .dot-amber {
        background-color: #f39c12;
        box-shadow: 0 0 8px #f39c12;
      }
      .admin-save-status .dot-red {
        background-color: #c0392b;
        box-shadow: 0 0 8px #c0392b;
      }
      
      .admin-main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      @media (min-width: 900px) {
        .admin-main {
          flex-direction: row;
        }
      }
      
      .admin-sidebar {
        background: var(--white);
        border-right: 1px solid var(--border-light);
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      
      @media (min-width: 900px) {
        .admin-sidebar {
          width: 260px;
          min-height: calc(100vh - 80px);
        }
      }
      
      .admin-nav {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        padding: var(--space-2);
        gap: 2px;
      }
      
      @media (min-width: 900px) {
        .admin-nav {
          flex-direction: column;
          overflow-x: visible;
          padding: var(--space-4);
          gap: var(--space-2);
        }
      }
      
      .admin-nav-item {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        text-align: left;
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        color: var(--charcoal-light);
        font-weight: 600;
        font-size: var(--text-sm);
        background: none;
        border: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }
      
      .admin-nav-item:hover {
        background: var(--cream);
        color: var(--saffron-deep);
      }
      
      .admin-nav-item.active {
        background: var(--saffron-pale);
        color: var(--saffron-deep);
      }
      
      .admin-sidebar-footer {
        margin-top: auto;
        padding: var(--space-4);
        border-top: 1px solid var(--border-light);
        display: none;
      }
      
      @media (min-width: 900px) {
        .admin-sidebar-footer {
          display: block;
        }
      }

      .admin-content {
        flex: 1;
        padding: var(--space-6);
        overflow-y: auto;
      }
      
      .admin-tab-pane {
        max-width: 960px;
        margin: 0 auto;
        animation: fadeIn 0.4s ease;
      }
      
      .admin-tab-pane h2 {
        font-family: var(--font-heading);
        color: var(--teal-deep);
        font-size: var(--text-2xl);
        margin-bottom: 2px;
      }
      
      .tab-description {
        color: var(--charcoal-muted);
        font-size: var(--text-sm);
        margin-bottom: var(--space-6);
      }

      /* Card styles in admin */
      .admin-card {
        background: var(--white);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: var(--shadow-sm);
        margin-bottom: var(--space-6);
      }
      
      .admin-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-4);
      }
      
      .admin-card h3 {
        font-size: var(--text-lg);
        color: var(--teal);
        margin-bottom: var(--space-4);
        border-left: 3px solid var(--saffron);
        padding-left: var(--space-2);
        line-height: 1.2;
      }
      
      .admin-card__header h3 {
        margin-bottom: 0;
      }
      
      .grid {
        display: grid;
        gap: var(--space-4);
      }
      
      .grid--2 {
        grid-template-columns: 1fr;
      }
      
      .grid--3 {
        grid-template-columns: 1fr;
      }
      
      @media (min-width: 600px) {
        .grid--2 {
          grid-template-columns: 1fr 1fr;
        }
        .grid--3 {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      
      .form-group.checkbox-group {
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding-top: var(--space-6);
      }
      
      .form-group.checkbox-group label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        cursor: pointer;
      }
      
      .form-group label {
        font-weight: 600;
        font-size: var(--text-sm);
        color: var(--charcoal);
      }
      
      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: var(--space-2) var(--space-3);
        border: 1px solid var(--cream-dark);
        border-radius: var(--radius-md);
        background: var(--cream);
        color: var(--charcoal);
        font-size: var(--text-sm);
        font-family: inherit;
        outline: none;
        transition: border var(--transition-fast);
      }
      
      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        border-color: var(--saffron);
      }
      
      .help-text {
        font-size: 0.75rem;
        color: var(--charcoal-faint);
        margin-top: 2px;
      }
      
      .field-note {
        font-size: var(--text-xs);
        color: var(--charcoal-muted);
        font-style: italic;
        margin-bottom: var(--space-2);
      }

      .admin-image-preview {
        margin-top: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .admin-image-preview span {
        font-weight: 600;
        font-size: var(--text-xs);
        color: var(--charcoal-muted);
      }
      
      .admin-image-preview img {
        max-width: 140px;
        border-radius: var(--radius-md);
        border: 2px solid var(--saffron-pale);
        object-fit: cover;
      }

      /* Bio Paragraphs List */
      .bio-paragraph-item {
        border: 1px solid var(--cream-dark);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        background: var(--cream);
        margin-bottom: var(--space-4);
      }
      
      .paragraph-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-2);
        font-weight: 700;
        font-size: var(--text-xs);
        color: var(--teal-light);
      }

      /* Slideshow Editor */
      .slide-editor-item {
        border-left: 4px solid var(--saffron-light);
      }
      
      .slide-editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid var(--border-light);
      }
      
      .slide-editor-header h4 {
        color: var(--teal);
        margin: 0;
      }
      
      .slide-editor-actions {
        display: flex;
        gap: var(--space-1);
      }

      /* Blogs layout */
      .blogs-editor-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      
      @media (min-width: 768px) {
        .blogs-editor-container {
          flex-direction: row;
          align-items: flex-start;
        }
      }
      
      .blogs-sidebar-list {
        width: 100%;
        background: var(--white);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        max-height: 400px;
        overflow-y: auto;
      }
      
      @media (min-width: 768px) {
        .blogs-sidebar-list {
          width: 250px;
          max-height: calc(100vh - 240px);
          position: sticky;
          top: var(--space-4);
        }
      }
      
      .blogs-list-nav {
        display: flex;
        flex-direction: column;
      }
      
      .blog-nav-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        border: none;
        border-bottom: 1px solid var(--cream-dark);
        background: none;
        text-align: left;
        cursor: pointer;
        transition: all var(--transition-fast);
        width: 100%;
      }
      
      .blog-nav-item:last-child {
        border-bottom: none;
      }
      
      .blog-nav-item:hover {
        background: var(--cream);
      }
      
      .blog-nav-item.active {
        background: var(--saffron-pale);
        border-left: 4px solid var(--saffron-deep);
      }
      
      .blog-icon {
        font-size: var(--text-xl);
      }
      
      .blog-nav-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      
      .blog-title-short {
        font-weight: 600;
        font-size: var(--text-sm);
        color: var(--charcoal);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .blog-category-label {
        font-size: 0.65rem;
        color: var(--charcoal-faint);
        font-weight: 700;
        letter-spacing: 0.5px;
        margin-top: 2px;
      }
      
      .blog-editor-form {
        flex: 1;
        min-width: 0;
      }
      
      .blog-edit-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
        border-bottom: 1px solid var(--border-light);
        padding-bottom: var(--space-2);
      }
      
      .blog-edit-title-row h3 {
        margin: 0;
        border-left: none;
        padding-left: 0;
      }
      
      .no-selection-box {
        background: var(--white);
        border: 2px dashed var(--cream-dark);
        border-radius: var(--radius-lg);
        padding: var(--space-12) var(--space-6);
        text-align: center;
        color: var(--charcoal-muted);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
      }
      
      .no-selection-box span {
        font-size: 2.5rem;
      }
      
      .no-selection-msg {
        text-align: center;
        color: var(--charcoal-faint);
        padding: var(--space-8) 0;
      }

      /* Toast notification styles */
      .admin-toast {
        position: fixed;
        bottom: var(--space-6);
        right: var(--space-6);
        padding: var(--space-3) var(--space-5);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        z-index: 10000;
        font-weight: 600;
        font-size: var(--text-sm);
        animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .admin-toast--success {
        background: #27ae60;
        color: #fff;
      }
      
      .admin-toast--error {
        background: #c0392b;
        color: #fff;
      }
      
      .admin-toast--info {
        background: var(--teal);
        color: #fff;
      }
      
      .toast-icon {
        font-size: var(--text-lg);
      }
      
      /* Animation keyframes */
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(15deg); }
      }
      
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(12px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      @keyframes slideInRight {
        0% { opacity: 0; transform: translateX(40px); }
        100% { opacity: 1; transform: translateX(0); }
      }
    `}</style>
  );
}
