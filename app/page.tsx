export const metadata = {
  title: "Ventilatsioon, mis töötab",
  description:
    "Ventilatsiooni torustiku ehitus, isoleerimine ja hooldus. Filtrite vahetus ning süsteemide korrastamine Tartus.",
};

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen relative">
      <section className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl md:text-6xl font-bold">
          Ventilatsioonitorustiku ehitus ja isoleerimine
        </h1>

        <p className="mt-6 text-gray-300">
          Torustik, isolatsioon ja hooldus. Teeme nii, et süsteem töötab, mitte lihtsalt ei eksisteeri.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <a
            href="mailto:cromvent@gmail.com"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Küsi pakkumist
          </a>
        </div>

      </section>

      <div className="absolute bottom-4 left-4 flex flex-col gap-3">
        <a href="/filtrid" className="border px-4 py-2">
          Filtrite vahetus
        </a>

        <a href="/isolatsioon" className="border px-4 py-2">
          Isolatsiooni kalkulaator
        </a>
      </div>
    </main>
  );
}