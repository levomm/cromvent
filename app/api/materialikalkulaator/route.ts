import { NextResponse } from "next/server"
import type {
  AnalysisMode,
  MaterialCalculatorIntake,
  MaterialCalculatorResponse,
  ObjectType,
  OutputFormat,
} from "@/lib/material-calculator"

const validModes = new Set<AnalysisMode>([
  "ducts-only",
  "full-bom",
  "ducts-and-insulation",
])

const validObjectTypes = new Set<ObjectType>([
  "korter",
  "eramu",
  "aripind",
  "toostus",
  "muu",
])

const validOutputFormats = new Set<OutputFormat>([
  "table",
  "csv-json",
  "review-pack",
])

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : ""
}

function asBoolean(value: FormDataEntryValue | null) {
  return typeof value === "string" && value === "true"
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const uploaded = formData
    .getAll("pdfs")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (!uploaded.length) {
    return NextResponse.json(
      { error: "Lisa vähemalt üks PDF joonis." },
      { status: 400 },
    )
  }

  const invalidFile = uploaded.find(
    (file) =>
      !file.name.toLowerCase().endsWith(".pdf") &&
      file.type !== "application/pdf",
  )

  if (invalidFile) {
    return NextResponse.json(
      { error: `Fail ei ole PDF: ${invalidFile.name}` },
      { status: 400 },
    )
  }

  const analysisMode = asString(formData.get("analysisMode")) as AnalysisMode
  const objectType = asString(formData.get("objectType")) as ObjectType
  const outputFormat = asString(formData.get("outputFormat")) as OutputFormat

  if (!validModes.has(analysisMode)) {
    return NextResponse.json({ error: "Analüüsi režiim puudub." }, { status: 400 })
  }

  if (!validObjectTypes.has(objectType)) {
    return NextResponse.json({ error: "Objekti tüüp puudub." }, { status: 400 })
  }

  if (!validOutputFormats.has(outputFormat)) {
    return NextResponse.json({ error: "Väljundi formaat puudub." }, { status: 400 })
  }

  const intake: MaterialCalculatorIntake = {
    projectId: `HVAC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    projectName: asString(formData.get("projectName")) || "Nimetu projekt",
    companyName: asString(formData.get("companyName")),
    objectType,
    analysisMode,
    outputFormat,
    includeOnninen: asBoolean(formData.get("includeOnninen")),
    includeLearningDataset: asBoolean(formData.get("includeLearningDataset")),
    hasLegendFile: asBoolean(formData.get("hasLegendFile")),
    hasMaterialSpec: asBoolean(formData.get("hasMaterialSpec")),
    estimatorNotes: asString(formData.get("estimatorNotes")),
    uploadedPdfs: uploaded.map((file) => ({
      name: file.name,
      sizeBytes: file.size,
      type: file.type || "application/pdf",
    })),
    receivedAt: new Date().toISOString(),
  }

  const totalBytes = intake.uploadedPdfs.reduce(
    (sum, file) => sum + file.sizeBytes,
    0,
  )
  const totalMb = (totalBytes / 1024 / 1024).toFixed(2)

  const response: MaterialCalculatorResponse = {
    status: "ready_for_backend",
    intake,
    statusSummary: [
      `${intake.uploadedPdfs.length} PDF faili vastu võetud`,
      `Kogumaht ${totalMb} MB`,
      `Režiim: ${analysisMode}`,
      intake.includeOnninen
        ? "Onnineni kategooriate vaste küsitud"
        : "Ilma Onnineni vastenduseta",
    ],
    nextSteps: [
      "Renderda PDF lehed piltideks ja hoia lehepõhine kontekst alles.",
      "Ekstrakti tekstikiht ning seo mõõdud ja viited lähimate komponentidega.",
      "Koosta detailne tabel, koond ja ebakindlate kohtade nimekiri.",
      intake.includeLearningDataset
        ? "Salvesta kinnitatud parandused õppeandmestikuks järgmiste projektide jaoks."
        : "Käsitle seda projekti ühekordse analüüsina ilma õppepaketita.",
    ],
    reviewChecklist: [
      "Kontrolli mõõtkava ja loetamatud viited üle enne tellimuse vormistamist.",
      "Võrdle üleminekud, põlved ja harud PDF legendiga.",
      "Kinnita lõplik materjalitabel inimese kontrolliga enne hinnastust.",
    ],
    learningFields: [
      "Algne PDF või PDF-id",
      "Extractor'i esialgne tabel ja koond",
      "Inimese parandatud lõppversioon",
      "Tegelik materjalitabel või ostutabel",
      "Märkused korduvate vigade, legendide ja vastenduste kohta",
    ],
  }

  return NextResponse.json(response)
}
