import React, { useEffect, useState } from "react";
import "./index.css";
import { StarNav } from "./StarNav";
import { Hero } from "./Hero";
import { Header } from "./Header";
import { MovieGrid } from "./MovieGrid";
import { NavBar } from "./NavBar";
import Footer from "./Footer";

const API_KEY = "22d19f086c563f125db7af6fad49fa8e";
export const TMDB_MOVIE_URL = "https://www.themoviedb.org/movie/";

const NAV = [
  { label: "Popular 🔥", endpoint: "popular" },
  { label: "Top Rated ⭐", endpoint: "top_rated" },
  { label: "Upcoming 😃", endpoint: "upcoming" },
  { label: "Now Playing 🎥", endpoint: "now_playing" },
];

// eslint-disable-next-line
export const STAR_FILTERS = [
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
  const [dark, setDark] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !dark);
  }, [dark]);

  // Search
  useEffect(() => {
    if (!query) return;
    const ctrl = new AbortController();
    async function fetchMovies() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            query
          )}`,
          { signal: ctrl.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        if (err.name !== "AbortError") setMovies([]);
      }
    }
    fetchMovies();
    return () => ctrl.abort();
  }, [query]);

  // Hero
  useEffect(() => {
    const ctrl = new AbortController();
    async function fetchHero() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        if (data.results?.length) {
          setHero(
            data.results[Math.floor(Math.random() * data.results.length)]
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") setHero(null);
      }
    }
    fetchHero();
  }, []);

  useEffect(() => {
    async function fetchGenres() {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    }
    fetchGenres();
  }, []);

  // Section
  useEffect(() => {
    if (query) return;
    const ctrl = new AbortController();
    async function loadingSection() {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/movie/${section}?api_key=${API_KEY}`;
        if (selectedGenre) {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`;
        }
        const res = await fetch(url, { signal: ctrl.signal });

        const data = await res.json();
        setMovies(data.results || []);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") setLoading(false);
      }
    }
    loadingSection();
  }, [section, query, selectedGenre]);

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
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={(genreId) => {
          setSelectedGenre(genreId);
          setQuery("");
          setSection(NAV[0].endpoint);
        }}
      />
      <div className="max-width-container">
        <StarNav star={star} setStar={setStar} />
        <div className="desktop-only">
          <Genre
            selectedGenre={selectedGenre}
            setSelectedGenre={(genreId) => {
              setSelectedGenre(genreId);
              setQuery("");
              setSection(NAV[0].endpoint);
            }}
            genres={genres}
          />
        </div>

        <Hero movie={hero} />
        <Header nav={NAV} section={section} />
        <MovieGrid loading={loading} movies={shownMovies} />
      </div>
      <Footer />
    </div>
  );
}

function Genre({ selectedGenre, setSelectedGenre, genres }) {
  return (
    <div className="genre-cards-container">
      <div
        className={`genre-card${selectedGenre === null ? "selected" : ""}`}
        onClick={() => setSelectedGenre(null)}
      >
        All Genres
      </div>
      {genres.map((g) => (
        <div
          key={g.id}
          className={`genre-card${selectedGenre === g.id ? "selected" : ""}`}
          onClick={() => setSelectedGenre(g.id)}
        >
          {g.name}
        </div>
      ))}
    </div>
  );
}
