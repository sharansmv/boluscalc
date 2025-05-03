import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSettingsSchema, insertCalculationHistorySchema } from "@shared/schema";
import { z } from "zod";

// Add insulin type definitions
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
  },
  novorapid: {
    name: 'NovoRapid (insulin aspart)',
    onset: 15,
    peak: 1,
    duration: 4,
    preMealTiming: 15
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get insulin types
  app.get('/api/insulin-types', (req, res) => {
    res.json(insulinTypes);
  });

  // User settings routes
  app.get('/api/settings/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const settings = await storage.getUserSettings(userId);
      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      res.json(settings);
    } catch (error) {
      console.error('Error getting user settings:', error);
      res.status(500).json({ error: 'Failed to get user settings' });
    }
  });

  app.post('/api/settings', async (req, res) => {
    try {
      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.createUserSettings(validatedData);
      res.status(201).json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error('Error creating user settings:', error);
        res.status(500).json({ error: 'Failed to create user settings' });
      }
    }
  });

  app.patch('/api/settings/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      // Validate only the fields being updated
      const validFields = ['sensitivity', 'targetGlucose', 'carbRatios', 'insulinType', 'activeInsulinHours'];
      const updateData: Record<string, any> = {};
      
      for (const field of validFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      const updatedSettings = await storage.updateUserSettings(userId, updateData);
      if (!updatedSettings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({ error: 'Failed to update user settings' });
    }
  });

  // Calculation history routes
  app.post('/api/calculations', async (req, res) => {
    try {
      const validatedData = insertCalculationHistorySchema.parse(req.body);
      const calculation = await storage.saveCalculation(validatedData);
      res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error('Error saving calculation:', error);
        res.status(500).json({ error: 'Failed to save calculation' });
      }
    }
  });

  app.get('/api/calculations/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const history = await storage.getUserCalculationHistory(userId);
      res.json(history);
    } catch (error) {
      console.error('Error getting calculation history:', error);
      res.status(500).json({ error: 'Failed to get calculation history' });
    }
  });

  app.get('/api/calculation/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid calculation ID' });
      }

      const calculation = await storage.getCalculationById(id);
      if (!calculation) {
        return res.status(404).json({ error: 'Calculation not found' });
      }

      res.json(calculation);
    } catch (error) {
      console.error('Error getting calculation:', error);
      res.status(500).json({ error: 'Failed to get calculation' });
    }
  });

  // Enhanced calculation endpoint that saves the result to the database
  app.post('/api/calculate', async (req, res) => {
    const {
      userId,
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

    // If user ID is provided, save the calculation to history
    if (userId) {
      try {
        // Create a settings snapshot
        const settingsSnapshot = {
          sensitivity,
          targetGlucose,
          carbRatio,
          insulinType,
          activeInsulinHours: req.body.activeInsulinHours || 4
        };

        // Prepare calculation data
        const calculationData = {
          userId,
          currentGlucose,
          carbs,
          protein,
          fat,
          iob,
          totalDose: result.totalDose,
          normalBolus: result.normalBolus,
          squareBolus: result.squareBolus,
          correction: result.correction,
          carbsContribution: result.carbsContribution,
          fpuContribution: result.fpuContribution,
          iobDeduction: result.iobDeduction,
          preMealTiming: result.preMealTiming,
          insulinType,
          settingsSnapshot
        };

        // Save calculation to database
        await storage.saveCalculation(calculationData);
      } catch (error) {
        console.error('Error saving calculation to history:', error);
        // Continue even if saving fails, return the calculation result
      }
    }
    
    res.json(result);
  });

  const httpServer = createServer(app);

  return httpServer;
}
