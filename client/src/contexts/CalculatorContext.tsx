import { createContext, useContext, useState, useEffect } from "react";
import { insulinTypes } from "@/lib/insulinTypes";
import { calculateInsulin } from "@/lib/calculations";

interface Settings {
  sensitivity: number;
  targetGlucose: number;
  carbRatios: number[];
  insulinType: string;
  activeInsulinHours: number;
}

interface Calculator {
  currentGlucose: number;
  carbs: number;
  protein: number;
  fat: number;
  iob: number;
  insulinType: string;
}

interface CalculationResult {
  totalDose: number;
  normalBolus: number;
  squareBolus: number;
  correction: number;
  carbsContribution: number;
  fpuContribution: number;
  iobDeduction: number;
  preMealTiming: number;
  insulinType: string;
}

interface CalculatorContextType {
  settings: Settings;
  calculator: Calculator;
  calculationResult: CalculationResult | null;
  updateSettings: (updates: Partial<Settings>) => void;
  updateCalculator: (updates: Partial<Calculator>) => void;
  updateCarbRatio: (hour: number, value: number) => void;
}

const defaultSettings: Settings = {
  sensitivity: 40,
  targetGlucose: 100,
  carbRatios: Array(24).fill(10), // Default to 10g/U for each hour
  insulinType: "novolog",
  activeInsulinHours: 4,
};

const defaultCalculator: Calculator = {
  currentGlucose: 120,
  carbs: 30,
  protein: 20,
  fat: 10,
  iob: 0,
  insulinType: "novolog",
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Try to load settings from localStorage
    try {
      const saved = localStorage.getItem('insulinCalculatorSettings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading saved settings', e);
    }
    return defaultSettings;
  });

  const [calculator, setCalculator] = useState<Calculator>(defaultCalculator);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('insulinCalculatorSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }, [settings]);

  // Update calculation when inputs or settings change
  useEffect(() => {
    // Set current hour based on device time
    const currentHour = new Date().getHours();
    
    // Calculate insulin dose
    const result = calculateInsulin({
      ...calculator,
      currentHour,
      carbRatio: settings.carbRatios[currentHour],
      sensitivity: settings.sensitivity,
      targetGlucose: settings.targetGlucose,
      insulinType: settings.insulinType
    });
    
    setCalculationResult(result);
  }, [calculator, settings]);

  // Update settings
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Update calculator inputs
  const updateCalculator = (updates: Partial<Calculator>) => {
    setCalculator(prev => ({ ...prev, ...updates }));
    
    // If insulinType is updated in calculator, also update it in settings
    if (updates.insulinType) {
      updateSettings({ insulinType: updates.insulinType });
    }
  };

  // Update a specific hour's carb ratio
  const updateCarbRatio = (hour: number, value: number) => {
    const newCarbRatios = [...settings.carbRatios];
    newCarbRatios[hour] = value;
    updateSettings({ carbRatios: newCarbRatios });
  };

  return (
    <CalculatorContext.Provider 
      value={{
        settings,
        calculator,
        calculationResult,
        updateSettings,
        updateCalculator,
        updateCarbRatio
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}
