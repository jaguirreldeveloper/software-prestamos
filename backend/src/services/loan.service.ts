import prisma from '../config/database';

interface LoanData {
  name: string;
  clientName: string;
  amount: number;
  monthlyRate: number;
  term: number;
  startDate: Date;
  status?: string;
  notes?: string;
}

export class LoanService {
  // Calcular tabla de amortización
  static calculateAmortization(amount: number, monthlyRate: number, term: number, startDate: Date) {
    const rate = monthlyRate / 100;
    const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const monthlyPaymentRounded = Math.ceil(monthlyPayment);
    
    const installments = [];
    let balance = amount;
    let totalInterest = 0;
    let totalPayment = 0;
    let accumulatedDifference = 0;

    for (let i = 1; i <= term; i++) {
      const interest = Math.round(balance * rate * 100) / 100;
      let capital: number;
      let payment: number;
      let roundedPayment: number;
      
      if (i === term) {
        capital = Math.round(balance * 100) / 100;
        payment = Math.round((capital + interest) * 100) / 100;
        roundedPayment = Math.round((payment - accumulatedDifference) * 100) / 100;
      } else {
        capital = Math.round((monthlyPayment - interest) * 100) / 100;
        payment = Math.round(monthlyPayment * 100) / 100;
        roundedPayment = monthlyPaymentRounded;
      }
      
      const difference = Math.round((roundedPayment - payment) * 100) / 100;
      accumulatedDifference += difference;
      accumulatedDifference = Math.round(accumulatedDifference * 100) / 100;
      
      const newBalance = Math.round((balance - capital) * 100) / 100;
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      totalInterest += interest;
      totalPayment += payment;

      installments.push({
        number: i,
        initialBalance: Math.round(balance * 100) / 100,
        payment: payment,
        interest: interest,
        capital: capital,
        finalBalance: newBalance,
        paymentDate: paymentDate,
        isPaid: false,
        roundedPayment: roundedPayment,
        roundingDifference: difference,
      });

      balance = newBalance;
    }

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      monthlyPaymentRounded: monthlyPaymentRounded,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      installments,
    };
  }

  // Crear préstamo con cuotas
  static async createLoanWithInstallments(userId: string, loanData: LoanData) {
    const amortization = this.calculateAmortization(
      loanData.amount,
      loanData.monthlyRate,
      loanData.term,
      loanData.startDate
    );

    // Crear el préstamo
    const loan = await prisma.loan.create({
       {
        userId,
        name: loanData.name,
        clientName: loanData.clientName,
        amount: loanData.amount,
        monthlyRate: loanData.monthlyRate,
        term: loanData.term,
        startDate: loanData.startDate,
        status: loanData.status || 'active',
        notes: loanData.notes,
      },
    });

    // Crear las cuotas
    const installments = await Promise.all(
      amortization.installments.map(installment =>
        prisma.installment.create({
           {
            loanId: loan.id,
            number: installment.number,
            initialBalance: installment.initialBalance,
            payment: installment.payment,
            interest: installment.interest,
            capital: installment.capital,
            finalBalance: installment.finalBalance,
            paymentDate: installment.paymentDate,
            isPaid: installment.isPaid,
            roundedPayment: installment.roundedPayment,
            roundingDifference: installment.roundingDifference,
          },
        })
      )
    );

    return {
      ...loan,
      installments,
      summary: {
        monthlyPayment: amortization.monthlyPayment,
        monthlyPaymentRounded: amortization.monthlyPaymentRounded,
        totalPayment: amortization.totalPayment,
        totalInterest: amortization.totalInterest,
      },
    };
  }

  // Obtener préstamos del usuario
  static async getUserLoans(userId: string) {
    return await prisma.loan.findMany({
      where: { userId },
      include: {
        installments: {
          orderBy: { number: 'asc' },
        },
        payments: {
          orderBy: { paidDate: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtener un préstamo específico
  static async getLoanById(loanId: string, userId: string) {
    return await prisma.loan.findFirst({
      where: { id: loanId, userId },
      include: {
        installments: {
          orderBy: { number: 'asc' },
        },
        payments: {
          orderBy: { paidDate: 'desc' },
        },
      },
    });
  }

  // Actualizar préstamo
  static async updateLoan(loanId: string, userId: string, data: Partial<LoanData>) {
    return await prisma.loan.update({
      where: { id: loanId, userId },
       {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
      },
    });
  }

  // Eliminar préstamo
  static async deleteLoan(loanId: string, userId: string) {
    return await prisma.loan.delete({
      where: { id: loanId, userId },
    });
  }

  // Duplicar préstamo
  static async duplicateLoan(loanId: string, userId: string) {
    const originalLoan = await prisma.loan.findFirst({
      where: { id: loanId, userId },
      include: { installments: true },
    });

    if (!originalLoan) {
      throw new Error('Loan not found');
    }

    return await this.createLoanWithInstallments(userId, {
      name: `${originalLoan.name} (Copia)`,
      clientName: originalLoan.clientName,
      amount: originalLoan.amount.toNumber(),
      monthlyRate: originalLoan.monthlyRate.toNumber(),
      term: originalLoan.term,
      startDate: originalLoan.startDate,
      status: 'active',
      notes: originalLoan.notes,
    });
  }
}
