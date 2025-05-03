/**
 * Calculator Context Provider
 * 
 * This module provides a central state management system for the insulin calculator
 * using React Context. It handles user input, settings, and calculation results.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { insulinTypes } from "@/lib/insulinTypes";
import { calculateInsulin } from "@/lib/calculations";

/**
 * User settings for insulin calculations
 * 
 * These settings are persistent and affect how insulin doses are calculated.
 */
interface Settings {
  sensitivity: number;         // Insulin sensitivity factor (mg/dL/U)
  targetGlucose: number;       // Target blood glucose level (mg/dL)
  carbRatios: number[];        // Array of 24 hourly insulin-to-carb ratios (g/U)
  insulinType: string;         // Selected insulin type (key from insulinTypes)
  activeInsulinHours: number;  // Duration insulin remains active (hours)
}

/**
 * Current calculator input values
 * 
 * These are the user-entered values for the current calculation.
 */
interface Calculator {
  currentGlucose: number;  // Current blood glucose level (mg/dL)
  carbs: number;           // Carbohydrates in meal (g)
  protein: number;         // Protein in meal (g)
  fat: number;             // Fat in meal (g)
  iob: number;             // Insulin on board (units)
  insulinType: string;     // Selected insulin type (key from insulinTypes)
}

/**
 * Result of insulin calculation
 * 
 * Contains the calculated insulin doses and component breakdown.
 */
interface CalculationResult {
  totalDose: number;         // Total insulin dose (units)
  normalBolus: number;       // Immediate bolus portion (units)
  squareBolus: number;       // Extended bolus portion (units)
  correction: number;        // Correction for high/low glucose (units)
  carbsContribution: number; // Insulin for carbohydrates (units)
  fpuContribution: number;   // Insulin for fat/protein (units)
  iobDeduction: number;      // Subtraction for active insulin (units)
  preMealTiming: number;     // Minutes before meal to take insulin
  insulinType: string;       // Full name of insulin type used
}

/**
 * Calculator context interface
 * 
 * Defines the shape of the context object that will be provided
 * to components that consume this context.
 */
interface CalculatorContextType {
  settings: Settings;                                   // User settings
  calculator: Calculator;                               // Current calculator inputs
  calculationResult: CalculationResult | null;          // Current calculation result
  updateSettings: (updates: Partial<Settings>) => void; // Update settings
  updateCalculator: (updates: Partial<Calculator>) => void; // Update calculator inputs
  updateCarbRatio: (hour: number, value: number) => void; // Update specific hourly carb ratio
}

/**
 * Default settings values
 * 
 * These are used when no saved settings are available.
 */
const defaultSettings: Settings = {
  sensitivity: 40,                      // 40 mg/dL drop per unit of insulin
  targetGlucose: 100,                   // 100 mg/dL target
  carbRatios: Array(24).fill(10),       // Default to 10g/U for each hour
  insulinType: "novolog",               // Default to NovoLog insulin
  activeInsulinHours: 4,                // Default to 4 hours active insulin
};

/**
 * Default calculator input values
 * 
 * These are used as initial values for the calculator form.
 */
const defaultCalculator: Calculator = {
  currentGlucose: 0,    // Starting with zero values for all inputs
  carbs: 0,
  protein: 0,
  fat: 0,
  iob: 0,
  insulinType: "novolog", // Default to NovoLog insulin
};

// Create the context with undefined as default value
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

/**
 * Calculator Provider Component
 * 
 * Provides calculator state and functionality to its children.
 * Handles loading and saving settings to localStorage.
 * 
 * @param children - Child components that will have access to the context
 */
export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  // Initialize settings state, attempting to load from localStorage
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

  // Initialize calculator input state
  const [calculator, setCalculator] = useState<Calculator>(defaultCalculator);
  
  // Initialize calculation result state
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  /**
   * Effect to save settings to localStorage when they change
   */
  useEffect(() => {
    try {
      localStorage.setItem('insulinCalculatorSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }, [settings]);

  /**
   * Effect to recalculate insulin dose when inputs or settings change
   */
  useEffect(() => {
    // Get current hour (0-23) for time-specific carb ratio
    const currentHour = new Date().getHours();
    
    // Calculate insulin dose using the calculation library
    const result = calculateInsulin({
      ...calculator,
      currentHour,
      carbRatio: settings.carbRatios[currentHour],  // Use hour-specific carb ratio
      sensitivity: settings.sensitivity,
      targetGlucose: settings.targetGlucose,
      insulinType: settings.insulinType
    });
    
    // Update the calculation result
    setCalculationResult(result);
  }, [calculator, settings]);

  /**
   * Updates user settings
   * 
   * @param updates - Partial settings object with properties to update
   */
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  /**
   * Updates calculator input values
   * 
   * @param updates - Partial calculator object with properties to update
   */
  const updateCalculator = (updates: Partial<Calculator>) => {
    setCalculator(prev => ({ ...prev, ...updates }));
    
    // If insulin type is changed in calculator, also update it in settings
    // This keeps insulin type synchronized between calculator and settings
    if (updates.insulinType) {
      updateSettings({ insulinType: updates.insulinType });
    }
  };

  /**
   * Updates a specific hourly carb ratio
   * 
   * @param hour - Hour of day (0-23)
   * @param value - New carb ratio value
   */
  const updateCarbRatio = (hour: number, value: number) => {
    // Create a copy of the carb ratios array
    const newCarbRatios = [...settings.carbRatios];
    // Update the specific hour
    newCarbRatios[hour] = value;
    // Update settings with the new array
    updateSettings({ carbRatios: newCarbRatios });
  };

  // Provide the context value to children
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

/**
 * Custom hook to use the calculator context
 * 
 * This hook provides easy access to the calculator context
 * and ensures it is used within a CalculatorProvider.
 * 
 * @returns The calculator context object
 * @throws Error if used outside of a CalculatorProvider
 */
export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}
