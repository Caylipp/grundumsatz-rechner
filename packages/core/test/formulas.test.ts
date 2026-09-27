import { describe, expect, it } from 'vitest';
import { bmi, cunningham, harrisBenedictRevised, katchMcArdle, mifflinStJeor, navyBodyFat } from '../src/formulas';
import { fuse, fuseIndependent, linearRegression } from '../src/stats';

describe('Formeln', () => {
  it('Mifflin-St Jeor', () => {
    expect(mifflinStJeor('male', 30, 180, 80)).toBe(1780);
    expect(mifflinStJeor('female', 30, 165, 60)).toBeCloseTo(1320.25);
  });

  it('Harris-Benedict (revidiert)', () => {
    expect(harrisBenedictRevised('male', 30, 180, 80)).toBeCloseTo(1853.63, 1);
    expect(harrisBenedictRevised('female', 30, 165, 60)).toBeCloseTo(1383.68, 1);
  });

  it('Katch-McArdle und Cunningham', () => {
    expect(katchMcArdle(65)).toBeCloseTo(1774);
    expect(cunningham(65)).toBe(1930);
  });

  it('BMI', () => {
    expect(bmi(80, 180)).toBeCloseTo(24.69, 2);
  });

  it('Navy-Methode Männer', () => {
    expect(navyBodyFat('male', 180, 85, 38)).toBeCloseTo(16.1, 1);
  });

  it('Navy-Methode Frauen braucht Hüfte', () => {
    expect(navyBodyFat('female', 165, 75, 32)).toBeNull();
    const bf = navyBodyFat('female', 165, 75, 32, 98);
    expect(bf).not.toBeNull();
    expect(bf!).toBeGreaterThan(20);
    expect(bf!).toBeLessThan(35);
  });

  it('Navy-Methode lehnt unplausible Maße ab', () => {
    expect(navyBodyFat('male', 180, 38, 40)).toBeNull();
  });
});

describe('Statistik', () => {
  it('fuse gewichtet die genauere Schätzung stärker und wird schmaler', () => {
    const r = fuse({ value: 1800, range: 180 }, { value: 1700, range: 90 }, 0);
    expect(r.value).toBeCloseTo(1720);
    expect(r.range).toBeLessThan(90);
    expect(r.weightA).toBeCloseTo(0.2);
  });

  it('fuse mit Korrelation ist konservativer', () => {
    const indep = fuse({ value: 1800, range: 180 }, { value: 1700, range: 140 }, 0);
    const corr = fuse({ value: 1800, range: 180 }, { value: 1700, range: 140 }, 0.5);
    expect(corr.range).toBeGreaterThan(indep.range);
    expect(corr.range).toBeLessThanOrEqual(140);
  });

  it('fuse klemmt Gewichte auf [0,1]', () => {
    const r = fuse({ value: 2000, range: 400 }, { value: 1800, range: 50 }, 0.9);
    expect(r.weightA).toBeGreaterThanOrEqual(0);
    expect(r.range).toBeLessThanOrEqual(50 + 1e-9);
  });

  it('fuseIndependent', () => {
    const r = fuseIndependent([
      { value: 20, range: 4 },
      { value: 16, range: 4 },
    ]);
    expect(r.value).toBeCloseTo(18);
    expect(r.range).toBeCloseTo(4 / Math.SQRT2);
  });

  it('lineare Regression', () => {
    const r = linearRegression([0, 1, 2, 3], [1, 3, 5, 7]);
    expect(r.slope).toBeCloseTo(2);
    expect(r.intercept).toBeCloseTo(1);
    expect(r.residualSd).toBeCloseTo(0);
  });
});
