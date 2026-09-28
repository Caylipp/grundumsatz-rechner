import { formatters, messages } from './i18n';
import type { FieldError, Inputs, Locale } from './types';

function num(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

export function validate(input: Partial<Inputs>, locale: Locale = 'de'): FieldError[] {
  const t = messages(locale).validation;
  const f = formatters(locale);
  const errors: FieldError[] = [];
  const check = (field: string, value: unknown, min: number, max: number, label: string, unit: string, required: boolean) => {
    if (value === undefined || value === null) {
      if (required) errors.push({ field, message: t.missing(label) });
    } else if (!num(value)) {
      errors.push({ field, message: t.nan(label) });
    } else if (value < min || value > max) {
      errors.push({ field, message: t.range(label, f.num(min), f.num(max), unit).replace(/\s+\./, '.') });
    }
  };
  const L = t.labels;
  const U = t.units;

  if (input.sex !== 'male' && input.sex !== 'female') errors.push({ field: 'sex', message: t.sex });
  check('age', input.age, 15, 100, L.age, U.years, true);
  check('heightCm', input.heightCm, 120, 230, L.heightCm, U.cm, true);
  check('weightKg', input.weightKg, 30, 300, L.weightKg, U.kg, true);
  if (input.bodyFat) {
    check('bodyFat', input.bodyFat.percent, 3, 60, L.bodyFat, U.pct, true);
    check('readings', input.bodyFat.readings, 1, 60, L.readings, U.count, false);
  }
  const c = input.circumferences;
  if (c) {
    check('waistCm', c.waistCm, 40, 200, L.waistCm, U.cm, false);
    check('neckCm', c.neckCm, 20, 70, L.neckCm, U.cm, false);
    check('hipCm', c.hipCm, 50, 200, L.hipCm, U.cm, false);
    if (num(c.waistCm) && num(c.neckCm) && c.neckCm >= c.waistCm) errors.push({ field: 'neckCm', message: t.neckWaist });
  }
  for (const [site, value] of Object.entries(input.skinfolds ?? {})) {
    check(`skinfold.${site}`, value, 2, 80, L.skinfold, U.mm, false);
  }
  if (input.measuredRmr) check('rmr', input.measuredRmr.kcal, 700, 5000, L.rmr, U.kcal, true);
  if (input.modifiers?.sleepHours !== undefined) check('sleepHours', input.modifiers.sleepHours, 2, 14, L.sleepHours, U.hours, false);
  return errors;
}
