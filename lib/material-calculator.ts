export const ANALYSIS_MODE_OPTIONS = [
  {
    value: "ducts-only",
    label: "Torustik only",
    description: "Koond mõõdu kaupa koos 3 m toru, muhvi ja klambri loogikaga.",
  },
  {
    value: "full-bom",
    label: "Täielik BOM",
    description: "Torustik, detailid, üleminekud, restid ja võimalikud vasted.",
  },
  {
    value: "ducts-and-insulation",
    label: "Torustik + isolatsioon",
    description: "Torustiku koond koos isolatsiooni kuluhinnangu alusandmetega.",
  },
] as const

export const OUTPUT_FORMAT_OPTIONS = [
  {
    value: "table",
    label: "Tabel veebis",
  },
  {
    value: "csv-json",
    label: "CSV + JSON eksport",
  },
  {
    value: "review-pack",
    label: "Kontrollpakett",
  },
] as const

export const OBJECT_TYPE_OPTIONS = [
  { value: "korter", label: "Korter" },
  { value: "eramu", label: "Maja / eramu" },
  { value: "aripind", label: "Äripind" },
  { value: "toostus", label: "Tootmine / hall" },
  { value: "muu", label: "Muu objekt" },
] as const

export type AnalysisMode = (typeof ANALYSIS_MODE_OPTIONS)[number]["value"]
export type OutputFormat = (typeof OUTPUT_FORMAT_OPTIONS)[number]["value"]
export type ObjectType = (typeof OBJECT_TYPE_OPTIONS)[number]["value"]

export type UploadedPdfSummary = {
  name: string
  sizeBytes: number
  type: string
}

export type MaterialCalculatorIntake = {
  projectId: string
  projectName: string
  companyName: string
  objectType: ObjectType
  analysisMode: AnalysisMode
  outputFormat: OutputFormat
  includeOnninen: boolean
  includeLearningDataset: boolean
  hasLegendFile: boolean
  hasMaterialSpec: boolean
  estimatorNotes: string
  uploadedPdfs: UploadedPdfSummary[]
  receivedAt: string
}

export type MaterialCalculatorResponse = {
  status: "ready_for_backend" | "validation_error"
  intake: MaterialCalculatorIntake
  statusSummary: string[]
  nextSteps: string[]
  reviewChecklist: string[]
  learningFields: string[]
}
