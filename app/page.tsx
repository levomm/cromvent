export default function Home() {
  return (
    <main>
      {/* HERO */}
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

      {/* TEENUSED */}
      <section id="teenused" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold">Teenused</h2>
            <p className="mt-4 text-gray-400">
              Täpne teostus. Kindel tulemus.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <a
              href="/filtrid"
              className="group p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_0_0_rgba(255,255,255,0)] hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold">Filtrite vahetus</h3>
              <p className="mt-3 text-gray-400 text-sm">
                Regulaarne hooldus tagab puhta õhu ja süsteemi töökindluse.
              </p>
            </a>

            <a
              href="/isolatsioon"
              className="group p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_0_0_rgba(255,255,255,0)] hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold">Torustiku isolatsioon</h3>
              <p className="mt-3 text-gray-400 text-sm">
                Vähendab soojuskadu ja tagab süsteemi efektiivsuse.
              </p>
            </a>

            <a
              href="/torustik"
              className="group p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_0_0_rgba(255,255,255,0)] hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold">Ventilatsiooni hooldus</h3>
              <p className="mt-3 text-gray-400 text-sm">
                Süsteemi kontroll ja korrastamine, et kõik toimiks nagu peab.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
