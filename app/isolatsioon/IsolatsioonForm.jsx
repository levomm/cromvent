"use client";

import { useState } from "react";

export default function IsolatsioonForm() {
  const [diameter, setDiameter] = useState("125");
  const [meters, setMeters] = useState(10);

  const pricePerMeter = {
    100: 10,
    125: 12,
    160: 15,
    200: 18,
  };

  const hind = meters * (pricePerMeter[diameter] || 10);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Torustiku isoleerimine</h1>

      <div className="mt-6 flex gap-4">
        <select
          value={diameter}
          onChange={(e) => setDiameter(e.target.value)}
          className="border p-2"
        >
          <option value="100">Ø100</option>
          <option value="125">Ø125</option>
          <option value="160">Ø160</option>
          <option value="200">Ø200</option>
        </select>

        <input
          type="number"
          value={meters}
          onChange={(e) => setMeters(Number(e.target.value))}
          className="border p-2 w-24"
        />
      </div>

      <div className="mt-6 font-bold">Hind ~ {hind} €</div>
    </main>
  );
}
