import { useCalculator } from "@/contexts/CalculatorContext";
import InputSection from "@/components/calculator/InputSection";
import ResultsSection from "@/components/calculator/ResultsSection";
import { Link } from "wouter";

export default function Calculator() {
  // Try accessing the context but catch any errors to avoid crashes
  try {
    useCalculator();
  } catch (error) {
    console.log("CalculatorContext not available yet", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <Link href="/" className="flex-1 py-2 px-4 rounded-md text-center font-medium text-sm bg-primary-500 text-white">
          Calculator
        </Link>
        <Link href="/settings" className="flex-1 py-2 px-4 rounded-md text-center font-medium text-sm bg-gray-200 dark:bg-gray-700">
          Settings
        </Link>
      </div>

      <InputSection />
      <ResultsSection />
    </div>
  );
}
