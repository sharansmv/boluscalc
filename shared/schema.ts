/**
 * Database schema for the Insulin Bolus Calculator application
 * 
 * This file defines the PostgreSQL database schema using Drizzle ORM
 * and exports TypeScript types for type-safe database operations.
 */

import { pgTable, text, serial, integer, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * User account table
 * 
 * Stores basic user authentication information.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),          // Auto-incrementing primary key
  username: text("username").notNull().unique(),  // Unique username for login
  password: text("password").notNull(),   // Hashed password (never stored in plain text)
});

/**
 * Schema for inserting new users
 * 
 * Uses Zod for validation and excludes auto-generated fields.
 */
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// TypeScript types for users
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

/**
 * User settings table
 * 
 * Stores personalized settings for insulin calculations.
 * Each user has one set of settings that affect all calculations.
 */
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),          // Auto-incrementing primary key
  userId: integer("user_id").notNull().references(() => users.id),  // Foreign key to users table
  sensitivity: numeric("sensitivity").notNull(),  // Insulin sensitivity factor (mg/dL/U)
  targetGlucose: numeric("target_glucose").notNull(),  // Target blood glucose level (mg/dL)
  carbRatios: json("carb_ratios").notNull(),  // Array of 24 hourly insulin-to-carb ratios
  insulinType: text("insulin_type").notNull(),  // Preferred insulin type (e.g., 'novolog', 'fiasp')
  activeInsulinHours: numeric("active_insulin_hours").notNull(),  // Duration insulin remains active
  createdAt: timestamp("created_at").defaultNow(),  // When settings were created
});

/**
 * Schema for inserting/updating user settings
 * 
 * Uses Zod for validation to ensure data integrity.
 */
export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  sensitivity: true,
  targetGlucose: true,
  carbRatios: true,
  insulinType: true,
  activeInsulinHours: true,
});

// TypeScript types for user settings
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

/**
 * Calculation history table
 * 
 * Stores records of all insulin calculations performed by users.
 * Includes both input parameters and calculated results.
 */
export const calculationHistory = pgTable("calculation_history", {
  id: serial("id").primaryKey(),  // Auto-incrementing primary key
  userId: integer("user_id").notNull().references(() => users.id),  // Foreign key to users table
  
  // Input parameters
  currentGlucose: numeric("current_glucose").notNull(),  // Current blood glucose (mg/dL)
  carbs: numeric("carbs").notNull(),  // Carbohydrates in grams
  protein: numeric("protein").notNull(),  // Protein in grams
  fat: numeric("fat").notNull(),  // Fat in grams
  iob: numeric("iob").notNull(),  // Insulin on board (units)
  calculatedAt: timestamp("calculated_at").defaultNow(),  // When calculation was performed
  
  // Calculation results
  totalDose: numeric("total_dose").notNull(),  // Total insulin dose (units)
  normalBolus: numeric("normal_bolus").notNull(),  // Normal (immediate) bolus portion
  squareBolus: numeric("square_bolus").notNull(),  // Extended (square) bolus portion
  correction: numeric("correction").notNull(),  // Correction for high/low glucose
  carbsContribution: numeric("carbs_contribution").notNull(),  // Insulin for carbohydrates
  fpuContribution: numeric("fpu_contribution").notNull(),  // Insulin for fat/protein
  iobDeduction: numeric("iob_deduction").notNull(),  // Subtraction for active insulin
  preMealTiming: numeric("pre_meal_timing").notNull(),  // Minutes to take insulin before meal
  insulinType: text("insulin_type").notNull(),  // Insulin type used for calculation
  
  // Settings snapshot at calculation time (allows accurate historical review)
  settingsSnapshot: json("settings_snapshot").notNull(),
});

/**
 * Schema for inserting calculation records
 * 
 * Uses Zod for validation to ensure data integrity.
 */
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

// TypeScript types for calculation history
export type InsertCalculationHistory = z.infer<typeof insertCalculationHistorySchema>;
export type CalculationHistory = typeof calculationHistory.$inferSelect;
