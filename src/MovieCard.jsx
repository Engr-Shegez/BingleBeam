import React, { useState, useEffect } from "react";

const API_KEY = "22d19f086c563f125db7af6fad49fa8e";

export function MovieCard({ movie }) {
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
