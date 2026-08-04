import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost:3000";

const DEFAULT_AVATAR =
  "https://img.icons8.com/?size=100&id=23244&format=png&color=000000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  });

  const handleLogin = (t, user) => {
    localStorage.setItem("token", t);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setToken(t);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setToken(null);
    setCurrentUser(null);
  };

  if (!token) return <AuthPage onLogin={handleLogin} />;
  return <Homepage token={token} currentUser={currentUser} onLogout={handleLogout} />;
}

/* ---------------- AUTH ---------------- */

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
    name: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = mode === "login" ? `${API}/auth/login` : `${API}/auth/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (mode === "login") {
        const session = data.data?.session;
        if (session?.access_token) {
          const user = session.user || {};
          onLogin(session.access_token, {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || user.email?.split("@")[0],
            display_name: user.user_metadata?.name || user.email,
          });
        } else {
          setError("Login failed: no token returned.");
        }
      } else {
        setSuccess(data.message);
        setMode("login");
        setForm({ email: "", password: "", password2: "", name: "", username: "" });
      }
    } catch {
      setError("Could not reach the server. Is the backend running?");
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>

        {error && <p className="msg error">{error}</p>}
        {success && <p className="msg success">{success}</p>}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {mode === "signup" && (
            <input
              type="password"
              name="password2"
              placeholder="Confirm password"
              value={form.password2}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
        </form>

        <p className="switch">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button onClick={() => switchMode("signup")}>Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => switchMode("login")}>Log in</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/* ---------------- HOME / FEED ---------------- */

function Homepage({ token, currentUser, onLogout }) {
  const [view, setView] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(new Set());

  const unauth = (res, data) =>
    res.status === 401 || data.error === "Unauthorized login bel";

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (unauth(res, data)) return onLogout();
      if (data.error) throw new Error(data.error);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  const loadFollowing = useCallback(async () => {
    try {
      const res = await fetch(`${API}/users/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (unauth(res, data)) return onLogout();
      if (Array.isArray(data)) setFollowing(new Set(data.map((u) => u.id)));
    } catch {
      /* ignore */
    }
  }, [token, onLogout]);

  useEffect(() => {
    loadPosts();
    loadFollowing();
  }, [loadPosts, loadFollowing]);

  const createPost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (unauth(res, data)) return onLogout();
    if (data.error) return setError(data.error);
    setContent("");
    loadPosts();
  };

  const toggleLike = async (postId) => {
    const res = await fetch(`${API}/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (unauth(res, data)) return onLogout();
    if (data.error) return setError(data.error);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = data.status === "liked";
        return { ...p, likes: [{ count: (p.likes?.[0]?.count || 0) + (liked ? 1 : -1) }] };
      })
    );
  };

  const toggleFollow = async (userIdToFollow) => {
    const isFollowing = following.has(userIdToFollow);
    const res = await fetch(`${API}/users/${userIdToFollow}/${isFollowing ? "unfollow" : "follow"}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (unauth(res, data)) return onLogout();
    if (data.error) return setError(data.error);
    setFollowing((prev) => {
      const next = new Set(prev);
      if (isFollowing) next.delete(userIdToFollow);
      else next.add(userIdToFollow);
      return next;
    });
  };

  return (
    <div className="home-page">
      <Navbar
        view={view}
        onNavigate={setView}
        onLogout={onLogout}
      />

      {view === "profile" ? (
        <Profile token={token} currentUser={currentUser} onLogout={onLogout} />
      ) : (
        <main className="feed">
          {error && <p className="msg error">{error}</p>}

          <form className="composer" onSubmit={createPost}>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <button type="submit">Post</button>
          </form>

          {loading ? (
            <p className="msg">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="msg">No posts yet. Be the first!</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUser?.id}
                isFollowing={following.has(post.user_id)}
                onLike={() => toggleLike(post.id)}
                onFollow={() => toggleFollow(post.user_id)}
              />
            ))
          )}
        </main>
      )}
    </div>
  );
}

function Navbar({ view, onNavigate, onLogout }) {
  return (
    <header className="navbar">
      <h1 className="logo" onClick={() => onNavigate("feed")}>
        InstaClone
      </h1>
      <div className="navbar-actions">
        <button
          className={`nav-btn ${view === "feed" ? "active" : ""}`}
          onClick={() => onNavigate("feed")}
        >
          Home
        </button>
        <button
          className={`nav-btn ${view === "profile" ? "active" : ""}`}
          onClick={() => onNavigate("profile")}
        >
          Profile
        </button>
        <button className="logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

/* ---------------- POST CARD ---------------- */

function PostCard({ post, currentUserId, isFollowing, onLike, onFollow }) {
  const author = post.author || {};
  const isOwn = post.user_id === currentUserId;
  const likes = post.likes?.[0]?.count || 0;
  const avatar = author.avatar_url || DEFAULT_AVATAR;
  const name =
    author.display_name || author.username || (author.id ? "user" : "Unknown");

  return (
    <article className="post-card">
      <div className="post-header">
        <img className="avatar" src={avatar} alt={name} />
        <div className="post-user">
          <span className="post-name">{name}</span>
          <span className="post-time">
            {author.username ? `@${author.username} · ` : ""}
            {timeAgo(post.created_at)}
          </span>
        </div>
        {!isOwn && (
          <button
            className={`follow-btn ${isFollowing ? "following" : ""}`}
            onClick={onFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {post.imageurl && <img className="post-image" src={post.imageurl} alt="" />}
      <p className="post-content">{post.content}</p>

      <div className="post-footer">
        <button className={`like-btn ${likes > 0 ? "liked" : ""}`} onClick={onLike}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={likes > 0 ? "currentColor" : "none"}>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={likes > 0 ? "currentColor" : "none"}
              stroke="currentColor"
            />
          </svg>
          <span>{likes}</span>
        </button>
      </div>
    </article>
  );
}

/* ---------------- PROFILE ---------------- */

function Profile({ token, _currentUser, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.status === 401 || data.error === "Unauthorized login bel")
          return onLogout();
        if (data.error) throw new Error(data.error);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, onLogout]);

  if (loading) return <main className="feed"><p className="msg">Loading...</p></main>;
  if (error) return <main className="feed"><p className="msg error">{error}</p></main>;
  if (!profile) return <main className="feed"><p className="msg">No profile.</p></main>;

  return (
    <main className="profile-page">
      <div className="profile-card">
        <img
          className="avatar large"
          src={profile.avatar_url || DEFAULT_AVATAR}
          alt={profile.username}
        />
        <h2>{profile.display_name}</h2>
        <span className="profile-username">@{profile.username}</span>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        <div className="profile-stats">
          <span>{profile.posts?.length || 0} posts</span>
          <span>following</span>
          <span>followers</span>
        </div>
      </div>

      <div className="profile-posts">
        {profile.posts?.length === 0 ? (
          <p className="msg">No posts yet.</p>
        ) : (
          profile.posts.map((post) => (
            <article className="post-card" key={post.id}>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <span className="like-btn liked">
                  ♥ {post.likes?.[0]?.count || 0}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

/* ---------------- HELPERS ---------------- */

function timeAgo(dateString) {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString();
}

export default App;