export default function FiltridPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold">Filtrite vahetus</h1>

        <p className="mt-4 text-gray-400">
          Regulaarne hooldus tagab puhta õhu ja süsteemi töökindluse.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition">
            <h2 className="text-xl font-semibold">1x aastas</h2>
            <p className="text-gray-400 mt-2">
              Ühekordne hooldus ja filtrite vahetus
            </p>
            <p className="mt-4 text-2xl font-semibold">alates 50 €</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition">
            <h2 className="text-xl font-semibold">2x aastas</h2>
            <p className="text-gray-400 mt-2">
              Regulaarne hooldus + meeldetuletus
            </p>
            <p className="mt-4 text-2xl font-semibold">alates 90 €</p>
          </div>
        </div>

        <button className="mt-8 w-full py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition">
          Broneeri hooldus
        </button>
      </div>
    </main>
  );
}
