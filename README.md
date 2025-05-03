# Insulin Bolus Calculator

A responsive web application to help people with diabetes calculate accurate insulin doses based on various factors.

## Overview

The Insulin Bolus Calculator is designed to help individuals with diabetes determine their insulin dosage for meals by taking into account multiple factors:

- Current blood glucose level
- Carbohydrate intake
- Protein and fat content (which affect absorption rates)
- Active insulin on board (IOB)
- Individual insulin sensitivity
- Target glucose level
- Different insulin types and their action profiles

## Features

- **Precise Insulin Calculations**: Calculate insulin doses based on comprehensive factors
- **Dual-Wave Bolus Support**: Split doses into normal and square wave boluses for complex meals
- **Multiple Insulin Types**: Support for various rapid-acting insulin types with different onset and duration profiles
- **Personalized Settings**: Customize insulin sensitivity, carb ratios, and target glucose levels
- **Calculation History**: Save and review past calculations
- **Detailed Explanations**: Visual breakdown of how each factor contributes to the final dose
- **Mobile-Friendly Design**: Responsive interface with numeric keyboard support for mobile devices

## Usage

1. Configure your personal settings in the Settings tab
2. Enter your current glucose reading, meal information, and IOB in the Calculator tab
3. Get instant insulin dosage recommendations with timing guidance
4. View detailed explanations and insulin action charts in the Details tab

## Technical Details

This application uses:
- React with TypeScript for the frontend
- Express.js for the backend API
- PostgreSQL database for data storage
- Tailwind CSS with shadcn/ui components for styling

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Push database schema
npm run db:push
```

## License

[MIT](LICENSE)