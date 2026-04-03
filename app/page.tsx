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
          <div className="relative flex min-h-[72svh] items-center justify-center overflow-hidden px-6 pt-24 pb-14 text-center sm:min-h-screen sm:py-0">
            <div className="absolute inset-0 bg-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,200,0.15),transparent_60%)]" />

            <div className="relative z-10 max-w-3xl">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
                Täpsed lahendused ventilatsioonile
              </h1>

              <p className="mt-5 text-base text-gray-300 sm:mt-6 sm:text-lg">
                Arvuta oma lahendus
              </p>

              <div className="mt-7 sm:mt-8">
                <a
                  href="#teenused"
                  className="rounded-xl border border-white/20 px-6 py-3 transition hover:bg-white/10"
                >
                  Vaata teenuseid
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="teenused" className="px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Teenused</h2>
              <p className="mt-4 text-gray-400">
                Täpne teostus. Kindel tulemus.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
              <a
                href="/filtrid"
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] md:p-8"
              >
                <h3 className="text-xl font-semibold">Filtrite vahetus</h3>
                <p className="mt-3 text-sm text-gray-400">
                  Regulaarne hooldus tagab puhta õhu ja süsteemi töökindluse.
                </p>
              </a>

              <a
                href="/isolatsioon"
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] md:p-8"
              >
                <h3 className="text-xl font-semibold">Torustiku isolatsioon</h3>
                <p className="mt-3 text-sm text-gray-400">
                  Vähendab soojuskadu ja tagab süsteemi efektiivsuse.
                </p>
              </a>

              <a
                href="/torustik"
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] md:p-8"
              >
                <h3 className="text-xl font-semibold">Ventilatsiooni hooldus</h3>
                <p className="mt-3 text-sm text-gray-400">
                  Süsteemi kontroll ja korrastamine, et kõik toimiks nagu peab.
                </p>
              </a>
            </div>

            <div className="mt-10 text-center">
              <a
                href="/materjalikalkulaator"
                className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Ava PDF materjalikalkulaator
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
