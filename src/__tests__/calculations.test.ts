import { calculateAmortization } from '../utils/calculations';

describe('calculateAmortization', () => {
  it('should calculate correct monthly payment for standard loan', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    expect(result.monthlyPayment).toBeCloseTo(146.76, 2);
    expect(result.rows.length).toBe(12);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('should handle zero interest rate', () => {
    const params = {
      amount: 1200,
      monthlyRate: 0,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    expect(result.monthlyPayment).toBe(100);
    expect(result.totalInterest).toBe(0);
  });

  it('should round up monthly payment', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    expect(result.monthlyPaymentRounded).toBe(Math.ceil(result.monthlyPayment));
    expect(result.monthlyPaymentRounded).toBe(147);
  });

  it('should calculate correct total payment', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    const totalFromRows = result.rows.reduce((sum: number, row: any) => sum + row.payment, 0);
    expect(result.totalPayment).toBeCloseTo(totalFromRows, 2);
  });

  it('should ensure final balance is zero', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);
    const lastRow = result.rows[result.rows.length - 1];

    expect(lastRow.finalBalance).toBe(0);
  });

  it('should generate correct number of rows', () => {
    const params = {
      amount: 5000,
      monthlyRate: 8,
      term: 24,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    expect(result.rows.length).toBe(24);
  });

  it('should calculate interest correctly for first month', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);
    const firstRow = result.rows[0];

    expect(firstRow.interest).toBe(100); // 1000 * 10%
  });

  it('should decrease interest over time', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    for (let i = 1; i < result.rows.length; i++) {
      expect(result.rows[i].interest).toBeLessThan(result.rows[i - 1].interest);
    }
  });

  it('should increase capital over time', () => {
    const params = {
      amount: 1000,
      monthlyRate: 10,
      term: 12,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    for (let i = 1; i < result.rows.length; i++) {
      expect(result.rows[i].capital).toBeGreaterThan(result.rows[i - 1].capital);
    }
  });

  it('should handle large amounts', () => {
    const params = {
      amount: 100000,
      monthlyRate: 5,
      term: 36,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    expect(result.rows.length).toBe(36);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('should handle short terms', () => {
    const params = {
      amount: 500,
      monthlyRate: 10,
      term: 1,
      startDate: '2024-01-01',
    };

    const result = calculateAmortization(params);

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].payment).toBe(550); // 500 + 500*10%
  });
});
