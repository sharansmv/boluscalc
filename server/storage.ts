import { users, userSettings, calculationHistory, 
  type User, type InsertUser, 
  type UserSettings, type InsertUserSettings,
  type CalculationHistory, type InsertCalculationHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [createdSettings] = await db.insert(userSettings).values(settings).returning();
    return createdSettings;
  }

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

  // Calculation history operations
  async saveCalculation(calculation: InsertCalculationHistory): Promise<CalculationHistory> {
    const [savedCalculation] = await db
      .insert(calculationHistory)
      .values(calculation)
      .returning();
    return savedCalculation;
  }

  async getUserCalculationHistory(userId: number): Promise<CalculationHistory[]> {
    return db
      .select()
      .from(calculationHistory)
      .where(eq(calculationHistory.userId, userId))
      .orderBy(calculationHistory.calculatedAt);
  }

  async getCalculationById(id: number): Promise<CalculationHistory | undefined> {
    const [calculation] = await db
      .select()
      .from(calculationHistory)
      .where(eq(calculationHistory.id, id));
    return calculation;
  }
}

export const storage = new DatabaseStorage();
