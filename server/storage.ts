/**
 * Storage interface and implementation for the Insulin Bolus Calculator
 * 
 * This file provides database access via Drizzle ORM to perform CRUD operations
 * on users, settings, and calculation history.
 */

import { users, userSettings, calculationHistory, 
  type User, type InsertUser, 
  type UserSettings, type InsertUserSettings,
  type CalculationHistory, type InsertCalculationHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

/**
 * Storage interface defining all database operations
 * 
 * This interface allows for potential alternative implementations
 * (e.g., for testing or future migration to different storage)
 */
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<Omit<InsertUserSettings, "userId">>): Promise<UserSettings | undefined>;
  
  // Calculation history operations
  saveCalculation(calculation: InsertCalculationHistory): Promise<CalculationHistory>;
  getUserCalculationHistory(userId: number): Promise<CalculationHistory[]>;
  getCalculationById(id: number): Promise<CalculationHistory | undefined>;
}

/**
 * PostgreSQL database implementation of the storage interface
 * 
 * Provides database access via Drizzle ORM for all operations
 * defined in the IStorage interface.
 */
export class DatabaseStorage implements IStorage {
  /**
   * Retrieves a user by their ID
   * 
   * @param id - The user's numeric ID
   * @returns The user object if found, undefined otherwise
   */
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Retrieves a user by their username
   * 
   * @param username - The user's username
   * @returns The user object if found, undefined otherwise
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  /**
   * Creates a new user in the database
   * 
   * @param insertUser - User data to insert
   * @returns The created user with ID
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  /**
   * Retrieves user settings by user ID
   * 
   * @param userId - The user's ID
   * @returns The user's settings if found, undefined otherwise
   */
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  /**
   * Creates new settings for a user
   * 
   * @param settings - The settings data to insert
   * @returns The created settings record
   */
  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [createdSettings] = await db.insert(userSettings).values(settings).returning();
    return createdSettings;
  }

  /**
   * Updates a user's settings
   * 
   * @param userId - The user's ID
   * @param settingsUpdate - Partial settings data to update
   * @returns The updated settings if found, undefined otherwise
   */
  async updateUserSettings(
    userId: number, 
    settingsUpdate: Partial<Omit<InsertUserSettings, "userId">>
  ): Promise<UserSettings | undefined> {
    const [updatedSettings] = await db
      .update(userSettings)
      .set(settingsUpdate)
      .where(eq(userSettings.userId, userId))
      .returning();
    return updatedSettings;
  }

  /**
   * Saves a calculation to history
   * 
   * @param calculation - The calculation data to save
   * @returns The saved calculation record
   */
  async saveCalculation(calculation: InsertCalculationHistory): Promise<CalculationHistory> {
    const [savedCalculation] = await db
      .insert(calculationHistory)
      .values(calculation)
      .returning();
    return savedCalculation;
  }

  /**
   * Retrieves a user's calculation history
   * 
   * @param userId - The user's ID
   * @returns Array of calculation history records
   */
  async getUserCalculationHistory(userId: number): Promise<CalculationHistory[]> {
    return db
      .select()
      .from(calculationHistory)
      .where(eq(calculationHistory.userId, userId))
      .orderBy(calculationHistory.calculatedAt);
  }

  /**
   * Retrieves a specific calculation by ID
   * 
   * @param id - The calculation ID
   * @returns The calculation if found, undefined otherwise
   */
  async getCalculationById(id: number): Promise<CalculationHistory | undefined> {
    const [calculation] = await db
      .select()
      .from(calculationHistory)
      .where(eq(calculationHistory.id, id));
    return calculation;
  }
}

// Export an instance of the database storage implementation
export const storage = new DatabaseStorage();
