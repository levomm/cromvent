export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center text-center px-6">
      <div className="max-w-3xl">

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Vaikus. Tasakaal. Toimivus.
        </h1>

        <p className="mt-6 text-lg text-gray-400">
          Tulemus, mis peab vastu.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="/kontakt"
            className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10"
          >
            Küsi pakkumist
          </a>
        </div>

      </div>
    </main>
  );
}