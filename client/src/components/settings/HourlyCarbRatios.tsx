import { useCalculator } from "@/contexts/CalculatorContext";

export default function HourlyCarbRatios() {
  const { settings, updateCarbRatio } = useCalculator();

  const handleCarbRatioChange = (hour: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateCarbRatio(hour, numValue);
    }
  };
  
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Hourly Carb Ratios</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Set different insulin-to-carb ratios for each hour of the day. Higher numbers mean less insulin per gram of carb.
      </p>
      
      <div className="max-h-64 overflow-y-auto pr-2">
        {settings.carbRatios.map((ratio, hour) => (
          <div key={hour} className="flex items-center mb-2">
            <div className="w-16 text-sm font-medium">{formatHour(hour)}</div>
            <div className="flex-1">
              <input 
                type="number" 
                value={ratio} 
                onChange={(e) => handleCarbRatioChange(hour, e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm" 
                min="1" 
                step="0.5"
              />
            </div>
            <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">g/U</div>
          </div>
        ))}
      </div>
    </section>
  );
}
