import prisma from '../config/database';

interface PaymentData {
  loanId: string;
  installmentNumber: number;
  amount: number;
  paidDate: Date;
  notes?: string;
}

export class PaymentService {
  // Registrar pago
  static async createPayment(userId: string, paymentData: PaymentData) {
    // Verificar que el préstamo existe y pertenece al usuario
    const loan = await prisma.loan.findFirst({
      where: { id: paymentData.loanId, userId },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    // Buscar la cuota correspondiente
    const installment = await prisma.installment.findFirst({
      where: {
        loanId: paymentData.loanId,
        number: paymentData.installmentNumber,
      },
    });

    if (!installment) {
      throw new Error('Installment not found');
    }

    // Crear el pago
    const payment = await prisma.payment.create({
       {
        loanId: paymentData.loanId,
        installmentId: installment.id,
        userId,
        amount: paymentData.amount,
        paidDate: paymentData.paidDate,
        notes: paymentData.notes,
      },
      include: {
        loan: true,
        installment: true,
      },
    });

    // Actualizar el estado de la cuota
    await prisma.installment.update({
      where: { id: installment.id },
       {
        isPaid: true,
        paidDate: paymentData.paidDate,
        paidAmount: paymentData.amount,
      },
    });

    return payment;
  }

  // Obtener pagos del usuario
  static async getUserPayments(userId: string, loanId?: string) {
    const where = loanId
      ? { loanId, userId }
      : { userId };

    return await prisma.payment.findMany({
      where,
      include: {
        loan: true,
        installment: true,
      },
      orderBy: { paidDate: 'desc' },
    });
  }

  // Obtener un pago específico
  static async getPaymentById(paymentId: string, userId: string) {
    return await prisma.payment.findFirst({
      where: { id: paymentId, userId },
      include: {
        loan: true,
        installment: true,
      },
    });
  }

  // Eliminar pago y revertir estado de cuota
  static async deletePayment(paymentId: string, userId: string) {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, userId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Si el pago estaba asociado a una cuota, revertir el estado
    if (payment.installmentId) {
      await prisma.installment.update({
        where: { id: payment.installmentId },
         {
          isPaid: false,
          paidDate: null,
          paidAmount: null,
        },
      });
    }

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return { message: 'Payment deleted successfully' };
  }

  // Calcular penalidades por mora
  static calculatePenalty(paymentAmount: number, monthlyPenaltyRate: number, daysLate: number) {
    const dailyRate = (monthlyPenaltyRate / 100) / 30;
    return Math.round(paymentAmount * dailyRate * daysLate * 100) / 100;
  }

  // Obtener cuotas vencidas con penalidades
  static async getOverdueInstallments(userId: string, monthlyPenaltyRate: number = 2) {
    const today = new Date();
    
    const loans = await prisma.loan.findMany({
      where: { userId, status: 'active' },
      include: {
        installments: {
          where: { isPaid: false },
          orderBy: { paymentDate: 'asc' },
        },
      },
    });

    const overdueInstallments = [];

    for (const loan of loans) {
      for (const installment of loan.installments) {
        const paymentDate = new Date(installment.paymentDate);
        
        if (paymentDate < today) {
          const diffTime = today.getTime() - paymentDate.getTime();
          const daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          const penalty = this.calculatePenalty(
            installment.payment.toNumber(),
            monthlyPenaltyRate,
            daysLate
          );

          overdueInstallments.push({
            loanId: loan.id,
            loanName: loan.name,
            clientName: loan.clientName,
            installmentNumber: installment.number,
            paymentDate: installment.paymentDate,
            daysLate,
            originalAmount: installment.payment.toNumber(),
            penaltyAmount: penalty,
            totalDue: Math.round((installment.payment.toNumber() + penalty) * 100) / 100,
          });
        }
      }
    }

    return overdueInstallments;
  }

  // Obtener estadísticas de pagos
  static async getPaymentStats(userId: string) {
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        loan: true,
      },
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
    const totalPayments = payments.length;

    const loans = await prisma.loan.findMany({
      where: { userId },
    });

    const totalExpected = loans.reduce((sum, l) => {
      return sum + (l.amount.toNumber() * (1 + (l.monthlyRate.toNumber() / 100) * l.term));
    }, 0);

    return {
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalExpected: Math.round(totalExpected * 100) / 100,
      totalPayments,
      collectionRate: totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0,
    };
  }
}
