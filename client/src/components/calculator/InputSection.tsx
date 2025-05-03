import { useCalculator } from "@/contexts/CalculatorContext";
import { insulinTypes } from "@/lib/insulinTypes";

export default function InputSection() {
  let calculator = {
    currentGlucose: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    iob: 0,
    insulinType: "novolog"
  };
  let updateCalculator = (updates: any) => {
    console.log("Context not available, mock update:", updates);
  };

  try {
    const context = useCalculator();
    calculator = context.calculator;
    updateCalculator = context.updateCalculator;
  } catch (error) {
    console.log("CalculatorContext not available in InputSection", error);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const numValue = id !== 'insulinType' ? parseFloat(value) : value;
    updateCalculator({ [id]: numValue });
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Current Values</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="currentGlucose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Glucose
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="currentGlucose" 
              value={calculator.currentGlucose} 
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-12 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="0"
              step="1"
              inputMode="numeric"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              mg/dL
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="iob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Insulin on Board
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="iob" 
              value={calculator.iob} 
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-12 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="0"
              step="0.1"
              inputMode="decimal"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              units
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="insulinType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Insulin Type
        </label>
        <select 
          id="insulinType" 
          value={calculator.insulinType}
          onChange={handleInputChange}
          className="block w-full h-10 pl-3 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          {Object.entries(insulinTypes).map(([key, insulin]) => (
            <option key={key} value={key}>{insulin.name}</option>
          ))}
        </select>
      </div>
      
      <h3 className="text-base font-medium mb-2">Meal Information</h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Carbs
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="carbs" 
              value={calculator.carbs} 
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="0"
              step="1"
              inputMode="numeric"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              g
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Protein
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="protein" 
              value={calculator.protein} 
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="0"
              step="1"
              inputMode="numeric"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              g
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fat
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="fat" 
              value={calculator.fat} 
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="0"
              step="1"
              inputMode="numeric"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              g
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
