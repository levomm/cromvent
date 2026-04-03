"use client";

import { useMemo, useState } from "react";
import { BellRing, CalendarDays, CheckCircle2, Filter, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PLANS = {
  one: {
    id: "one",
    title: "1x aastas",
    price: 50,
    description: "Ühekordne hooldus ja filtrite vahetus.",
    reminderIncluded: false,
    summary: "Ühekordne hooldus",
  },
  sub: {
    id: "sub",
    title: "2x aastas",
    price: 90,
    description: "Hooajaline subscription koos meeldetuletusega.",
    reminderIncluded: true,
    summary: "Hooajaline 2x aastas hooldus",
  },
};

const MONTH_OPTIONS = [
  "Jaanuar",
  "Veebruar",
  "Märts",
  "Aprill",
  "Mai",
  "Juuni",
  "Juuli",
  "August",
  "September",
  "Oktoober",
  "November",
  "Detsember",
];

const DEVICE_BRANDS = [
  "Flexit",
  "Systemair",
  "Komfovent",
  "Vallox",
  "Swegon",
  "Enervent",
  "Salda",
  "Zehnder",
  "Muu / ei tea",
];

const WEEK_OPTIONS = Array.from({ length: 52 }, (_, index) => {
  const week = index + 1;
  return `Nädal ${week}`;
});

function formatMoney(value) {
  return `${value.toFixed(2)} €`;
}

export default function FiltridForm() {
  const [plan, setPlan] = useState("sub");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("Flexit");
  const [deviceModel, setDeviceModel] = useState("");
  const [lastChanged, setLastChanged] = useState("");
  const [month, setMonth] = useState("September");
  const [week, setWeek] = useState("Nädal 36");
  const [notes, setNotes] = useState("");
  const [needsReminder, setNeedsReminder] = useState(true);

  const selectedPlan = PLANS[plan];
  const reminderActive = selectedPlan.reminderIncluded || needsReminder;
  const vat = selectedPlan.price * 0.24;
  const total = selectedPlan.price + vat;

  const mailtoHref = useMemo(() => {
    const subject = `Filtrihoolduse broneering – ${selectedPlan.title}`;
    const body = [
      "Tere!",
      "",
      `Soovin broneerida: ${selectedPlan.summary}`,
      `Paketihind: ${formatMoney(selectedPlan.price)} + KM 24%`,
      `Meeldetuletus: ${reminderActive ? "Jah" : "Ei"}`,
      `Soovitud kuu: ${month}`,
      `Soovitud nädal: ${week}`,
      "",
      `Nimi: ${name || "-"}`,
      `Telefon: ${phone || "-"}`,
      `E-post: ${email || "-"}`,
      `Aadress / objekt: ${address || "-"}`,
      `Seade: ${deviceBrand || "-"}`,
      `Mudel: ${deviceModel || "-"}`,
      `Filtrid viimati vahetatud: ${lastChanged || "-"}`,
      "",
      `Lisainfo: ${notes || "-"}`,
    ].join("\n");

    return `mailto:cromvent@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [
    address,
    deviceBrand,
    deviceModel,
    email,
    lastChanged,
    month,
    week,
    name,
    notes,
    phone,
    reminderActive,
    selectedPlan,
  ]);

  return (
    <main className="min-h-screen bg-[#060606] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,180,200,0.10),transparent_30%),linear-gradient(180deg,#0d0d0e,#090909)] p-6 md:p-8">
          <Badge className="mb-4 border-white/10 bg-white/5 text-zinc-300">
            CROMVENT hooldus
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Filtrite vahetuse päring
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
            Vali kas ühekordne hooldus või 2x aastas subscription. Jäta sobiv nädal ja kontakt
            ning võtame sinuga ise ühendust.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Filter className="h-5 w-5" />
                Vali hoolduspakett
              </CardTitle>
              <CardDescription>Broneeri kas 1x aastas või hooajaline 2x aastas hooldus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.values(PLANS).map((item) => {
                const active = plan === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPlan(item.id);
                      if (item.reminderIncluded) setNeedsReminder(true);
                    }}
                    className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                      active
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-black/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                        <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">alates</div>
                        <div className="text-2xl font-semibold text-white">{formatMoney(item.price)}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="border-white/10 bg-white/5 text-zinc-300">
                        {item.id === "one" ? "Ühekordne" : "Subscription"}
                      </Badge>
                      {item.reminderIncluded ? (
                        <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
                          Meeldetuletus sees
                        </Badge>
                      ) : null}
                    </div>
                  </button>
                );
              })}

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="reminder"
                    checked={reminderActive}
                    disabled={selectedPlan.reminderIncluded}
                    onCheckedChange={(checked) => setNeedsReminder(Boolean(checked))}
                    className="mt-1 border-white/20 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="reminder" className="text-zinc-200">
                      Meeldetuletus hooldusajaks
                    </Label>
                    <p className="text-sm text-zinc-400">
                      {selectedPlan.reminderIncluded
                        ? "2x aastas paketis on meeldetuletus automaatselt sees."
                        : "Lisa soovi korral meeldetuletus ka ühekordsele hooldusele."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-200">Soovitud kuu</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-black/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-200">Vali nädala nr</Label>
                  <Select value={week} onValueChange={setWeek}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-black/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card className="rounded-[1.5rem] border-white/10 bg-black/20 shadow-none">
                  <CardContent className="p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Kokku</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                      {formatMoney(total)}
                    </div>
                    <div className="mt-2 text-sm text-zinc-400">
                      Neto {formatMoney(selectedPlan.price)} + KM 24% {formatMoney(vat)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="h-5 w-5" />
                Broneeri aeg
              </CardTitle>
              <CardDescription>Jäta oma kontakt ja saada broneerimispäring otse e-postile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-200">
                    Nimi
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
                    placeholder="Sinu nimi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-200">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
                    placeholder="+372 ..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-200">
                  E-post
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
                  placeholder="nimi@firma.ee"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-zinc-200">
                  Objekti aadress
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
                  placeholder="Näiteks Tartu, Anne 12"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-200">Vali seade</Label>
                  <Select value={deviceBrand} onValueChange={setDeviceBrand}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-black/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVICE_BRANDS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceModel" className="text-zinc-200">
                    Mudel
                  </Label>
                  <Input
                    id="deviceModel"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
                    placeholder="Näiteks S4, SAVE VTR 300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastChanged" className="text-zinc-200">
                  Kuna viimati filtreid vahetati?
                </Label>
                <Input
                  id="lastChanged"
                  value={lastChanged}
                  onChange={(e) => setLastChanged(e.target.value)}
                  className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
                  placeholder="Näiteks märts 2025 või ei tea"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-zinc-200">
                  Lisainfo
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-28 rounded-2xl border-white/10 bg-black/30 text-white"
                  placeholder="Kirjelda süsteemi, filtrite tüüpi või sobivat aega."
                />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2 text-white">
                  <BellRing className="h-4 w-4 text-cyan-300" />
                  Valitud pakett: {selectedPlan.title}
                </div>
                <div className="mt-2">
                  {selectedPlan.description} {reminderActive ? "Meeldetuletus läheb kaasa." : "Meeldetuletust ei lisata."} Võtame ühendust valitud kuul ja nädalal.
                </div>
              </div>

              <Button
                asChild
                className="h-12 w-full rounded-2xl bg-cyan-500 text-black hover:bg-cyan-400"
              >
                <a href={mailtoHref}>Saada päring, võtame ühendust</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border-white/10 bg-zinc-950/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-white">
                <Wrench className="h-4 w-4 text-cyan-300" />
                Hooldus
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Filtrite vahetus, süsteemi ülevaatus ja vajadusel soovitused järgmisteks hooldusteks.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/10 bg-zinc-950/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-white">
                <BellRing className="h-4 w-4 text-cyan-300" />
                Meeldetuletus
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                2x aastas subscription aitab hoida hooldusrütmi paigas ja vähendab ununemise riski.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/10 bg-zinc-950/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Kinnitame aja
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Pärast päringu saatmist võtame ühendust ja lepime sobiva hooldusaja kokku.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
