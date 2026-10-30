import { Request, Response } from 'express';
import prisma from '../config/database';
import { loanSchema } from '../utils/validators';

export const createLoan = async (req: any, res: Response) => {
  try {
    const validatedData = loanSchema.parse(req.body);
    
    const loan = await prisma.loan.create({
       {
        ...validatedData,
        userId: req.userId,
        startDate: new Date(validatedData.startDate),
      },
      include: {
        installments: true,
      },
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(400).json({ error: 'Failed to create loan' });
  }
};

export const getLoans = async (req: any, res: Response) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.userId },
      include: {
        installments: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(loans);
  } catch (error) {
    console.error('Error getting loans:', error);
    res.status(500).json({ error: 'Failed to get loans' });
  }
};

export const getLoan = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loan.findFirst({
      where: { id, userId: req.userId },
      include: {
        installments: {
          orderBy: { number: 'asc' },
        },
        payments: {
          orderBy: { paidDate: 'desc' },
        },
      },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan);
  } catch (error) {
    console.error('Error getting loan:', error);
    res.status(500).json({ error: 'Failed to get loan' });
  }
};

export const updateLoan = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = loanSchema.partial().parse(req.body);

    const loan = await prisma.loan.findFirst({
      where: { id, userId: req.userId },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const updatedLoan = await prisma.loan.update({
      where: { id },
       {
        ...validatedData,
        ...(validatedData.startDate && { startDate: new Date(validatedData.startDate) }),
      },
      include: {
        installments: true,
      },
    });

    res.json(updatedLoan);
  } catch (error) {
    console.error('Error updating loan:', error);
    res.status(400).json({ error: 'Failed to update loan' });
  }
};

export const deleteLoan = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loan.findFirst({
      where: { id, userId: req.userId },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await prisma.loan.delete({
      where: { id },
    });

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({ error: 'Failed to delete loan' });
  }
};

export const duplicateLoan = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const originalLoan = await prisma.loan.findFirst({
      where: { id, userId: req.userId },
      include: { installments: true },
    });

    if (!originalLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const duplicatedLoan = await prisma.loan.create({
       {
        userId: req.userId,
        name: `${originalLoan.name} (Copia)`,
        clientName: originalLoan.clientName,
        amount: originalLoan.amount,
        monthlyRate: originalLoan.monthlyRate,
        term: originalLoan.term,
        startDate: originalLoan.startDate,
        status: 'active',
        notes: originalLoan.notes,
      },
      include: {
        installments: true,
      },
    });

    res.status(201).json(duplicatedLoan);
  } catch (error) {
    console.error('Error duplicating loan:', error);
    res.status(500).json({ error: 'Failed to duplicate loan' });
  }
};
