import { LoaderCircle, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MONETIZATION_PLANS } from "@/lib/monetization"

type UnlockResultCardProps = {
  summary: Array<{ label: string; value: string }>
  quoteSubject: string
  quoteLines: string[]
}

export default function UnlockResultCard({
  summary,
  quoteSubject: _quoteSubject,
  quoteLines: _quoteLines,
}: UnlockResultCardProps) {
  return (
    <Card className="rounded-[2rem] border-cyan-400/20 bg-[linear-gradient(180deg,rgba(15,23,26,0.95),rgba(6,10,12,0.98))] shadow-[0_0_40px_rgba(0,180,200,0.08)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          Tulemus valmis
        </CardTitle>
        <CardDescription>
          Tasuta preview on olemas. Detailne PDF, eksport ja pakkumise voog avatakse peagi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Varsti saadaval</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                {item.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          {MONETIZATION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-medium text-white">{plan.label}</div>
                <div className="mt-1 text-sm text-zinc-400">{plan.description}</div>
              </div>
              <Button
                disabled
                className="rounded-xl bg-cyan-400 text-black opacity-100 hover:bg-cyan-400 disabled:pointer-events-none disabled:opacity-100"
              >
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Varsti saadaval
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-medium text-white">Küsi pakkumist</div>
            <div className="mt-1 text-sm text-zinc-400">
              Kui soovid, teeme sinu projekti põhjal pakkumise ja viime tulemuse ise lõpuni.
            </div>
          </div>
          <Button
            disabled
            variant="outline"
            className="rounded-xl border-white/20 bg-transparent text-white opacity-100 hover:bg-transparent disabled:pointer-events-none disabled:opacity-100"
          >
            <Mail className="h-4 w-4" />
            Varsti saadaval
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
