import { Request, Response } from 'express';
import prisma from '../config/database';
import { paymentSchema } from '../utils/validators';

export const createPayment = async (req: any, res: Response) => {
  try {
    const validatedData = paymentSchema.parse(req.body);

    // Verificar que el préstamo existe y pertenece al usuario
    const loan = await prisma.loan.findFirst({
      where: { id: validatedData.loanId, userId: req.userId },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Buscar la cuota correspondiente
    const installment = await prisma.installment.findFirst({
      where: {
        loanId: validatedData.loanId,
        number: validatedData.installmentNumber,
      },
    });

    if (!installment) {
      return res.status(404).json({ error: 'Installment not found' });
    }

    // Crear el pago
    const payment = await prisma.payment.create({
       {
        loanId: validatedData.loanId,
        installmentId: installment.id,
        userId: req.userId,
        amount: validatedData.amount,
        paidDate: new Date(validatedData.paidDate),
        notes: validatedData.notes,
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
        paidDate: new Date(validatedData.paidDate),
        paidAmount: validatedData.amount,
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({ error: 'Failed to create payment' });
  }
};

export const getPayments = async (req: any, res: Response) => {
  try {
    const { loanId } = req.query;

    const where = loanId
      ? { loanId: loanId as string, userId: req.userId }
      : { userId: req.userId };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        loan: true,
        installment: true,
      },
      orderBy: { paidDate: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

export const getPayment = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.userId },
      include: {
        loan: true,
        installment: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};

export const deletePayment = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.userId },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
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
      where: { id },
    });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};
