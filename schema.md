# Insulin Bolus Calculator Database Schema

This document describes the database schema design for the Insulin Bolus Calculator application.

## Overview

The Insulin Bolus Calculator uses a PostgreSQL database with the following main entities:

1. **Users** - Store user account information
2. **User Settings** - Store personalized insulin calculation settings
3. **Calculation History** - Log of all insulin calculations performed

## Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────────┐       ┌────────────────────┐
│               │       │                   │       │                    │
│     Users     │───1:1─┤   User Settings   │       │ Calculation History│
│               │       │                   │       │                    │
└───────────────┘       └───────────────────┘       └────────────────────┘
        │                                                    ▲
        │                                                    │
        └────────────────────────────────────────────────────┘
                                  1:N
```

## Table Definitions

### Users Table

The `users` table stores basic user authentication information.

| Column     | Type    | Constraints       | Description                    |
|------------|---------|-------------------|--------------------------------|
| id         | INTEGER | PRIMARY KEY       | Auto-incremented user ID       |
| username   | TEXT    | UNIQUE, NOT NULL  | User's login username          |
| password   | TEXT    | NOT NULL          | Hashed password for security   |

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

### User Settings Table

The `user_settings` table stores personalized settings for insulin calculations.

| Column             | Type         | Constraints | Description                            |
|--------------------|--------------|-------------|----------------------------------------|
| id                 | INTEGER      | PRIMARY KEY | Auto-incremented settings ID           |
| user_id            | INTEGER      | FOREIGN KEY | Reference to users.id                  |
| sensitivity        | NUMERIC      | NOT NULL    | Insulin sensitivity (mg/dL/U)          |
| target_glucose     | NUMERIC      | NOT NULL    | Target blood glucose (mg/dL)           |
| carb_ratios        | JSON         | NOT NULL    | Array of 24 hourly carb ratios         |
| insulin_type       | TEXT         | NOT NULL    | Preferred insulin type                 |
| active_insulin_hours | NUMERIC    | NOT NULL    | Duration insulin remains active (hours) |
| created_at         | TIMESTAMP    |             | When settings were created             |

```sql
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  sensitivity NUMERIC NOT NULL,
  target_glucose NUMERIC NOT NULL,
  carb_ratios JSON NOT NULL,
  insulin_type TEXT NOT NULL,
  active_insulin_hours NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Calculation History Table

The `calculation_history` table logs all insulin calculations performed by users.

| Column             | Type         | Constraints | Description                            |
|--------------------|--------------|-------------|----------------------------------------|
| id                 | INTEGER      | PRIMARY KEY | Auto-incremented calculation ID        |
| user_id            | INTEGER      | FOREIGN KEY | Reference to users.id                  |
| current_glucose    | NUMERIC      | NOT NULL    | Blood glucose at calculation time      |
| carbs              | NUMERIC      | NOT NULL    | Carbohydrates in grams                 |
| protein            | NUMERIC      | NOT NULL    | Protein in grams                       |
| fat                | NUMERIC      | NOT NULL    | Fat in grams                           |
| iob                | NUMERIC      | NOT NULL    | Insulin on board (units)               |
| calculated_at      | TIMESTAMP    |             | When calculation was performed         |
| total_dose         | NUMERIC      | NOT NULL    | Total insulin dose (units)             |
| normal_bolus       | NUMERIC      | NOT NULL    | Normal (immediate) bolus portion       |
| square_bolus       | NUMERIC      | NOT NULL    | Extended (square) bolus portion        |
| correction         | NUMERIC      | NOT NULL    | Correction for high/low glucose        |
| carbs_contribution | NUMERIC      | NOT NULL    | Insulin for carbohydrates              |
| fpu_contribution   | NUMERIC      | NOT NULL    | Insulin for fat/protein                |
| iob_deduction      | NUMERIC      | NOT NULL    | Subtraction for active insulin         |
| pre_meal_timing    | NUMERIC      | NOT NULL    | Minutes to take insulin before meal    |
| insulin_type       | TEXT         | NOT NULL    | Insulin type used for calculation      |
| settings_snapshot  | JSON         | NOT NULL    | Copy of settings at calculation time   |

```sql
CREATE TABLE calculation_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  current_glucose NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  iob NUMERIC NOT NULL,
  calculated_at TIMESTAMP DEFAULT NOW(),
  total_dose NUMERIC NOT NULL,
  normal_bolus NUMERIC NOT NULL,
  square_bolus NUMERIC NOT NULL,
  correction NUMERIC NOT NULL,
  carbs_contribution NUMERIC NOT NULL,
  fpu_contribution NUMERIC NOT NULL,
  iob_deduction NUMERIC NOT NULL,
  pre_meal_timing NUMERIC NOT NULL,
  insulin_type TEXT NOT NULL,
  settings_snapshot JSON NOT NULL
);
```

## Data Types

- `SERIAL`: Auto-incrementing integer (PostgreSQL)
- `INTEGER`: Whole numbers
- `NUMERIC`: Decimal numbers with precision (for accurate insulin doses)
- `TEXT`: Variable-length character strings
- `JSON`: JSON data (for flexible storage of settings)
- `TIMESTAMP`: Date and time values

## Relationships

- One user has one set of settings (1:1)
- One user has many calculation records (1:N)

## Schema Implementation

The schema is implemented using Drizzle ORM in the `shared/schema.ts` file. This provides:

1. Type safety with TypeScript
2. Automatic validation with Zod
3. Consistent schema definition between frontend and backend

## Data Flow

1. User settings are loaded on application initialization
2. Calculations incorporate user settings at runtime
3. Calculation results are stored with a snapshot of settings used
4. This allows for accurate historical review even if settings change