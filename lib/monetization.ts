export const SALES_EMAIL = "cromvent@gmail.com"

export const MONETIZATION_PLANS = [
  {
    id: "simple-pdf",
    label: "Lae PDF (5€)",
    priceLabel: "5€",
    description: "Lihtne PDF kokkuvõte projekti või arvutuse põhjal.",
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_SIMPLE_PDF_LINK || "",
  },
  {
    id: "detailed-pdf",
    label: "Detailne PDF (9€)",
    priceLabel: "9€",
    description: "Detailne materjalinimekiri ja kasutatav kokkuvõte pakkumiseks.",
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_DETAILED_PDF_LINK || "",
  },
  {
    id: "pro-pack",
    label: "Pro pakett (19€)",
    priceLabel: "19€",
    description: "PDF, detailne eksport ja projekti salvestamise valmidus.",
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_PRO_PACK_LINK || "",
  },
] as const

export function buildMailtoHref(subject: string, lines: string[]) {
  const body = lines.join("\n")
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function getPlanHref(
  stripeLink: string,
  fallbackSubject: string,
  fallbackLines: string[],
) {
  if (stripeLink) return stripeLink
  return buildMailtoHref(fallbackSubject, fallbackLines)
}
