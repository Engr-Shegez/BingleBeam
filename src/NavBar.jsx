import React, { useState, useRef, useEffect } from "react";
import { SearchBar } from "./SearchBar";

export function NavBar({
  nav,
  section,
  setSection,
  query,
  setQuery,
  dark,
  setDark,
  genres,
  selectedGenre,
  setSelectedGenre,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

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
        >
          {dark ? "🌙" : "☀️"}
        </button>
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
                className="navbar-link-btn navbar-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
              <SearchBar query={query} setQuery={setQuery} />

              {/* Genre selector for mobile/tablet */}
              <div className="navbar-dropdown-genres">
                <label
                  htmlFor="genre-select"
                  className="navbar-dropdown-genres-label"
                >
                  Genre:
                </label>
                <select
                  id="genre-select"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="navbar-dropdown-genres-select"
                >
                  <option value="">All</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

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
