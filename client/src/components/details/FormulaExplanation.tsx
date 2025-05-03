export default function FormulaExplanation() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Formula Explanation</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Carb Units:</span> Carbs ÷ Carb Ratio</p>
        <p><span className="font-medium">FPU:</span> (Protein×4 + Fat×9) ÷ 100</p>
        <p><span className="font-medium">CU percentage:</span> CU ÷ (CU + FPU)</p>
        <p><span className="font-medium">Correction:</span> (Current BG - Target) ÷ Sensitivity</p>
        <p><span className="font-medium">Total Dose:</span> Carb Units + FPU + Correction - IOB</p>
        <p><span className="font-medium">Normal Bolus:</span> Total Dose × CU percentage</p>
        <p><span className="font-medium">Extended Bolus:</span> Total Dose - Normal Bolus</p>
      </div>
    </div>
  );
}
