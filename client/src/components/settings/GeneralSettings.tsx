import { useCalculator } from "@/contexts/CalculatorContext";

export default function GeneralSettings() {
  const { settings, updateSettings } = useCalculator();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let numValue = parseFloat(value);
    
    // Apply validation constraints
    if (id === 'targetGlucose') {
      numValue = Math.max(70, Math.min(180, numValue));
    } else if (id === 'sensitivity') {
      numValue = Math.max(1, numValue);
    } else if (id === 'activeInsulinHours') {
      numValue = Math.max(2, Math.min(8, numValue));
    }
    
    updateSettings({ [id]: numValue });
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">General Settings</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="targetGlucose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Glucose
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="targetGlucose" 
              value={settings.targetGlucose}
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-12 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="70"
              max="180"
              step="1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              mg/dL
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Insulin Sensitivity
          </label>
          <div className="relative">
            <input 
              type="number" 
              id="sensitivity" 
              value={settings.sensitivity}
              onChange={handleInputChange}
              className="block w-full h-10 pl-3 pr-12 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              min="1"
              step="1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              mg/dL/U
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="activeInsulinHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Active Insulin Duration
        </label>
        <div className="relative">
          <input 
            type="number" 
            id="activeInsulinHours" 
            value={settings.activeInsulinHours}
            onChange={handleInputChange}
            className="block w-full h-10 pl-3 pr-12 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min="2"
            max="8"
            step="0.5"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
            hours
          </div>
        </div>
      </div>
    </section>
  );
}
