"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  DatabaseZap,
  FileSpreadsheet,
  LoaderCircle,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ANALYSIS_MODE_OPTIONS,
  OBJECT_TYPE_OPTIONS,
  OUTPUT_FORMAT_OPTIONS,
  type MaterialCalculatorResponse,
} from "@/lib/material-calculator";

type RecentIntake = {
  projectId: string;
  projectName: string;
  receivedAt: string;
  fileCount: number;
  analysisMode: string;
};

const RECENT_STORAGE_KEY = "cromvent-material-calculator-recent";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function MaterialCalculatorForm() {
  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [objectType, setObjectType] = useState("aripind");
  const [analysisMode, setAnalysisMode] = useState("ducts-only");
  const [outputFormat, setOutputFormat] = useState("review-pack");
  const [includeOnninen, setIncludeOnninen] = useState(true);
  const [includeLearningDataset, setIncludeLearningDataset] = useState(true);
  const [hasLegendFile, setHasLegendFile] = useState(false);
  const [hasMaterialSpec, setHasMaterialSpec] = useState(false);
  const [estimatorNotes, setEstimatorNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<MaterialCalculatorResponse | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentIntakes, setRecentIntakes] = useState<RecentIntake[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return;

    try {
      setRecentIntakes(JSON.parse(raw) as RecentIntake[]);
    } catch {
      window.localStorage.removeItem(RECENT_STORAGE_KEY);
    }
  }, []);

  function persistRecent(entry: RecentIntake) {
    setRecentIntakes((current) => {
      const next = [entry, ...current].slice(0, 6);
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!files.length) {
      setError("Lisa vähemalt üks PDF joonis.");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = new FormData();
      body.set("projectName", projectName);
      body.set("companyName", companyName);
      body.set("objectType", objectType);
      body.set("analysisMode", analysisMode);
      body.set("outputFormat", outputFormat);
      body.set("includeOnninen", String(includeOnninen));
      body.set("includeLearningDataset", String(includeLearningDataset));
      body.set("hasLegendFile", String(hasLegendFile));
      body.set("hasMaterialSpec", String(hasMaterialSpec));
      body.set("estimatorNotes", estimatorNotes);

      files.forEach((file) => body.append("pdfs", file));

      const response = await fetch("/api/materialikalkulaator", {
        method: "POST",
        body,
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Päringu saatmine ebaõnnestus.");
        setResult(null);
        return;
      }

      setResult(payload);
      persistRecent({
        projectId: payload.intake.projectId,
        projectName: payload.intake.projectName,
        receivedAt: payload.intake.receivedAt,
        fileCount: payload.intake.uploadedPdfs.length,
        analysisMode: payload.intake.analysisMode,
      });
    } catch {
      setError("Serveriga ühendus ebaõnnestus. Proovi uuesti.");
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,180,200,0.16),transparent_28%),linear-gradient(135deg,#0a0a0b_0%,#111315_48%,#060606_100%)] p-8 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
          <Badge className="mb-4 border-white/10 bg-white/5 text-zinc-200">
            CROMVENT MVP
          </Badge>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                PDF materjalikalkulaator
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
                Lae ventilatsiooni joonis PDF-ina üles ja koosta projektist
                töötlemiseks valmis intake. See MVP paneb paika kliendivoo,
                õppeandmestiku ja API lepingu, mille külge extractor järgmises
                etapis ühendatakse.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="border-white/10 bg-black/30">
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Režiim
                  </div>
                  <div className="mt-3 text-2xl font-semibold">Õppiv intake</div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Salvestab projekti, väljundi ja paranduste jaoks vajalikud
                    väljad.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/30">
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Eesmärk
                  </div>
                  <div className="mt-3 text-2xl font-semibold">Parem iga projektiga</div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Sobib torustiku koondi, BOM-i ja tulevase tagasiside õppetsükli aluseks.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Upload className="h-5 w-5" />
                Projekti intake
              </CardTitle>
              <CardDescription>
                Sisesta projekti põhiinfo ja lisa PDF joonised. MVP salvestab
                backendile sobiva intake-paketi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Projekti nimi</Label>
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(event) => setProjectName(event.target.value)}
                      placeholder="Näiteks Lõunakeskuse ventilatsioon"
                      className="border-white/10 bg-black/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Tellija / ettevõte</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      placeholder="Näiteks ABC Ehitus"
                      className="border-white/10 bg-black/30 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Objekti tüüp</Label>
                    <Select value={objectType} onValueChange={setObjectType}>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OBJECT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Analüüsi režiim</Label>
                    <Select value={analysisMode} onValueChange={setAnalysisMode}>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ANALYSIS_MODE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Väljundi formaat</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OUTPUT_FORMAT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdfs">PDF joonised</Label>
                  <Input
                    id="pdfs"
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={(event) =>
                      setFiles(Array.from(event.target.files || []))
                    }
                    className="h-auto border-dashed border-white/15 bg-black/30 py-3 text-white"
                  />
                  {files.length ? (
                    <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                      {files.map((file) => (
                        <div
                          key={`${file.name}-${file.size}`}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="truncate">{file.name}</span>
                          <span className="shrink-0 text-zinc-500">
                            {formatBytes(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Lisa üks või mitu ventilatsiooni PDF joonist.
                    </p>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Checkbox
                      checked={includeOnninen}
                      onCheckedChange={(checked) => setIncludeOnninen(checked === true)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                    />
                    <div>
                      <div className="font-medium text-white">
                        Lisa Onnineni vaste
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">
                        Valmistab tulevase hinnastuse jaoks kategooriavaste ette.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Checkbox
                      checked={includeLearningDataset}
                      onCheckedChange={(checked) =>
                        setIncludeLearningDataset(checked === true)
                      }
                      className="mt-1 border-white/20 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                    />
                    <div>
                      <div className="font-medium text-white">
                        Salvesta õppepakett
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">
                        Hoiab alles intake&apos;i, parandused ja lõpliku kinnitatud väljundi.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Checkbox
                      checked={hasLegendFile}
                      onCheckedChange={(checked) => setHasLegendFile(checked === true)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                    />
                    <div>
                      <div className="font-medium text-white">
                        Legend on olemas
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">
                        Märgi, kui objektiga tuleb kaasa sümbolite või lühendite legend.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Checkbox
                      checked={hasMaterialSpec}
                      onCheckedChange={(checked) => setHasMaterialSpec(checked === true)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                    />
                    <div>
                      <div className="font-medium text-white">
                        Materjalispec olemas
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">
                        Võimaldab extractor&apos;il võrrelda joonist objekti enda spetsifikatsiooniga.
                      </div>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Märkused hindajale või extractor&apos;ile</Label>
                  <Textarea
                    id="notes"
                    value={estimatorNotes}
                    onChange={(event) => setEstimatorNotes(event.target.value)}
                    placeholder="Näiteks: arvesta ainult torustiku põhitrassid, restid tulevad eraldi."
                    className="min-h-28 border-white/10 bg-black/30 text-white"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-2xl bg-cyan-400 px-6 text-black hover:bg-cyan-300"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Koostan intake paketti
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      Käivita MVP intake
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-zinc-950/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BrainCircuit className="h-5 w-5" />
                  Kuidas see paremaks muutub
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-300">
                <p>
                  Iga projekt võiks lõpuks anda süsteemile kolm kihti infot:
                  algne PDF, esialgne extractor&apos;i väljund ja inimese kinnitatud
                  lõpptulemus.
                </p>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    1. Intake: projekt, režiim, failid ja märkused.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    2. Esialgne tulemus: tabel, koond, ebakindlad kohad.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    3. Kinnitatud parandused: õiged mõõdud, detailid ja vasted.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DatabaseZap className="h-5 w-5" />
                  Viimased intake&apos;id selles brauseris
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {recentIntakes.length ? (
                  recentIntakes.map((entry) => (
                    <div
                      key={entry.projectId}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="font-medium text-white">{entry.projectName}</div>
                      <div className="mt-1 text-zinc-400">
                        {entry.projectId} · {entry.fileCount} PDF · {entry.analysisMode}
                      </div>
                      <div className="mt-1 text-zinc-500">
                        {new Date(entry.receivedAt).toLocaleString("et-EE")}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500">
                    Intake ajalugu tekib siia pärast esimest proovikäiku.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {result ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="border-white/10 bg-zinc-950/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                  Intake valmis extractor&apos;i ühendamiseks
                </CardTitle>
                <CardDescription>
                  See vastus on backendile sobiv vaheleping. Järgmises etapis
                  ühendatakse siia PDF extractor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                  Projekti ID: <span className="font-medium">{result.intake.projectId}</span>
                </div>

                <div className="space-y-2">
                  {result.statusSummary.map((line) => (
                    <div
                      key={line}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300"
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <div className="text-sm font-medium text-white">Järgmised sammud</div>
                  {result.nextSteps.map((step) => (
                    <div key={step} className="text-sm leading-6 text-zinc-400">
                      {step}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/70">
              <CardHeader>
                <CardTitle className="text-xl">Õppetsükli andmemudel</CardTitle>
                <CardDescription>
                  Need väljad tuleks igast projektist alles hoida, et süsteem muutuks täpsemaks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {result.learningFields.map((field) => (
                    <div
                      key={field}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300"
                    >
                      {field}
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <div className="text-sm font-medium text-white">
                    Inimese kontrolli checklist
                  </div>
                  {result.reviewChecklist.map((item) => (
                    <div key={item} className="text-sm leading-6 text-zinc-400">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
