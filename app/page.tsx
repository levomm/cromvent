"use client";

import { useEffect, useState } from "react";
import Background from "@/components/Background";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative overflow-hidden">
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-1000 ${
          showIntro ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,200,0.18),transparent_60%)]" />
        <Background />
      </div>

      <div
        className={`transition-opacity duration-1000 ${
          showIntro ? "opacity-0" : "opacity-100"
        }`}
      >
        <section>
          <div className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,200,0.15),transparent_60%)]" />

            <div className="relative z-10 max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Vaikus. Tasakaal. Toimivus.
              </h1>

              <p className="mt-6 text-lg text-gray-400">
                Tulemus, mis peab vastu.
              </p>

              <div className="mt-8">
                <a
                  href="#teenused"
                  className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition"
                >
                  Vaata teenuseid
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="teenused" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold">Teenused</h2>
              <p className="mt-4 text-gray-400">
                Täpne teostus. Kindel tulemus.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <a
                href="/filtrid"
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                <h3 className="text-xl font-semibold">Filtrite vahetus</h3>
                <p className="mt-3 text-sm text-gray-400">
                  Regulaarne hooldus tagab puhta õhu ja süsteemi töökindluse.
                </p>
              </a>

              <a
                href="/isolatsioon"
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                <h3 className="text-xl font-semibold">Torustiku isolatsioon</h3>
                <p className="mt-3 text-sm text-gray-400">
                  Vähendab soojuskadu ja tagab süsteemi efektiivsuse.
                </p>
              </a>

              <a
                href="/torustik"
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                <h3 className="text-xl font-semibold">Ventilatsiooni hooldus</h3>
                <p className="mt-3 text-sm text-gray-400">
                  Süsteemi kontroll ja korrastamine, et kõik toimiks nagu peab.
                </p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
