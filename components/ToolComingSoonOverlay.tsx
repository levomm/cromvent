import { LoaderCircle } from "lucide-react"

type ToolComingSoonOverlayProps = {
  title?: string
  description?: string
}

export default function ToolComingSoonOverlay({
  title = "Varsti saadaval",
  description = "Viimistleme tööriista enne avalikku kasutust. Preview on nähtav, aga kasutus on hetkel lukus.",
}: ToolComingSoonOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm md:p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(10,18,20,0.92),rgba(6,10,12,0.96))] p-6 text-center shadow-[0_0_50px_rgba(0,180,200,0.12)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{description}</p>
      </div>
    </div>
  )
}
