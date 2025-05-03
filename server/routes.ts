import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get insulin types
  app.get('/api/insulin-types', (req, res) => {
    const insulinTypes = {
      novolog: {
        name: 'NovoLog (insulin aspart)',
        onset: 15,
        peak: 1,
        duration: 4,
        preMealTiming: 15
      },
      humalog: {
        name: 'Humalog (insulin lispro)',
        onset: 15,
        peak: 1,
        duration: 4,
        preMealTiming: 15
      },
      apidra: {
        name: 'Apidra (insulin glulisine)',
        onset: 15,
        peak: 1,
        duration: 4,
        preMealTiming: 15
      },
      fiasp: {
        name: 'Fiasp (faster-acting insulin aspart)',
        onset: 5,
        peak: 0.75,
        duration: 3.5,
        preMealTiming: 0
      },
      lyumjev: {
        name: 'Lyumjev (ultra rapid lispro)',
        onset: 5,
        peak: 0.75,
        duration: 3.5,
        preMealTiming: 0
      }
    };
    
    res.json(insulinTypes);
  });

  // Add calculation endpoint for reference
  app.post('/api/calculate', (req, res) => {
    const {
      currentGlucose,
      carbs,
      protein,
      fat,
      iob,
      currentHour,
      carbRatio,
      sensitivity,
      targetGlucose,
      insulinType
    } = req.body;
    
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
    const insulinTypes = {
      novolog: {
        name: 'NovoLog (insulin aspart)',
        onset: 15,
        peak: 1,
        duration: 4,
        preMealTiming: 15
      },
      humalog: {
        name: 'Humalog (insulin lispro)',
        onset: 15,
        peak: 1,
        duration: 4,
        preMealTiming: 15
      },
      apidra: {
        name: 'Apidra (insulin glulisine)',
        onset: 15,
        peak: 1,
        duration: 4,
        preMealTiming: 15
      },
      fiasp: {
        name: 'Fiasp (faster-acting insulin aspart)',
        onset: 5,
        peak: 0.75,
        duration: 3.5,
        preMealTiming: 0
      },
      lyumjev: {
        name: 'Lyumjev (ultra rapid lispro)',
        onset: 5,
        peak: 0.75,
        duration: 3.5,
        preMealTiming: 0
      }
    };
    
    const insulinTypeInfo = insulinTypes[insulinType];
    
    const result = {
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
    
    res.json(result);
  });

  const httpServer = createServer(app);

  return httpServer;
}
