import initialData from "../data/db.json";

export interface ProfileData {
  heroImage: string;
  name: string;
  title: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  address: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  greeting: string;
  bioParagraphs: string[];
}

export interface SlideData {
  img: string;
  caption: string;
}

export interface BlogData {
  id: string;
  type: "stem" | "guest";
  title: string;
  meta: string;
  excerpt: string;
  link: string;
  image: string;
  gradient: string;
  date: string;
}

export interface PoemData {
  id: string;
  title: string;
  meta: string;
  isHindi: boolean;
  isReflection: boolean;
  lines?: string[];
  content?: string;
  quote?: string;
  quoteAuthor?: string;
  date: string;
  image?: string;
  disclaimer?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PortfolioStore {
  profile: ProfileData;
  slides: SlideData[];
  blogs: BlogData[];
  poetry: PoemData[];
}

const EVENT_NAME = "portfolio-data-update";
const MESSAGES_EVENT = "portfolio-messages-update";

// In-memory cache initialized with default json data
let memoryStore: PortfolioStore = {
  profile: { ...initialData.profile } as ProfileData,
  slides: [...initialData.slides] as SlideData[],
  blogs: [...initialData.blogs] as BlogData[],
  poetry: [...initialData.poetry] as PoemData[],
};

let memoryMessages: ContactMessage[] = [];

// Helper to get authentication headers with JWT access token
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("admin_jwt_token") || "";
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// Auto-refresh: silently refresh an expired access token using the refresh token
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = sessionStorage.getItem("admin_refresh_token");
  if (!refreshToken) return false;

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      // Refresh token also expired — force full re-login
      sessionStorage.removeItem("admin_jwt_token");
      sessionStorage.removeItem("admin_refresh_token");
      sessionStorage.removeItem("admin_authenticated");
      return false;
    }

    const data = await response.json();
    sessionStorage.setItem("admin_jwt_token", data.accessToken);
    return true;
  } catch {
    return false;
  }
};

// Wrapper for authenticated fetch — auto-retries with refreshed token on 401
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = { ...getAuthHeaders(), ...options.headers };
  let response = await fetch(url, { ...options, headers });

  // If access token expired, try refreshing
  if (response.status === 401) {
    const body = await response.clone().json().catch(() => ({}));
    if (body.expired) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request with new access token
        const newHeaders = { ...getAuthHeaders(), ...options.headers };
        response = await fetch(url, { ...options, headers: newHeaders });
      }
    }
  }

  return response;
};


// Asynchronously fetch portfolio from server and update memory cache
export async function fetchPortfolioFromServer() {
  try {
    const response = await fetch("/api/portfolio");
    if (!response.ok) throw new Error("Failed to load portfolio from server");
    
    const data = await response.json();
    
    // Merge server data with fallback structure if needed
    memoryStore = {
      profile: { ...initialData.profile, ...data.profile } as ProfileData,
      slides: data.slides && data.slides.length > 0 ? data.slides : [...initialData.slides],
      blogs: data.blogs && data.blogs.length > 0 ? data.blogs : [...initialData.blogs],
      poetry: data.poetry && data.poetry.length > 0 ? data.poetry : [...initialData.poetry],
    };
    
    // Dispatch standard event to notify all components to re-render in real-time
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: memoryStore }));
  } catch (error) {
    console.warn("Express server offline, operating in offline/local storage fallback mode.", error);
    
    // Local storage fallback for offline support
    try {
      const raw = localStorage.getItem("skrs_portfolio_data_v4");
      if (raw) {
        const parsed = JSON.parse(raw);
        memoryStore = {
          profile: { ...initialData.profile, ...parsed.profile },
          slides: parsed.slides || initialData.slides,
          blogs: parsed.blogs || initialData.blogs,
          poetry: parsed.poetry || initialData.poetry,
        } as PortfolioStore;
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: memoryStore }));
      }
    } catch (e) {
      console.error("Local storage read failed:", e);
    }
  }
}

// Asynchronously fetch contact messages from server
export async function fetchMessagesFromServer() {
  try {
    const response = await authFetch("/api/messages");
    if (!response.ok) throw new Error("Failed to load messages from server");
    
    const serverMessages = await response.json();
    
    // Read local messages from localStorage to find any unsynced offline messages
    let localMessages: ContactMessage[] = [];
    try {
      const raw = localStorage.getItem("skrs_portfolio_messages_v1");
      if (raw) {
        localMessages = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to parse local messages for sync:", e);
    }
    
    // Find messages in localStorage that are not present in serverMessages
    const unsyncedMessages = localMessages.filter(
      (localMsg) => !serverMessages.some((serverMsg: any) => serverMsg.id === localMsg.id)
    );
    
    // If there are unsynced messages, upload them to the server
    if (unsyncedMessages.length > 0) {
      console.log(`Syncing ${unsyncedMessages.length} offline message(s) to server...`);
      for (const msg of unsyncedMessages) {
        try {
          await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msg)
          });
        } catch (err) {
          console.error("Failed to sync offline message:", msg.id, err);
        }
      }
      
      // Re-fetch to get the fully merged list from the server
      const reResponse = await authFetch("/api/messages");
      if (reResponse.ok) {
        memoryMessages = await reResponse.json();
      } else {
        memoryMessages = [...unsyncedMessages, ...serverMessages];
      }
    } else {
      memoryMessages = serverMessages;
    }
    
    // Update local cache and notify listeners
    saveMessages(memoryMessages);
  } catch (error) {
    console.warn("Unable to fetch messages from API server.", error);
    
    // Local storage fallback for offline support
    try {
      const raw = localStorage.getItem("skrs_portfolio_messages_v1");
      if (raw) {
        memoryMessages = JSON.parse(raw);
        window.dispatchEvent(new CustomEvent(MESSAGES_EVENT, { detail: memoryMessages }));
      }
    } catch (e) {
      console.error("Local storage message read failed:", e);
    }
  }
}

// Trigger initial fetches immediately when this script is loaded
fetchPortfolioFromServer();
const isAuthed = sessionStorage.getItem("admin_authenticated") === "true";
if (isAuthed) {
  fetchMessagesFromServer();
}

// ────────────────────────────────────────────────────────
// CORE RETRIEVER (Synchronously returns cached memory store)
// ────────────────────────────────────────────────────────
export function getStore(): PortfolioStore {
  return memoryStore;
}

// Saves full store to server (and backups locally)
export async function saveStore(store: PortfolioStore) {
  memoryStore = store;
  
  // Update local memory and trigger UI updates instantly
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: memoryStore }));
  
  // Backup to localStorage
  try {
    localStorage.setItem("skrs_portfolio_data_v4", JSON.stringify(store));
  } catch (e) {
    console.error("Failed to write to localStorage backup", e);
  }
  
  // Send save request to Express Server API
  try {
    const response = await authFetch("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(store)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to save portfolio to MongoDB Atlas");
    }
    console.log("Portfolio saved successfully to MongoDB Atlas.");
  } catch (error) {
    console.error("Backend write failed. Changes are saved locally but not in MongoDB Atlas.", error);
    throw error; // Let admin interface handle or report the write error if appropriate
  }
}

// Specific section getters/setters
export function getProfile(): ProfileData {
  return getStore().profile;
}

export function saveProfile(profile: ProfileData) {
  const store = getStore();
  store.profile = profile;
  saveStore(store);
}

export function getSlides(): SlideData[] {
  return getStore().slides;
}

export function saveSlides(slides: SlideData[]) {
  const store = getStore();
  store.slides = slides;
  saveStore(store);
}

export function getBlogs(): BlogData[] {
  return getStore().blogs;
}

export function saveBlogs(blogs: BlogData[]) {
  const store = getStore();
  store.blogs = blogs;
  saveStore(store);
}

export function getPoetry(): PoemData[] {
  return getStore().poetry;
}

export function savePoetry(poetry: PoemData[]) {
  const store = getStore();
  store.poetry = poetry;
  saveStore(store);
}

// Reset store to defaults
export function resetToDefaults() {
  saveStore(initialData as PortfolioStore);
}

// Subscribe to store updates
export function subscribeToStore(callback: (store: PortfolioStore) => void): () => void {
  // Call once with current cache
  callback(memoryStore);
  
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<PortfolioStore>;
    callback(customEvent.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}

// ────────────────────────────────────────────────────────
// CONTACT MESSAGES ACTIONS
// ────────────────────────────────────────────────────────

export function getMessages(): ContactMessage[] {
  // If memory messages is empty and authenticated, refresh from server
  if (memoryMessages.length === 0 && sessionStorage.getItem("admin_authenticated") === "true") {
    fetchMessagesFromServer();
  }
  return memoryMessages;
}

export function saveMessages(messages: ContactMessage[]) {
  memoryMessages = messages;
  window.dispatchEvent(new CustomEvent(MESSAGES_EVENT, { detail: memoryMessages }));
  
  try {
    localStorage.setItem("skrs_portfolio_messages_v1", JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to backup messages to localStorage", e);
  }
}

export async function addMessage(name: string, email: string, subject: string, message: string) {
  const id = "msg_" + Math.random().toString(36).substring(2, 11);
  const date = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const newMessage: ContactMessage = {
    id,
    name,
    email,
    subject,
    message,
    date,
    read: false,
  };
  
  // Locally prepend to cache and notify listeners instantly
  const updated = [newMessage, ...memoryMessages];
  saveMessages(updated);
  
  // Post message to Express API backend (Public route)
  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMessage)
    });
    if (!response.ok) throw new Error("Failed to post message to backend");
  } catch (error) {
    console.warn("Message not synchronized to MongoDB Atlas.", error);
  }
}

export async function deleteMessage(id: string) {
  const filtered = memoryMessages.filter((m) => m.id !== id);
  saveMessages(filtered);
  
  // Send delete request to backend (Secure route)
  try {
    const response = await authFetch(`/api/messages/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete message on backend");
  } catch (error) {
    console.error("Delete synchronization to MongoDB Atlas failed.", error);
  }
}

export async function toggleMessageRead(id: string) {
  const updated = memoryMessages.map((m) =>
    m.id === id ? { ...m, read: !m.read } : m
  );
  saveMessages(updated);
  
  // Send put read status request to backend (Secure route)
  try {
    const response = await authFetch(`/api/messages/${id}/read`, {
      method: "PUT"
    });
    if (!response.ok) throw new Error("Failed to update message status on backend");
  } catch (error) {
    console.error("Read status synchronization to MongoDB Atlas failed.", error);
  }
}

export function subscribeToMessages(callback: (messages: ContactMessage[]) => void): () => void {
  callback(memoryMessages);
  
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ContactMessage[]>;
    callback(customEvent.detail);
  };
  window.addEventListener(MESSAGES_EVENT, handler);
  return () => {
    window.removeEventListener(MESSAGES_EVENT, handler);
  };
}
