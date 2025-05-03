export interface InsulinType {
  name: string;
  onset: number; // minutes
  peak: number; // hours
  duration: number; // hours
  preMealTiming: number; // minutes before meal
}

export const insulinTypes: Record<string, InsulinType> = {
  novolog: {
    name: 'NovoLog (insulin aspart)',
    onset: 15,
    peak: 1,
    duration: 4,
    preMealTiming: 15
  },
  novorapid: {
    name: 'NovoRapid (insulin aspart)',
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
