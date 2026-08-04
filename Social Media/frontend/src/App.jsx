import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost:3000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return token ? (
    <Homepage
        token={token}
        onLogout={() => {
          localStorage.removeItem("token");
          setToken(null);
        }}
      />
  ) : (
    <AuthPage
      onLogin={(t) => {
        localStorage.setItem("token", t);
        setToken(t);
      }}
    />
  );
}

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
        const accessToken = data.data?.session?.access_token;
        if (accessToken) {
          onLogin(accessToken);
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

function Homepage({ token, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401 || data.error === "Unauthorized login bel") {
        onLogout();
        return;
      }
      if (data.error) throw new Error(data.error);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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
    if (res.status === 401 || data.error === "Unauthorized login bel") {
      onLogout();
      return;
    }
    if (data.error) {
      setError(data.error);
      return;
    }
    setContent("");
    loadPosts();
  };

  const toggleLike = async (postId) => {
    const res = await fetch(`${API}/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.status === 401 || data.error === "Unauthorized login bel") {
      onLogout();
      return;
    }
    if (data.error) {
      setError(data.error);
      return;
    }
    loadPosts();
  };

  return (
    <div className="home-page">
      <header className="navbar">
        <h1>Social Media</h1>
        <button className="logout" onClick={onLogout}>
          Log out
        </button>
      </header>

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
            <article className="post" key={post.id}>
              <p className="post-content">{post.content}</p>
              <button
                className="like"
                onClick={() => toggleLike(post.id)}
              >
                {post.likes?.length ? `♥ ${post.likes[0].count}` : "♥ 0"}
              </button>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

export default App;
