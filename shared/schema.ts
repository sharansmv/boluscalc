import { pgTable, text, serial, integer, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User settings for insulin calculations
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sensitivity: numeric("sensitivity").notNull(), // mg/dL/U
  targetGlucose: numeric("target_glucose").notNull(), // mg/dL
  carbRatios: json("carb_ratios").notNull(), // Array of 24 ratios (one per hour)
  insulinType: text("insulin_type").notNull(),
  activeInsulinHours: numeric("active_insulin_hours").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  sensitivity: true,
  targetGlucose: true,
  carbRatios: true,
  insulinType: true,
  activeInsulinHours: true,
});

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

// Calculation history
export const calculationHistory = pgTable("calculation_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentGlucose: numeric("current_glucose").notNull(), // mg/dL
  carbs: numeric("carbs").notNull(), // grams
  protein: numeric("protein").notNull(), // grams
  fat: numeric("fat").notNull(), // grams
  iob: numeric("iob").notNull(), // insulin on board (units)
  calculatedAt: timestamp("calculated_at").defaultNow(),
  // Results
  totalDose: numeric("total_dose").notNull(), // units
  normalBolus: numeric("normal_bolus").notNull(), // units
  squareBolus: numeric("square_bolus").notNull(), // units
  correction: numeric("correction").notNull(), // units
  carbsContribution: numeric("carbs_contribution").notNull(), // units
  fpuContribution: numeric("fpu_contribution").notNull(), // units
  iobDeduction: numeric("iob_deduction").notNull(), // units
  preMealTiming: numeric("pre_meal_timing").notNull(), // minutes
  insulinType: text("insulin_type").notNull(),
  // Settings snapshot at calculation time
  settingsSnapshot: json("settings_snapshot").notNull(),
});

export const insertCalculationHistorySchema = createInsertSchema(calculationHistory).pick({
  userId: true,
  currentGlucose: true,
  carbs: true,
  protein: true,
  fat: true,
  iob: true,
  totalDose: true,
  normalBolus: true,
  squareBolus: true,
  correction: true,
  carbsContribution: true,
  fpuContribution: true,
  iobDeduction: true,
  preMealTiming: true,
  insulinType: true,
  settingsSnapshot: true,
});

export type InsertCalculationHistory = z.infer<typeof insertCalculationHistorySchema>;
export type CalculationHistory = typeof calculationHistory.$inferSelect;
