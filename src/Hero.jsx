import React from "react";
import { TMDB_MOVIE_URL } from "./App";

export function Hero({ movie }) {
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
