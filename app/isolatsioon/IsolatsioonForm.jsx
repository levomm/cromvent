"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Circle,
  Info,
  Layers,
  PackageCheck,
  Plus,
  Ruler,
  Square,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import UnlockResultCard from "@/components/UnlockResultCard";
import ToolComingSoonOverlay from "@/components/ToolComingSoonOverlay";

const ROUND_DIAMETERS = [63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600];
const VAT_RATE = 0.24;

const ACCESS_LEVELS = [
  {
    id: "1",
    label: "1. Kerge ligipääs",
    rate: 7,
    hint: "Sirge toru, hea ligipääs ja piisavalt ruumi tööks.",
  },
  {
    id: "2",
    label: "2. Tavaline objekt",
    rate: 11,
    hint: "Enamus tavapäraseid objekte ja standardne paigaldus.",
  },
  {
    id: "3",
    label: "3. Raskem ligipääs",
    rate: 15,
    hint: "Rohkem põlvi, kõrgem lagi või piiratud tööasend.",
  },
  {
    id: "4",
    label: "4. Pööning / šaht",
    rate: 22,
    hint: "Pööning, šaht või kitsas tehniline ruum, palju lõikamist.",
  },
  {
    id: "5",
    label: "5. Väga keeruline",
    rate: 30,
    hint: "Väga kitsas ruum, halb ligipääs ja ajamahukas teostus.",
  },
];

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function insulationRound(dMm, tMm, lengthM) {
  const cutLengthMm = Math.PI * (dMm + 2 * tMm);
  const areaM2 = (cutLengthMm / 1000) * lengthM;
  const outerDiameterMm = dMm + 2 * tMm;
  return {
    cutLengthMm,
    areaM2,
    outerDiameterMm,
  };
}

function insulationRect(aMm, bMm, tMm, lengthM) {
  const cutLengthMm = 2 * ((aMm + 2 * tMm) + (bMm + 2 * tMm));
  const areaM2 = (cutLengthMm / 1000) * lengthM;
  const outerA = aMm + 2 * tMm;
  const outerB = bMm + 2 * tMm;
  return {
    cutLengthMm,
    areaM2,
    outerA,
    outerB,
  };
}

function getMaterialRate(shape, thickness) {
  if (thickness <= 30) return shape === "round" ? 4.5 : 5.5;
  if (thickness <= 50) return shape === "round" ? 7 : 8.5;
  if (thickness <= 100) return shape === "round" ? 12 : 14;
  return shape === "round" ? 16 : 18;
}

function formatMoney(value) {
  return `${round(value, 2).toFixed(2)} €`;
}

function NumberField({ label, value, onChange, min, max, step = 1, suffix }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-200">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-12 rounded-2xl border-white/10 bg-black/30 pr-14 text-base text-white"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ValueCard({ label, value, suffix, hint }) {
  return (
    <Card className="rounded-[1.75rem] border-white/10 bg-zinc-950/80 shadow-xl shadow-black/20">
      <CardContent className="p-5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {value}
          {suffix ? <span className="ml-2 text-base font-medium text-zinc-400">{suffix}</span> : null}
        </div>
        {hint ? <div className="mt-3 text-sm text-zinc-500">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}

function ShapePreview({ shape, roundDiameter, rectA, rectB, thickness }) {
  if (shape === "round") {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%),linear-gradient(180deg,#0f0f10,#090909)]">
        <div
          className="relative flex items-center justify-center rounded-full border border-white/10 bg-zinc-950/80"
          style={{ width: 148, height: 148 }}
        >
          <div
            className="rounded-full border border-white/20 bg-white/5"
            style={{
              width: Math.max(44, 148 - Math.min(84, thickness * 1.1)),
              height: Math.max(44, 148 - Math.min(84, thickness * 1.1)),
            }}
          />
          <div className="absolute bottom-4 text-xs text-zinc-400">Ø {roundDiameter} / t {thickness}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[220px] items-center justify-center rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%),linear-gradient(180deg,#0f0f10,#090909)]">
      <div
        className="relative flex items-center justify-center border border-white/10 bg-zinc-950/80"
        style={{ width: 180, height: 130, borderRadius: 24 }}
      >
        <div
          className="border border-white/20 bg-white/5"
          style={{
            width: Math.max(56, 180 - Math.min(96, thickness * 1.1)),
            height: Math.max(42, 130 - Math.min(72, thickness * 0.9)),
            borderRadius: 18,
          }}
        />
        <div className="absolute bottom-4 text-xs text-zinc-400">
          {rectA} × {rectB} / t {thickness}
        </div>
      </div>
    </div>
  );
}

export default function CromventIsolatsiooniKalkulaator() {
  const [shape, setShape] = useState("round");
  const [diameter, setDiameter] = useState(160);
  const [rectA, setRectA] = useState(300);
  const [rectB, setRectB] = useState(200);
  const [thickness, setThickness] = useState(50);
  const [length, setLength] = useState(10);
  const [accessLevel, setAccessLevel] = useState("2");
  const [includeMaterials, setIncludeMaterials] = useState(true);
  const [items, setItems] = useState([]);

  const results = useMemo(() => {
    return shape === "round"
      ? insulationRound(diameter, thickness, length)
      : insulationRect(rectA, rectB, thickness, length);
  }, [shape, diameter, rectA, rectB, thickness, length]);

  const selectedAccess = ACCESS_LEVELS.find((level) => level.id === accessLevel) ?? ACCESS_LEVELS[1];
  const laborRate = selectedAccess.rate;
  const materialRate = getMaterialRate(shape, thickness);
  const appliedRate = laborRate + (includeMaterials ? materialRate : 0);
  const estimateNet = results.areaM2 * appliedRate;
  const estimateVat = estimateNet * VAT_RATE;
  const estimateGross = estimateNet + estimateVat;

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.area += item.areaM2;
        acc.net += item.net;
        acc.vat += item.vat;
        acc.gross += item.gross;
        return acc;
      },
      { area: 0, net: 0, vat: 0, gross: 0 },
    );
  }, [items]);

  function addCurrentItem() {
    const sizeLabel = shape === "round" ? `Ø ${diameter}` : `${rectA} × ${rectB}`;
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      shape,
      sizeLabel,
      thickness,
      length,
      areaM2: results.areaM2,
      cutLengthMm: results.cutLengthMm,
      accessLabel: selectedAccess.label,
      laborRate,
      materialRate: includeMaterials ? materialRate : 0,
      includeMaterials,
      net: estimateNet,
      vat: estimateVat,
      gross: estimateGross,
    };

    setItems((current) => [...current, item]);
  }

  function removeItem(itemId) {
    setItems((current) => current.filter((item) => item.id !== itemId));
  }

  return (
    <div className="relative">
      <div className="pointer-events-none min-h-screen select-none bg-[#060606] text-zinc-100 opacity-15 blur-md grayscale">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,#0c0c0d_0%,#121315_45%,#090909_100%)] p-6 md:p-8"
        >
          <Badge className="mb-4 rounded-full border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
            CROMVENT tööriist
          </Badge>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Isolatsiooni kalkulaator
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                Lisa kanalid ridade kaupa, vali ligipääsu raskusaste ja vaata kohe eeldatavat
                maksumust koos KM 24% ning soovi korral ka materjaliga.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ValueCard
                label="Paigaldusraskus"
                value={selectedAccess.label.split(". ")[1]}
                hint={`${laborRate} €/m² töö hind`}
              />
              <ValueCard
                label="Materjal"
                value={includeMaterials ? "Sees" : "Ainult töö"}
                hint={includeMaterials ? `${round(materialRate, 1)} €/m² lisandub` : "Materjali ei arvesta"}
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[2rem] border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Layers className="h-5 w-5" />
                Sisendandmed
              </CardTitle>
              <CardDescription>Lisa üks kanal või lõik korraga ning salvesta see kalkulatsiooni.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-zinc-200">Kanali kuju</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShape("round")}
                    className={`flex h-12 items-center justify-center gap-2 rounded-2xl border transition ${
                      shape === "round"
                        ? "border-cyan-400 bg-cyan-400/10 text-white"
                        : "border-white/10 bg-black/30 text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <Circle className="h-4 w-4" />
                    Ümarkanal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShape("rect")}
                    className={`flex h-12 items-center justify-center gap-2 rounded-2xl border transition ${
                      shape === "rect"
                        ? "border-cyan-400 bg-cyan-400/10 text-white"
                        : "border-white/10 bg-black/30 text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <Square className="h-4 w-4" />
                    Kandiline kanal
                  </button>
                </div>
              </div>

              {shape === "round" ? (
                <div className="space-y-2">
                  <Label className="text-zinc-200">Suurus, D</Label>
                  <Select value={String(diameter)} onValueChange={(v) => setDiameter(Number(v))}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-black/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUND_DIAMETERS.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          Ø {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    label="Külg A"
                    value={rectA}
                    onChange={setRectA}
                    min={100}
                    max={2000}
                    step={5}
                    suffix="mm"
                  />
                  <NumberField
                    label="Külg B"
                    value={rectB}
                    onChange={setRectB}
                    min={100}
                    max={2000}
                    step={5}
                    suffix="mm"
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Paksus, t"
                  value={thickness}
                  onChange={setThickness}
                  min={10}
                  max={200}
                  step={5}
                  suffix="mm"
                />
                <NumberField
                  label="Kanali pikkus"
                  value={length}
                  onChange={setLength}
                  min={0.1}
                  max={500}
                  step={0.1}
                  suffix="jm"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-zinc-200">Ligipääsu raskusaste</Label>
                <div className="grid gap-3">
                  {ACCESS_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setAccessLevel(level.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        accessLevel === level.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 bg-black/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{level.label}</div>
                      <div className="mt-1 text-sm text-zinc-400">{level.hint}</div>
                      <div className="mt-3 text-xs uppercase tracking-[0.14em] text-cyan-300">
                        {level.rate} €/m² töö hind
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <Checkbox
                  id="materials"
                  checked={includeMaterials}
                  onCheckedChange={(checked) => setIncludeMaterials(Boolean(checked))}
                  className="mt-1 border-white/20 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                />
                <div className="space-y-1">
                  <Label htmlFor="materials" className="text-zinc-200">
                    Küsi hinda koos materjaliga
                  </Label>
                  <p className="text-sm text-zinc-400">
                    Materjali lisatasu on hetkel {round(materialRate, 1)} €/m² vastavalt kujule ja paksusele.
                  </p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <ShapePreview
                shape={shape}
                roundDiameter={diameter}
                rectA={rectA}
                rectB={rectB}
                thickness={thickness}
              />

              <button
                type="button"
                onClick={addCurrentItem}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 font-semibold text-black transition hover:bg-cyan-400"
              >
                <Plus className="h-4 w-4" />
                Lisa rida kalkulatsiooni
              </button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <ValueCard
                label="Praeguse rea pindala"
                value={round(results.areaM2, 3)}
                suffix="m²"
                hint="Arvutatud valitud mõõtude põhjal"
              />
              <ValueCard
                label="Praeguse rea hind"
                value={formatMoney(estimateGross)}
                hint={`Neto ${formatMoney(estimateNet)} + KM 24%`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ValueCard
                label="Lõikemõõt"
                value={round(results.cutLengthMm, 1)}
                suffix="mm"
                hint="Isolatsiooni pikkus ümber kanali"
              />
              <ValueCard
                label="Rakendatud hind"
                value={round(appliedRate, 2)}
                suffix="€/m²"
                hint={`Töö ${laborRate} €/m²${includeMaterials ? ` + materjal ${round(materialRate, 1)} €/m²` : ""}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {shape === "round" ? (
                <>
                  <ValueCard label="Sisemine diameeter" value={diameter} suffix="mm" hint="Kanali mõõt" />
                  <ValueCard
                    label="Välimine diameeter"
                    value={results.outerDiameterMm}
                    suffix="mm"
                    hint="Koos isolatsiooniga"
                  />
                </>
              ) : (
                <>
                  <ValueCard
                    label="Välimine külg A"
                    value={results.outerA}
                    suffix="mm"
                    hint="Koos isolatsiooniga"
                  />
                  <ValueCard
                    label="Välimine külg B"
                    value={results.outerB}
                    suffix="mm"
                    hint="Koos isolatsiooniga"
                  />
                </>
              )}
            </div>

            <Card className="rounded-[2rem] border-white/10 bg-zinc-950/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ruler className="h-5 w-5" />
                  Hinna loogika
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-400">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  5–10 €/m²: lihtne sirge toru ja hea ligipääs.
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  10–18 €/m²: standardne objekt ja enamus tavatöid.
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  18–30+ €/m²: pööning, kitsas ruum, palju lõikamist ja keeruline paigaldus.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6 rounded-[2rem] border-white/10 bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PackageCheck className="h-5 w-5" />
              Salvestatud read
            </CardTitle>
            <CardDescription>
              Salvesta mitu mõõtu järjest, näiteks Ø160 toru 18 jm ja seejärel järgmine lõik.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-500">
                Ühtegi rida pole veel lisatud. Sisesta mõõdud ja vajuta "Lisa rida kalkulatsiooni".
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-white/10 bg-white/5 text-zinc-300">
                          Rida {index + 1}
                        </Badge>
                        <Badge className="border-white/10 bg-white/5 text-zinc-300">
                          {item.shape === "round" ? "Ümar" : "Kandiline"}
                        </Badge>
                        {item.includeMaterials ? (
                          <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
                            Koos materjaliga
                          </Badge>
                        ) : null}
                      </div>
                      <div className="text-base font-medium text-white">
                        {item.sizeLabel}, {item.length} jm, paksus {item.thickness} mm
                      </div>
                      <div className="text-sm text-zinc-400">
                        {item.accessLabel} · pindala {round(item.areaM2, 3)} m² · lõikemõõt {round(item.cutLengthMm, 1)} mm
                      </div>
                      <div className="text-sm text-zinc-500">
                        Töö {item.laborRate} €/m²
                        {item.includeMaterials ? ` + materjal ${round(item.materialRate, 1)} €/m²` : ""}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-zinc-500">Koos KM-ga</div>
                        <div className="text-xl font-semibold text-white">{formatMoney(item.gross)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-xl border border-white/10 p-3 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        aria-label={`Eemalda rida ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="bg-white/10" />

            <div className="grid gap-4 md:grid-cols-4">
              <ValueCard label="Kogupindala" value={round(totals.area, 3)} suffix="m²" hint="Kõik salvestatud read kokku" />
              <ValueCard label="Summa neto" value={formatMoney(totals.net)} hint="Ilma KM-ta" />
              <ValueCard label="KM 24%" value={formatMoney(totals.vat)} hint="Käibemaks" />
              <ValueCard label="Kokku" value={formatMoney(totals.gross)} hint="Koos KM-ga" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <UnlockResultCard
            summary={[
              {
                label: "Kogupind",
                value: `${round(items.length ? totals.area : results.areaM2, 2).toFixed(2)} m²`,
              },
              {
                label: "Hind kokku",
                value: formatMoney(items.length ? totals.gross : estimateGross),
              },
            ]}
            quoteSubject="Isolatsiooni kalkulaatori tulemus"
            quoteLines={[
              "Tere!",
              "",
              "Soovin selle kalkulatsiooni põhjal tasulist väljundit või pakkumist.",
              `Kanalid kokku: ${items.length || 1} rida`,
              `Kogupind: ${round(items.length ? totals.area : results.areaM2, 2).toFixed(2)} m²`,
              `Hinnang koos KM-ga: ${formatMoney(items.length ? totals.gross : estimateGross)}`,
              `Ligipääs: ${selectedAccess.label}`,
              `Materjal sees: ${includeMaterials ? "Jah" : "Ei"}`,
            ]}
          />
        </div>

        <Card className="mt-6 rounded-[2rem] border-white/10 bg-zinc-950/70">
          <CardContent className="flex items-start gap-3 p-5 text-sm text-zinc-400">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-2 leading-6">
              <p>
                Tegemist on hinnangulise kalkulaatoriga. Lõplik pakkumine sõltub objekti mõõdistusest,
                materjali valikust, tõstukist, kõrgusest ja tegelikust ligipääsust.
              </p>
              <p>
                Kui soovid, et hind sisaldaks ka materjali, jäta "Küsi hinda koos materjaliga"
                valik sisse. Kõik summad kuvatakse koos KM 24%-ga.
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <ToolComingSoonOverlay description="Isolatsiooni kalkulaator on testimisel. Sisestus, tulemused ja eksport avatakse pärast viimast kontrolli." />
    </div>
  );
}
