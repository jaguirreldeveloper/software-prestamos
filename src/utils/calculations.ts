import { LoanParams, AmortizationRow } from '../types';

export interface AmortizationResult {
  monthlyPayment: number;
  monthlyPaymentRounded: number;
  totalPayment: number;
  totalRoundedPayment: number;
  totalInterest: number;
  rows: AmortizationRow[];
}

export function calculateAmortization(params: LoanParams): AmortizationResult {
  const { amount, monthlyRate, term, startDate } = params;
  const rate = monthlyRate / 100;
  
  // Calcular cuota mensual con fórmula de amortización francesa
  const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
  const monthlyPaymentRounded = Math.ceil(monthlyPayment); // Redondeo al entero superior
  
  const rows: AmortizationRow[] = [];
  let balance = amount;
  let totalInterest = 0;
  let totalPayment = 0;
  let totalRoundedPayment = 0;
  let accumulatedDifference = 0;

  // Generar solo las cuotas reales (1 a term)
  for (let i = 1; i <= term; i++) {
    // Calcular interés sobre el saldo actual
    const interest = Math.round(balance * rate * 100) / 100;
    
    // En la última cuota, ajustar el capital para que el saldo final sea exactamente 0
    let capital: number;
    let payment: number;
    let roundedPayment: number;
    
    if (i === term) {
      // Última cuota: el capital es igual al saldo restante
      capital = Math.round(balance * 100) / 100;
      payment = Math.round((capital + interest) * 100) / 100;
      // Ajustar cuota redondeada para compensar diferencia acumulada
      roundedPayment = Math.round((payment - accumulatedDifference) * 100) / 100;
    } else {
      // Cuotas normales
      capital = Math.round((monthlyPayment - interest) * 100) / 100;
      payment = Math.round(monthlyPayment * 100) / 100;
      roundedPayment = monthlyPaymentRounded;
    }
    
    // Calcular diferencia por redondeo
    const difference = Math.round((roundedPayment - payment) * 100) / 100;
    accumulatedDifference += difference;
    accumulatedDifference = Math.round(accumulatedDifference * 100) / 100;
    
    // Calcular nuevo saldo
    const newBalance = Math.round((balance - capital) * 100) / 100;
    
    // Calcular fecha de pago
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    // Acumular totales
    totalInterest += interest;
    totalPayment += payment;
    totalRoundedPayment += roundedPayment;

    rows.push({
      number: i,
      initialBalance: Math.round(balance * 100) / 100,
      payment: payment,
      interest: interest,
      capital: capital,
      finalBalance: newBalance,
      paymentDate: paymentDate.toISOString().split('T')[0],
      isPaid: false,
      roundedPayment: roundedPayment,
      roundingDifference: difference,
      accumulatedRounding: accumulatedDifference,
    });

    balance = newBalance;
  }

  return { 
    monthlyPayment: Math.round(monthlyPayment * 100) / 100, 
    monthlyPaymentRounded: monthlyPaymentRounded,
    totalPayment: Math.round(totalPayment * 100) / 100, 
    totalRoundedPayment: Math.round(totalRoundedPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100, 
    rows 
  };
}

export function calculatePenalty(
  paymentAmount: number,
  monthlyPenaltyRate: number,
  daysLate: number
): number {
  const dailyRate = (monthlyPenaltyRate / 100) / 30;
  return Math.round(paymentAmount * dailyRate * daysLate * 100) / 100;
}

export function formatCurrency(value: number, currency: string = 'es-BO'): string {
  return new Intl.NumberFormat(currency, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
}
