import { Link } from "wouter";
import CalculationBreakdown from "@/components/details/CalculationBreakdown";
import InsulinActionProfile from "@/components/details/InsulinActionProfile";
import FormulaExplanation from "@/components/details/FormulaExplanation";
import { useCalculator } from "@/contexts/CalculatorContext";

export default function Details() {
  let calculationResult = null;
  
  try {
    const context = useCalculator();
    calculationResult = context.calculationResult;
  } catch (error) {
    console.log("CalculatorContext not available in Details page", error);
  }

  if (!calculationResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Link href="/" className="mr-2 p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h2 className="text-lg font-semibold">Calculation Details</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-center py-4">No calculation has been performed yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link href="/" className="mr-2 p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h2 className="text-lg font-semibold">Calculation Details</h2>
      </div>
      
      <CalculationBreakdown />
      <InsulinActionProfile />
      <FormulaExplanation />
    </div>
  );
}
