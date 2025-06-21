import React from "react";

export function Header({ nav, section }) {
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
