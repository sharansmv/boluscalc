import { useCalculator } from "@/contexts/CalculatorContext";
import { Link } from "wouter";

export default function ResultsSection() {
  let calculationResult = null;
  
  try {
    const context = useCalculator();
    calculationResult = context.calculationResult;
  } catch (error) {
    console.log("CalculatorContext not available in ResultsSection", error);
  }

  if (!calculationResult) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Calculated Dose</h2>
        <div className="text-center py-4">
          <p>Enter values above to calculate insulin dose</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Calculated Dose</h2>
      
      <div className="mb-4">
        <div className="text-center mb-2">
          <span className="text-lg font-semibold">Total Insulin Dose:</span>
          <span className="text-3xl font-bold ml-2 text-primary-500">{calculationResult.totalDose} U</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-primary-50 dark:bg-primary-900 p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Normal Bolus</div>
            <div className="text-xl font-semibold">{calculationResult.normalBolus} U</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Take immediately</div>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900 p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Extended Bolus</div>
            <div className="text-xl font-semibold">{calculationResult.squareBolus} U</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Over 2-3 hours</div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>
            Inject {calculationResult.preMealTiming > 0 
              ? `${calculationResult.preMealTiming} minutes before eating` 
              : 'at mealtime'}
          </span>
        </div>
      </div>

      <Link href="/details" className="w-full py-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-md text-sm font-medium transition duration-200 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        Show Calculation Details
      </Link>
    </section>
  );
}
