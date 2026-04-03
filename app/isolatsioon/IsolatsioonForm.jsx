"use client";

import { useState } from "react";

export default function IsolatsioonForm() {
  const [diameter, setDiameter] = useState("125");
  const [meters, setMeters] = useState(10);
  const [type, setType] = useState("lam50");

  const priceTable = {
    100: { lam30: 10, lam50: 12 },
    125: { lam30: 12, lam50: 14 },
    160: { lam30: 15, lam50: 18 },
    200: { lam30: 18, lam50: 22 },
  };

  const base = priceTable[diameter]?.[type] || 12;
  const hind = Math.round(meters * base);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold">Torustiku isoleerimine</h1>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Diameeter</p>
          <div className="grid grid-cols-4 gap-2">
            {["100", "125", "160", "200"].map((d) => (
              <button
                key={d}
                onClick={() => setDiameter(d)}
                className={`p-3 rounded-xl border transition ${
                  diameter === d
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
            value={meters}
            onChange={(e) => setMeters(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-black border border-white/10"
          />
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Isolatsioon</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "lam30", label: "LAM30" },
              { id: "lam50", label: "LAM50" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  type === t.id
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
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
