import MaterialCalculatorForm from "./MaterialCalculatorForm";

export const metadata = {
  title: "PDF materjalikalkulaator",
  description:
    "Lae ventilatsiooni joonised üles, koosta intake extractor'ile ja valmista projekt ette õppivaks HVAC materjalikalkulaatoriks.",
};

export default function MaterialCalculatorPage() {
  return <MaterialCalculatorForm />;
}
