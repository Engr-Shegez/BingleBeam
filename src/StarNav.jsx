import React from "react";
import { STAR_FILTERS } from "./App";

export function StarNav({ star, setStar }) {
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
