export interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  factorToBase: number;
}

export interface UnitCategorySpec {
  id: string;
  baseUnitLabel: string;
  units: UnitDef[];
}

export const UNIT_SPECS: Record<string, UnitCategorySpec> = {
  'length-converter': {
    id: 'length-converter',
    baseUnitLabel: 'Meter',
    units: [
      { id: 'mm', label: 'Millimeter', symbol: 'mm', factorToBase: 0.001 },
      { id: 'cm', label: 'Centimeter', symbol: 'cm', factorToBase: 0.01 },
      { id: 'm', label: 'Meter', symbol: 'm', factorToBase: 1 },
      { id: 'km', label: 'Kilometer', symbol: 'km', factorToBase: 1000 },
      { id: 'in', label: 'Inch', symbol: 'in', factorToBase: 0.0254 },
      { id: 'ft', label: 'Foot', symbol: 'ft', factorToBase: 0.3048 },
      { id: 'yd', label: 'Yard', symbol: 'yd', factorToBase: 0.9144 },
      { id: 'mi', label: 'Mile', symbol: 'mi', factorToBase: 1609.344 },
      { id: 'nmi', label: 'Nautical Mile', symbol: 'nmi', factorToBase: 1852 },
    ],
  },
  'weight-converter': {
    id: 'weight-converter',
    baseUnitLabel: 'Kilogram',
    units: [
      { id: 'mg', label: 'Milligram', symbol: 'mg', factorToBase: 1e-6 },
      { id: 'g', label: 'Gram', symbol: 'g', factorToBase: 0.001 },
      { id: 'kg', label: 'Kilogram', symbol: 'kg', factorToBase: 1 },
      { id: 't', label: 'Metric Ton', symbol: 't', factorToBase: 1000 },
      { id: 'oz', label: 'Ounce', symbol: 'oz', factorToBase: 0.028349523125 },
      { id: 'lb', label: 'Pound', symbol: 'lb', factorToBase: 0.45359237 },
      { id: 'st', label: 'Stone', symbol: 'st', factorToBase: 6.35029318 },
      { id: 'ton_us', label: 'US Short Ton', symbol: 'ton', factorToBase: 907.18474 },
    ],
  },
  'volume-converter': {
    id: 'volume-converter',
    baseUnitLabel: 'Liter',
    units: [
      { id: 'ml', label: 'Milliliter', symbol: 'mL', factorToBase: 0.001 },
      { id: 'l', label: 'Liter', symbol: 'L', factorToBase: 1 },
      { id: 'm3', label: 'Cubic Meter', symbol: 'm³', factorToBase: 1000 },
      { id: 'tsp', label: 'Teaspoon (US)', symbol: 'tsp', factorToBase: 0.00492892159375 },
      { id: 'tbsp', label: 'Tablespoon (US)', symbol: 'tbsp', factorToBase: 0.01478676478125 },
      { id: 'floz', label: 'Fluid Ounce (US)', symbol: 'fl oz', factorToBase: 0.0295735295625 },
      { id: 'cup', label: 'Cup (US)', symbol: 'cup', factorToBase: 0.2365882365 },
      { id: 'pt', label: 'Pint (US)', symbol: 'pt', factorToBase: 0.473176473 },
      { id: 'qt', label: 'Quart (US)', symbol: 'qt', factorToBase: 0.946352946 },
      { id: 'gal_us', label: 'Gallon (US)', symbol: 'gal', factorToBase: 3.785411784 },
      { id: 'gal_uk', label: 'Gallon (Imperial)', symbol: 'imp gal', factorToBase: 4.54609 },
    ],
  },
  'area-converter': {
    id: 'area-converter',
    baseUnitLabel: 'Square Meter',
    units: [
      { id: 'mm2', label: 'Square Millimeter', symbol: 'mm²', factorToBase: 1e-6 },
      { id: 'cm2', label: 'Square Centimeter', symbol: 'cm²', factorToBase: 1e-4 },
      { id: 'm2', label: 'Square Meter', symbol: 'm²', factorToBase: 1 },
      { id: 'ha', label: 'Hectare', symbol: 'ha', factorToBase: 10000 },
      { id: 'km2', label: 'Square Kilometer', symbol: 'km²', factorToBase: 1e6 },
      { id: 'in2', label: 'Square Inch', symbol: 'in²', factorToBase: 0.00064516 },
      { id: 'ft2', label: 'Square Foot', symbol: 'ft²', factorToBase: 0.09290304 },
      { id: 'yd2', label: 'Square Yard', symbol: 'yd²', factorToBase: 0.83612736 },
      { id: 'acre', label: 'Acre', symbol: 'ac', factorToBase: 4046.8564224 },
      { id: 'mi2', label: 'Square Mile', symbol: 'mi²', factorToBase: 2589988.110336 },
    ],
  },
  'speed-converter': {
    id: 'speed-converter',
    baseUnitLabel: 'Meters per Second',
    units: [
      { id: 'mps', label: 'Meters per second', symbol: 'm/s', factorToBase: 1 },
      { id: 'kmh', label: 'Kilometers per hour', symbol: 'km/h', factorToBase: 1 / 3.6 },
      { id: 'mph', label: 'Miles per hour', symbol: 'mph', factorToBase: 0.44704 },
      { id: 'knot', label: 'Knot', symbol: 'kn', factorToBase: 1852 / 3600 },
      { id: 'fps', label: 'Feet per second', symbol: 'ft/s', factorToBase: 0.3048 },
      { id: 'mach', label: 'Mach (ISA Sea Level)', symbol: 'Mach', factorToBase: 340.29 },
    ],
  },
  'time-converter': {
    id: 'time-converter',
    baseUnitLabel: 'Second',
    units: [
      { id: 'ms', label: 'Millisecond', symbol: 'ms', factorToBase: 0.001 },
      { id: 's', label: 'Second', symbol: 's', factorToBase: 1 },
      { id: 'min', label: 'Minute', symbol: 'min', factorToBase: 60 },
      { id: 'hr', label: 'Hour', symbol: 'hr', factorToBase: 3600 },
      { id: 'day', label: 'Day', symbol: 'd', factorToBase: 86400 },
      { id: 'wk', label: 'Week', symbol: 'wk', factorToBase: 604800 },
      { id: 'mo', label: 'Month (30.4375d avg)', symbol: 'mo', factorToBase: 2629800 },
      { id: 'yr', label: 'Year (365.25d)', symbol: 'yr', factorToBase: 31557600 },
    ],
  },
  'data-storage-converter': {
    id: 'data-storage-converter',
    baseUnitLabel: 'Byte',
    units: [
      { id: 'bit', label: 'Bit', symbol: 'b', factorToBase: 0.125 },
      { id: 'B', label: 'Byte', symbol: 'B', factorToBase: 1 },
      { id: 'KB', label: 'Kilobyte (SI 10³)', symbol: 'KB', factorToBase: 1e3 },
      { id: 'MB', label: 'Megabyte (SI 10⁶)', symbol: 'MB', factorToBase: 1e6 },
      { id: 'GB', label: 'Gigabyte (SI 10⁹)', symbol: 'GB', factorToBase: 1e9 },
      { id: 'TB', label: 'Terabyte (SI 10¹²)', symbol: 'TB', factorToBase: 1e12 },
      { id: 'PB', label: 'Petabyte (SI 10¹⁵)', symbol: 'PB', factorToBase: 1e15 },
      { id: 'KiB', label: 'Kibibyte (IEC 2¹⁰)', symbol: 'KiB', factorToBase: 1024 },
      { id: 'MiB', label: 'Mebibyte (IEC 2²⁰)', symbol: 'MiB', factorToBase: 1048576 },
      { id: 'GiB', label: 'Gibibyte (IEC 2³⁰)', symbol: 'GiB', factorToBase: 1073741824 },
      { id: 'TiB', label: 'Tebibyte (IEC 2⁴⁰)', symbol: 'TiB', factorToBase: 1099511627776 },
    ],
  },
  'energy-converter': {
    id: 'energy-converter',
    baseUnitLabel: 'Joule',
    units: [
      { id: 'J', label: 'Joule', symbol: 'J', factorToBase: 1 },
      { id: 'kJ', label: 'Kilojoule', symbol: 'kJ', factorToBase: 1000 },
      { id: 'MJ', label: 'Megajoule', symbol: 'MJ', factorToBase: 1e6 },
      { id: 'cal', label: 'Calorie (th)', symbol: 'cal', factorToBase: 4.184 },
      { id: 'kcal', label: 'Kilocalorie (Food Cal)', symbol: 'kcal', factorToBase: 4184 },
      { id: 'Wh', label: 'Watt-hour', symbol: 'Wh', factorToBase: 3600 },
      { id: 'kWh', label: 'Kilowatt-hour', symbol: 'kWh', factorToBase: 3.6e6 },
      { id: 'BTU', label: 'British Thermal Unit', symbol: 'BTU', factorToBase: 1055.05585 },
      { id: 'ft_lbf', label: 'Foot-pound', symbol: 'ft·lbf', factorToBase: 1.355817948 },
    ],
  },
  'pressure-converter': {
    id: 'pressure-converter',
    baseUnitLabel: 'Pascal',
    units: [
      { id: 'Pa', label: 'Pascal', symbol: 'Pa', factorToBase: 1 },
      { id: 'kPa', label: 'Kilopascal', symbol: 'kPa', factorToBase: 1000 },
      { id: 'MPa', label: 'Megapascal', symbol: 'MPa', factorToBase: 1e6 },
      { id: 'bar', label: 'Bar', symbol: 'bar', factorToBase: 100000 },
      { id: 'mbar', label: 'Millibar', symbol: 'mbar', factorToBase: 100 },
      { id: 'psi', label: 'Pounds per sq in', symbol: 'psi', factorToBase: 6894.757293 },
      { id: 'atm', label: 'Standard Atmosphere', symbol: 'atm', factorToBase: 101325 },
      { id: 'torr', label: 'Torr / mmHg', symbol: 'mmHg', factorToBase: 133.322368 },
    ],
  },
  'power-converter': {
    id: 'power-converter',
    baseUnitLabel: 'Watt',
    units: [
      { id: 'W', label: 'Watt', symbol: 'W', factorToBase: 1 },
      { id: 'kW', label: 'Kilowatt', symbol: 'kW', factorToBase: 1000 },
      { id: 'MW', label: 'Megawatt', symbol: 'MW', factorToBase: 1e6 },
      { id: 'hp_mech', label: 'Horsepower (Mechanical)', symbol: 'hp', factorToBase: 745.699872 },
      { id: 'hp_met', label: 'Horsepower (Metric)', symbol: 'PS', factorToBase: 735.49875 },
      { id: 'btu_hr', label: 'BTU per hour', symbol: 'BTU/h', factorToBase: 0.29307107 },
      { id: 'ftlbf_s', label: 'Foot-pounds per second', symbol: 'ft·lbf/s', factorToBase: 1.355817948 },
    ],
  },
  'angle-converter': {
    id: 'angle-converter',
    baseUnitLabel: 'Degree',
    units: [
      { id: 'deg', label: 'Degree', symbol: '°', factorToBase: 1 },
      { id: 'rad', label: 'Radian', symbol: 'rad', factorToBase: 180 / Math.PI },
      { id: 'grad', label: 'Gradian', symbol: 'gon', factorToBase: 0.9 },
      { id: 'arcmin', label: 'Arcminute', symbol: '′', factorToBase: 1 / 60 },
      { id: 'arcsec', label: 'Arcsecond', symbol: '″', factorToBase: 1 / 3600 },
      { id: 'rev', label: 'Revolution / Turn', symbol: 'rev', factorToBase: 360 },
    ],
  },
  'cooking-measurement-converter': {
    id: 'cooking-measurement-converter',
    baseUnitLabel: 'Milliliter',
    units: [
      { id: 'ml', label: 'Milliliter', symbol: 'mL', factorToBase: 1 },
      { id: 'l', label: 'Liter', symbol: 'L', factorToBase: 1000 },
      { id: 'tsp', label: 'Teaspoon (US)', symbol: 'tsp', factorToBase: 4.92892159375 },
      { id: 'tbsp', label: 'Tablespoon (US)', symbol: 'tbsp', factorToBase: 14.78676478125 },
      { id: 'floz', label: 'Fluid Ounce (US)', symbol: 'fl oz', factorToBase: 29.5735295625 },
      { id: 'cup_us', label: 'Cup (US)', symbol: 'cup', factorToBase: 236.5882365 },
      { id: 'cup_metric', label: 'Cup (Metric 250 mL)', symbol: 'm-cup', factorToBase: 250 },
      { id: 'pt', label: 'Pint (US)', symbol: 'pt', factorToBase: 473.176473 },
      { id: 'qt', label: 'Quart (US)', symbol: 'qt', factorToBase: 946.352946 },
      { id: 'gal', label: 'Gallon (US)', symbol: 'gal', factorToBase: 3785.411784 },
    ],
  },
};

export function convertLinearUnit(
  specId: string,
  value: number,
  fromUnitId: string,
  toUnitId: string
): number {
  const spec = UNIT_SPECS[specId];
  if (!spec) throw new Error(`Unknown unit specification: ${specId}`);
  const from = spec.units.find((u) => u.id === fromUnitId);
  const to = spec.units.find((u) => u.id === toUnitId);
  if (!from || !to) throw new Error('Invalid unit selection');
  return (value * from.factorToBase) / to.factorToBase;
}

export type TempUnit = 'C' | 'F' | 'K' | 'R';

export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  let celsius = value;
  if (from === 'F') celsius = (value - 32) * (5 / 9);
  else if (from === 'K') celsius = value - 273.15;
  else if (from === 'R') celsius = (value - 491.67) * (5 / 9);

  if (to === 'C') return celsius;
  if (to === 'F') return celsius * (9 / 5) + 32;
  if (to === 'K') return celsius + 273.15;
  return (celsius + 273.15) * (9 / 5);
}

export type FuelUnit = 'mpg_us' | 'mpg_uk' | 'kml' | 'l100km';

export function convertFuelEconomy(value: number, from: FuelUnit, to: FuelUnit): number {
  if (value <= 0) return 0;
  // Convert to km/L first
  let kml = value;
  if (from === 'mpg_us') kml = value * 0.425143707;
  else if (from === 'mpg_uk') kml = value * 0.35400619;
  else if (from === 'l100km') kml = 100 / value;

  if (to === 'kml') return kml;
  if (to === 'mpg_us') return kml / 0.425143707;
  if (to === 'mpg_uk') return kml / 0.35400619;
  return 100 / kml;
}

export function convertCurrencyAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  ratesFromUsd: Record<string, number>
): { converted: number; directRate: number; inverseRate: number } {
  const fromRate = ratesFromUsd[fromCurrency];
  const toRate = ratesFromUsd[toCurrency];
  if (!fromRate || !toRate) {
    throw new Error('Currency rate unavailable');
  }
  const directRate = toRate / fromRate;
  const inverseRate = fromRate / toRate;
  return {
    converted: amount * directRate,
    directRate,
    inverseRate,
  };
}
