import type { FieldError, Inputs } from './types';

function num(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

function checkRange(errors: FieldError[], field: string, value: unknown, min: number, max: number, label: string, unit: string, required: boolean) {
  if (value === undefined || value === null) {
    if (required) errors.push({ field, message: `${label} fehlt.` });
    return;
  }
  if (!num(value)) {
    errors.push({ field, message: `${label} ist keine gültige Zahl.` });
  } else if (value < min || value > max) {
    errors.push({ field, message: `${label} muss zwischen ${min} und ${max} ${unit} liegen.` });
  }
}

export function validate(input: Partial<Inputs>): FieldError[] {
  const errors: FieldError[] = [];
  if (input.sex !== 'male' && input.sex !== 'female') errors.push({ field: 'sex', message: 'Bitte Geschlecht wählen.' });
  checkRange(errors, 'age', input.age, 15, 100, 'Alter', 'Jahren', true);
  checkRange(errors, 'heightCm', input.heightCm, 120, 230, 'Größe', 'cm', true);
  checkRange(errors, 'weightKg', input.weightKg, 30, 300, 'Gewicht', 'kg', true);
  if (input.bodyFat) checkRange(errors, 'bodyFat', input.bodyFat.percent, 3, 60, 'Körperfettanteil', '%', true);
  const c = input.circumferences;
  if (c) {
    checkRange(errors, 'waistCm', c.waistCm, 40, 200, 'Taillenumfang', 'cm', false);
    checkRange(errors, 'neckCm', c.neckCm, 20, 70, 'Halsumfang', 'cm', false);
    checkRange(errors, 'hipCm', c.hipCm, 50, 200, 'Hüftumfang', 'cm', false);
    if (num(c.waistCm) && num(c.neckCm) && c.neckCm >= c.waistCm) {
      errors.push({ field: 'neckCm', message: 'Der Halsumfang muss kleiner als der Taillenumfang sein.' });
    }
  }
  if (input.modifiers?.sleepHours !== undefined) {
    checkRange(errors, 'sleepHours', input.modifiers.sleepHours, 2, 14, 'Schlafdauer', 'Stunden', false);
  }
  return errors;
}
