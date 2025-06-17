/*
  BingleBeam Movie App - Step-by-Step Overview

  1. Import React, useState, useEffect, and CSS styles.
  2. Define constants for API key, TMDB URLs, navigation options, and star filters.
  3. Set up React state:
     - starFilter: for filtering movies by star rating.
     - movies: stores the list of movies fetched from TMDB.
     - activeSection: tracks which movie section (Popular, Top Rated, Upcoming) is active.
     - loading: indicates if movies are being fetched.
     - heroMovie: stores a randomly selected top-rated movie for the hero section.
  4. useEffect (on mount): Fetch top-rated movies and randomly select one for the hero section.
  5. useEffect (on activeSection change): Fetch movies for the selected section (Popular, Top Rated, Upcoming).
  6. Filter movies by star rating if a filter is selected.
  7. Render:
     - Primary navbar for section navigation.
     - Secondary navbar for star rating filters.
     - Hero section showing a random top-rated movie with background image and play button.
     - Header with section title and subtitle.
     - Main grid displaying filtered movies as cards, with details shown on hover.
*/

import React, { useEffect, useState, useRef } from "react";
import "./index.css";

// TMDB API key and URLs
const API_KEY = "22d19f086c563f125db7af6fad49fa8e";
const TMDB_MOVIE_URL = "https://www.themoviedb.org/movie/";

// Navigation options for main sections
const NAV_OPTIONS = [
  { label: "Popular 🔥", endpoint: "popular" },
  { label: "Top Rated ⭐", endpoint: "top_rated" },
  { label: "Upcoming 😃", endpoint: "upcoming" },
];

// Star rating filter options
const STAR_FILTERS = [
  { label: "6-star movies", value: 6 },
  { label: "7-star movies", value: 7 },
  { label: "8-star movies", value: 8 },
];

export default function App() {
  const [query, setQuery] = useState("");
  // State for active movie section (Popular, Top Rated, Upcoming)
  const [activeSection, setActiveSection] = useState(NAV_OPTIONS[0].endpoint);

  // State for star filter selection
  const [starFilter, setStarFilter] = useState(null);
  // State for fetched movies
  const [movies, setMovies] = useState([]);

  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for hero section movie
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
              query
            )}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          setMovies(data.results);
        } catch (err) {
          if (err.name !== "AbortError") setMovies("Error fetching rates");
        }
      }
      fetchMovies();
    },
    [query]
  );

  // Fetch a random top-rated movie for the hero section on mount
  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          // Pick a random movie from the results
          const randomIndex = Math.floor(Math.random() * data.results.length);
          setHeroMovie(data.results[randomIndex]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchHeroMovie();
  }, []);

  // Fetch movies for the selected section (Popular, Top Rated, Upcoming)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${activeSection}?api_key=${API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error(error);
        setMovies([]);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [activeSection]);

  // Filter movies by selected star rating, if any
  const filteredMovies = starFilter
    ? movies.filter((movie) => Math.floor(movie.vote_average) === starFilter)
    : movies;

  return (
    <div>
      <ResponsiveNavBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        query={query}
        setQuery={setQuery}
      />

      <StarRatingNavBar starFilter={starFilter} setStarFilter={setStarFilter} />

      <HeroSection heroMovie={heroMovie} />

      <SectionHeader activeSection={activeSection} />

      <MainBar loading={loading} filteredMovies={filteredMovies} />
    </div>
  );
}

// --- ResponsiveNavBar Component ---
function ResponsiveNavBar({
  activeSection,
  setActiveSection,
  query,
  setQuery,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Track window width for responsive logic
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024 && menuOpen) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // --- Add this useEffect to auto-close menu on desktop ---
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024 && menuOpen) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // Close menu on ESC or click outside
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function handleClick(e) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen]);

  // Trap focus in menu when open
  useEffect(() => {
    if (!menuOpen) return;
    const focusable = menuRef.current.querySelectorAll(
      "button, [tabindex]:not([tabindex='-1'])"
    );
    if (focusable.length) focusable[0].focus();
    function trap(e) {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    menuRef.current.addEventListener("keydown", trap);
    return () =>
      menuRef.current && menuRef.current.removeEventListener("keydown", trap);
  }, [menuOpen]);

  // Navigation links for dropdown and desktop
  const navLinks = (
    <>
      {NAV_OPTIONS.map((option) => (
        <button
          key={option.endpoint}
          className={`navbar-link-btn${
            activeSection === option.endpoint ? " active" : ""
          }`}
          onClick={() => {
            setActiveSection(option.endpoint);
            setMenuOpen(false);
          }}
          tabIndex={0}
        >
          {option.label}
        </button>
      ))}
      {/* Example extra links */}
      <button className="navbar-link-btn" tabIndex={0}>
        About
      </button>
      <button className="navbar-link-btn" tabIndex={0}>
        Contact
      </button>
    </>
  );

  return (
    <nav className="navbar responsive-navbar">
      <NavBrand />
      <div className="navbar-spacer" />
      <div className="navbar-desktop">
        <SeachBar query={query} setQuery={setQuery} />
        <div className="navbar-links">
          {NAV_OPTIONS.map((option) => (
            <button
              key={option.endpoint}
              className={`navbar-link-btn${
                activeSection === option.endpoint ? " active" : ""
              }`}
              onClick={() => setActiveSection(option.endpoint)}
              tabIndex={0}
            >
              {option.label}
            </button>
          ))}
          {/* Add About/Contact if you want */}
        </div>
      </div>
      {/* Hamburger for ≤1024px */}
      <button
        className={`hamburger${menuOpen ? " open" : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="navbar-dropdown"
        onClick={() => setMenuOpen((o) => !o)}
        ref={hamburgerRef}
      >
        <span />
        <span />
        <span />
      </button>
      {/* Overlay and Dropdown - only render when menuOpen */}
      {menuOpen && (
        <>
          <div
            className="navbar-overlay show"
            tabIndex={-1}
            aria-hidden={!menuOpen}
          />
          <aside
            className="navbar-dropdown show"
            id="navbar-dropdown"
            ref={menuRef}
            role="menu"
            aria-modal="true"
          >
            <div className="navbar-dropdown-content">
              {/* Only show X button for tablet (width > 600px) */}
              {windowWidth > 600 && (
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
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              )}

              {/* Search bar with Search & Close button */}
              <SeachBar
                query={query}
                setQuery={setQuery}
                onSearchClose={() => setMenuOpen(false)}
                showSearchClose
              />
              <div className="navbar-dropdown-links">{navLinks}</div>
            </div>
          </aside>
        </>
      )}
    </nav>
  );
}

function NavBrand() {
  return <div className="navbar-brand">🎬 BingleBeam</div>;
}

function SeachBar({ query, setQuery }) {
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

function NavLinks({ activeSection, setActiveSection }) {
  return (
    <div>
      <ul className="navbar-links">
        {NAV_OPTIONS.map((option) => (
          <li
            key={option.endpoint}
            className={activeSection === option.endpoint ? "active" : ""}
            onClick={() => setActiveSection(option.endpoint)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StarRatingNavBar({ starFilter, setStarFilter }) {
  {
    /* Star rating filter navbar */
  }
  return (
    <nav className="navbar secondary-navbar">
      <div className="navbar-spacer"></div>
      <ul className="star-filter-list">
        {STAR_FILTERS.map((filter) => (
          <li
            key={filter.value}
            className={starFilter === filter.value ? "active" : ""}
            onClick={() =>
              setStarFilter(starFilter === filter.value ? null : filter.value)
            }
          >
            {filter.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HeroSection({ heroMovie }) {
  return (
    <div>
      {/* Hero section with random top-rated movie */}
      {heroMovie && (
        <section
          className="hero-section"
          style={{
            backgroundImage: heroMovie.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
              : "#232526",
          }}
          onClick={() =>
            window.open(`${TMDB_MOVIE_URL}${heroMovie.id}`, "_blank")
          }
          title="Click to view movie details"
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <h2 className="hero-title">{heroMovie.title}</h2>
              <p className="hero-overview">
                {/* Truncate overview if too long */}
                {heroMovie.overview.length > 180
                  ? heroMovie.overview.slice(0, 180) + "..."
                  : heroMovie.overview}
              </p>
              <button className="hero-play-btn">▶ Play</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ activeSection }) {
  return (
    <div>
      {/* Section header */}
      <header className="app-header">
        <h1 className="app-title">
          {NAV_OPTIONS.find((opt) => opt.endpoint === activeSection).label}{" "}
          Movies
        </h1>
        <p className="app-subtitle">
          Discover the{" "}
          {NAV_OPTIONS.find(
            (opt) => opt.endpoint === activeSection
          ).label.toLowerCase()}{" "}
          movies right now!
        </p>
      </header>
    </div>
  );
}

function MainBar({ loading, filteredMovies }) {
  {
    /* Loading indicator or movies grid */
  }
  return loading ? (
    <div className="loading">
      <span role="img" aria-label="popcorn">
        🍿
      </span>{" "}
      Loading movies...
    </div>
  ) : (
    <main className="movies-grid">
      {/* Render filtered movie cards */}
      {filteredMovies.map((movie) => (
        <div className="movie-card" key={movie.id}>
          {movie.poster_path ? (
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <div className="movie-details">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-overview">
              {/* Truncate overview if too long */}
              {movie.overview.length > 120
                ? movie.overview.slice(0, 120) + "..."
                : movie.overview}
            </p>
            <div className="movie-info">
              <span className="movie-rating">⭐ {movie.vote_average}</span>
              <span className="movie-date">{movie.release_date}</span>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
