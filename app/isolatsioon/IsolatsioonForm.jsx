"use client";

import { useState } from "react";

const diameters = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250];

const baseTable = {
  100: 10,
  125: 12,
  160: 15,
  200: 18,
  250: 22,
  315: 28,
  400: 35,
  500: 45,
  630: 60,
  800: 80,
  1000: 110,
  1250: 140,
};

const thicknessFactor = {
  30: 1,
  50: 1.2,
  100: 1.6,
};

const btn = (active) =>
  `p-3 rounded-xl border text-left transition ${
    active
      ? "border-cyan-400 bg-cyan-400/10"
      : "border-white/10 hover:bg-white/5"
  }`;

export default function IsolatsioonForm() {
  const [diameter, setDiameter] = useState("125");
  const [meters, setMeters] = useState(10);
  const [thickness, setThickness] = useState("50");
  const [complexity, setComplexity] = useState("1");

  const base = baseTable[diameter] || 12;
  const tFactor = thicknessFactor[thickness] || 1.2;
  const cFactor = Number(complexity);
  const hind = Math.round(meters * base * tFactor * cFactor);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold">Torustiku isoleerimine</h1>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Diameeter</p>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {diameters.map((d) => (
              <button
                key={d}
                onClick={() => setDiameter(String(d))}
                className={`p-3 rounded-xl border text-sm transition ${
                  diameter === String(d)
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                Ø{d}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Pikkus (m)</p>
          <input
            type="number"
            min="0"
            value={meters}
            onChange={(e) => setMeters(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-black border border-white/10"
          />
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Paksus</p>

          <div className="grid grid-cols-3 gap-2">
            {["30", "50", "100"].map((t) => (
              <button
                key={t}
                onClick={() => setThickness(t)}
                className={`p-3 rounded-xl border ${
                  thickness === t
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {t} mm
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Keerukus</p>

          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => setComplexity("1")} className={btn(complexity === "1")}>
              Sirge toru
            </button>

            <button
              onClick={() => setComplexity("1.2")}
              className={btn(complexity === "1.2")}
            >
              Mõõdukas (põlved)
            </button>

            <button
              onClick={() => setComplexity("1.5")}
              className={btn(complexity === "1.5")}
            >
              Keeruline süsteem
            </button>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
          <p className="text-gray-400 text-sm">Hinnanguline maksumus</p>
          <p className="text-3xl font-semibold mt-2">{hind} €</p>
        </div>

        <div className="mt-6">
          <button className="w-full py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition">
            Küsi pakkumist
          </button>
        </div>
      </div>
    </main>
  );
}
