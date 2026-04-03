"use client";

import { useState } from "react";

export default function FiltridForm() {
  const [type, setType] = useState("one");

  const hind =
    type === "one"
      ? "50€ + km + filtrid"
      : "35€ / kord + km + filtrid";

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Filtrite vahetus</h1>

      <button onClick={() => setType("one")}>Ühekordne</button>
      <button onClick={() => setType("sub")}>Hooajaline</button>

      <div>{hind}</div>
    </main>
  );
}