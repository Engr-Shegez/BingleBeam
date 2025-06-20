import React, { useEffect, useState, useRef } from "react";
import "./index.css";

const API_KEY = "22d19f086c563f125db7af6fad49fa8e";
const TMDB_MOVIE_URL = "https://www.themoviedb.org/movie/";

const NAV = [
  { label: "Popular 🔥", endpoint: "popular" },
  { label: "Top Rated ⭐", endpoint: "top_rated" },
  { label: "Upcoming 😃", endpoint: "upcoming" },
];

const STAR_FILTERS = [
  { label: "6-star movies", value: 6 },
  { label: "7-star movies", value: 7 },
  { label: "8-star movies", value: 8 },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState(NAV[0].endpoint);
  const [star, setStar] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !dark);
  }, [dark]);

  // Search
  useEffect(() => {
    if (!query) return;
    const ctrl = new AbortController();
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`,
      { signal: ctrl.signal }
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch(() => setMovies([]));
    return () => ctrl.abort();
  }, [query]);

  // Hero
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results?.length) {
          setHero(
            data.results[Math.floor(Math.random() * data.results.length)]
          );
        }
      });
  }, []);

  // Section
  useEffect(() => {
    if (query) return;
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/movie/${section}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .finally(() => setLoading(false));
  }, [section, query]);

  const shownMovies = star
    ? movies.filter((m) => Math.floor(m.vote_average) === star)
    : movies;

  return (
    <div>
      <NavBar
        nav={NAV}
        section={section}
        setSection={setSection}
        query={query}
        setQuery={setQuery}
        dark={dark}
        setDark={setDark}
      />
      <StarNav star={star} setStar={setStar} />
      <Hero movie={hero} />
      <Header nav={NAV} section={section} />
      <MovieGrid loading={loading} movies={shownMovies} />
    </div>
  );
}

function NavBar({ nav, section, setSection, query, setQuery, dark, setDark }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  // Responsive close
  useEffect(() => {
    function close(e) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !burgerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <nav className="navbar">
      <div className="navbar-brand-group">
        <div className="navbar-brand">🎬 BingleBeam</div>
        <button
          className="theme-toggle"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle light/dark mode"
          style={{
            marginLeft: "1rem",
            fontSize: "1.2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </div>
      <div className="navbar-spacer" />
      <div className="navbar-desktop">
        <SearchBar query={query} setQuery={setQuery} />
        <div className="navbar-links">
          {nav.map((n) => (
            <button
              key={n.endpoint}
              className={`navbar-link-btn${
                section === n.endpoint ? " active" : ""
              }`}
              onClick={() => setSection(n.endpoint)}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
      <button
        className={`hamburger${open ? " open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        ref={burgerRef}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <>
          <div className="navbar-overlay show" tabIndex={-1} />
          <aside
            className="navbar-dropdown show"
            ref={menuRef}
            role="menu"
            aria-modal="true"
          >
            <div className="navbar-dropdown-content">
              <button
                className="navbar-link-btn"
                style={{
                  alignSelf: "flex-end",
                  marginBottom: "1rem",
                  background: "#232526",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
              <SearchBar query={query} setQuery={setQuery} />
              <div className="navbar-dropdown-links">
                {nav.map((n) => (
                  <button
                    key={n.endpoint}
                    className={`navbar-link-btn${
                      section === n.endpoint ? " active" : ""
                    }`}
                    onClick={() => {
                      setSection(n.endpoint);
                      setOpen(false);
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </>
      )}
    </nav>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function StarNav({ star, setStar }) {
  return (
    <nav className="navbar secondary-navbar">
      <div className="navbar-spacer"></div>
      <ul className="star-filter-list">
        {STAR_FILTERS.map((f) => (
          <li
            key={f.value}
            className={star === f.value ? "active" : ""}
            onClick={() => setStar(star === f.value ? null : f.value)}
          >
            {f.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero({ movie }) {
  if (!movie) return null;
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: movie.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "#232526",
      }}
      onClick={() => window.open(`${TMDB_MOVIE_URL}${movie.id}`, "_blank")}
      title="Click to view movie details"
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-title">{movie.title}</h2>
          <p className="hero-overview">
            {movie.overview.length > 180
              ? movie.overview.slice(0, 180) + "..."
              : movie.overview}
          </p>
          <button className="hero-play-btn">▶ Play</button>
        </div>
      </div>
    </section>
  );
}

function Header({ nav, section }) {
  const sec = nav.find((n) => n.endpoint === section);
  return (
    <header className="app-header">
      <h1 className="app-title">{sec.label} Movies</h1>
      <p className="app-subtitle">
        Discover the {sec.label.toLowerCase()} movies right now!
      </p>
    </header>
  );
}

function MovieGrid({ loading, movies }) {
  if (loading)
    return (
      <div className="loading">
        <span role="img" aria-label="popcorn">
          🍿
        </span>{" "}
        Loading movies...
      </div>
    );
  return (
    <main className="movies-grid">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </main>
  );
}

function MovieCard({ movie }) {
  const [trailer, setTrailer] = useState(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover || trailer) return;
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const t = data.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (t) setTrailer(t.key);
      });
    // eslint-disable-next-line
  }, [hover]);

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {hover && trailer ? (
        <>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0`}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ display: "block" }}
          />
          <div className="movie-details-overlay">
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-info">
              <span className="movie-rating">⭐ {movie.vote_average}</span>
              <span className="movie-date">{movie.release_date}</span>
            </div>
          </div>
        </>
      ) : movie.poster_path ? (
        <>
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-details">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-overview">
              {movie.overview && movie.overview.length > 120
                ? movie.overview.slice(0, 120) + "..."
                : movie.overview}
            </p>
            <div className="movie-info">
              <span className="movie-rating">⭐ {movie.vote_average}</span>
              <span className="movie-date">{movie.release_date}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="no-image">No Image</div>
      )}
    </div>
  );
}
