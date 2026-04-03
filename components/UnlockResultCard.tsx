import { FileText, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buildMailtoHref, getPlanHref, MONETIZATION_PLANS } from "@/lib/monetization"

type UnlockResultCardProps = {
  summary: Array<{ label: string; value: string }>
  quoteSubject: string
  quoteLines: string[]
}

export default function UnlockResultCard({
  summary,
  quoteSubject,
  quoteLines,
}: UnlockResultCardProps) {
  const quoteHref = buildMailtoHref(quoteSubject, quoteLines)

  return (
    <Card className="rounded-[2rem] border-cyan-400/20 bg-[linear-gradient(180deg,rgba(15,23,26,0.95),rgba(6,10,12,0.98))] shadow-[0_0_40px_rgba(0,180,200,0.08)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          Tulemus valmis
        </CardTitle>
        <CardDescription>
          Tasuta preview on olemas. Detailne PDF ja kasutatav väljund pakkumiseks on tasulised.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
          {MONETIZATION_PLANS.map((plan) => {
            const href = getPlanHref(plan.stripeLink, `${quoteSubject} – ${plan.label}`, [
              ...quoteLines,
              "",
              `Soovitud tasuline väljund: ${plan.label}`,
              `Paketi hind: ${plan.priceLabel}`,
            ])

            return (
              <div
                key={plan.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-medium text-white">{plan.label}</div>
                  <div className="mt-1 text-sm text-zinc-400">{plan.description}</div>
                </div>
                <Button
                  asChild
                  className="rounded-xl bg-cyan-400 text-black hover:bg-cyan-300"
                >
                  <a href={href}>
                    <FileText className="h-4 w-4" />
                    Ava
                  </a>
                </Button>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-medium text-white">Küsi pakkumist</div>
            <div className="mt-1 text-sm text-zinc-400">
              Kui soovid, teeme sinu projekti põhjal pakkumise ja viime tulemuse ise lõpuni.
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10">
            <a href={quoteHref}>
              <Mail className="h-4 w-4" />
              Küsi pakkumist
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
