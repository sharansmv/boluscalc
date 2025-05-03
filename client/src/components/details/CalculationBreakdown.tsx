import { useCalculator } from "@/contexts/CalculatorContext";

export default function CalculationBreakdown() {
  const { calculationResult } = useCalculator();
  
  if (!calculationResult) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Calculation Breakdown</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Carbohydrates:</span>
          <span>+{calculationResult.carbsContribution} U</span>
        </div>
        <div className="flex justify-between">
          <span>Protein & Fat:</span>
          <span>+{calculationResult.fpuContribution} U</span>
        </div>
        <div className="flex justify-between">
          <span>Glucose Correction:</span>
          <span className={calculationResult.correction >= 0 ? 'text-error' : 'text-success'}>
            {calculationResult.correction >= 0 ? '+' : ''}{calculationResult.correction} U
          </span>
        </div>
        <div className="flex justify-between">
          <span>Insulin on Board:</span>
          <span className="text-primary-500">-{calculationResult.iobDeduction} U</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 font-semibold flex justify-between">
          <span>Total Insulin Dose:</span>
          <span>{calculationResult.totalDose} U</span>
        </div>
      </div>
    </div>
  );
}
