import React from "react";
import { MovieCard } from "./MovieCard";

export function MovieGrid({ loading, movies }) {
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
