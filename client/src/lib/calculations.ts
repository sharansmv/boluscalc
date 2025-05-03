/**
 * Insulin Bolus Calculator - Core Calculation Logic
 * 
 * This module contains the algorithms for calculating insulin doses based on
 * various factors including carbohydrates, fat, protein, and current glucose levels.
 */

import { insulinTypes } from './insulinTypes';

/**
 * Input parameters required for insulin calculation
 * 
 * @property currentGlucose - Current blood glucose level in mg/dL
 * @property carbs - Carbohydrate content of meal in grams
 * @property protein - Protein content of meal in grams
 * @property fat - Fat content of meal in grams
 * @property iob - Insulin on board (active insulin) in units
 * @property currentHour - Current hour (0-23) for time-based calculations
 * @property carbRatio - Insulin-to-carb ratio (grams of carbs covered by 1 unit of insulin)
 * @property sensitivity - Insulin sensitivity factor (mg/dL drop per unit of insulin)
 * @property targetGlucose - Target blood glucose level in mg/dL
 * @property insulinType - Type of insulin being used (key from insulinTypes)
 */
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

/**
 * Result of insulin dose calculation
 * 
 * @property totalDose - Total insulin dose in units
 * @property normalBolus - Immediate bolus portion in units
 * @property squareBolus - Extended bolus portion in units
 * @property correction - Correction component for high/low glucose in units
 * @property carbsContribution - Insulin for carbohydrates in units
 * @property fpuContribution - Insulin for fat and protein in units
 * @property iobDeduction - Insulin subtracted due to IOB in units
 * @property preMealTiming - Minutes before meal to take insulin
 * @property insulinType - Full name of insulin type used
 */
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

/**
 * Calculates insulin dose based on meal content and current glucose level
 * 
 * This function implements the core insulin dosing algorithm, which:
 * 1. Calculates insulin needed for carbohydrates
 * 2. Calculates insulin needed for fat and protein (using the FPU concept)
 * 3. Adds correction insulin if glucose is above target
 * 4. Subtracts insulin on board to prevent stacking
 * 5. Splits the dose into immediate and extended components based on meal composition
 * 
 * @param input - Object containing all calculation parameters
 * @returns Object containing the calculated insulin doses and components
 */
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
  
  // Calculate carb units (insulin needed for carbohydrates)
  // Formula: carbs ÷ carbRatio = insulin units
  const CU = carbs / carbRatio;
  
  // Calculate Fat Protein Units (FPU)
  // This converts fat and protein into a measure of their impact on blood glucose
  // Formula: (protein × 4.0 + fat × 9.0) ÷ 100 = FPU
  // The multipliers represent calories per gram, and division by 100 converts to equivalent units
  const FPU = (protein * 4.0 + fat * 9.0) / 100;
  
  // Calculate the percentage of total food insulin that should be immediate
  // This is based on the proportion of carbs vs. fat/protein
  // Formula: CU ÷ (CU + FPU) = percentage as immediate bolus
  // The || 1 prevents division by zero if both CU and FPU are zero
  const CU_perc = CU / (CU + FPU || 1);
  
  // Calculate correction insulin (for high blood glucose)
  // Formula: (current - target) ÷ sensitivity = correction units
  // This may be negative if glucose is below target
  const correction = (currentGlucose - targetGlucose) / sensitivity;
  
  // Calculate the total insulin dose
  // Sum of carb insulin, fat/protein insulin, and correction, minus IOB
  // Math.max ensures we never recommend a negative dose
  const totalDose = Math.max(0, CU + FPU + correction - iob);
  
  // Split the total dose into normal (immediate) and square (extended) components
  // The immediate portion covers carbs and some correction
  const normalBolus = totalDose * CU_perc;
  
  // The extended portion covers fat/protein which have slower impact
  const squareBolus = totalDose - normalBolus;
  
  // Get insulin type details from the defined insulin types
  const insulinTypeInfo = insulinTypes[insulinType];
  
  // Return the calculation results, formatted to 2 decimal places for readability
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
