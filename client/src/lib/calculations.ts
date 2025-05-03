import { insulinTypes } from './insulinTypes';

interface CalculationInput {
  currentGlucose: number;
  carbs: number;
  protein: number;
  fat: number;
  iob: number;
  currentHour: number;
  carbRatio: number;
  sensitivity: number;
  targetGlucose: number;
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

export function calculateInsulin(input: CalculationInput): CalculationResult {
  const {
    currentGlucose,
    carbs,
    protein,
    fat,
    iob,
    carbRatio,
    sensitivity,
    targetGlucose,
    insulinType
  } = input;
  
  // Calculate carb units
  const CU = carbs / carbRatio;
  
  // Calculate Fat Protein Units
  const FPU = (protein * 4.0 + fat * 9.0) / 100;
  
  // Calculate CU percentage
  const CU_perc = CU / (CU + FPU || 1); // Avoid division by zero
  
  // Calculate correction
  const correction = (currentGlucose - targetGlucose) / sensitivity;
  
  // Calculate bolus doses
  const totalDose = Math.max(0, CU + FPU + correction - iob);
  const normalBolus = totalDose * CU_perc;
  const squareBolus = totalDose - normalBolus;
  
  // Get selected insulin type info
  const insulinTypeInfo = insulinTypes[insulinType];
  
  return {
    totalDose: parseFloat(totalDose.toFixed(2)),
    normalBolus: parseFloat(normalBolus.toFixed(2)),
    squareBolus: parseFloat(squareBolus.toFixed(2)),
    correction: parseFloat(correction.toFixed(2)),
    carbsContribution: parseFloat(CU.toFixed(2)),
    fpuContribution: parseFloat(FPU.toFixed(2)),
    iobDeduction: parseFloat(iob.toFixed(2)),
    preMealTiming: insulinTypeInfo.preMealTiming,
    insulinType: insulinTypeInfo.name
  };
}
