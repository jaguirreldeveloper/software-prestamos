import { Request, Response } from 'express';
import prisma from '../config/database';
import { guarantorSchema } from '../utils/validators';

export const createGuarantor = async (req: any, res: Response) => {
  try {
    const validatedData = guarantorSchema.parse(req.body);

    const guarantor = await prisma.guarantor.create({
       {
        ...validatedData,
        userId: req.userId,
      },
    });

    res.status(201).json(guarantor);
  } catch (error) {
    console.error('Error creating guarantor:', error);
    res.status(400).json({ error: 'Failed to create guarantor' });
  }
};

export const getGuarantors = async (req: any, res: Response) => {
  try {
    const guarantors = await prisma.guarantor.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(guarantors);
  } catch (error) {
    console.error('Error getting guarantors:', error);
    res.status(500).json({ error: 'Failed to get guarantors' });
  }
};

export const getGuarantor = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const guarantor = await prisma.guarantor.findFirst({
      where: { id, userId: req.userId },
    });

    if (!guarantor) {
      return res.status(404).json({ error: 'Guarantor not found' });
    }

    res.json(guarantor);
  } catch (error) {
    console.error('Error getting guarantor:', error);
    res.status(500).json({ error: 'Failed to get guarantor' });
  }
};

export const updateGuarantor = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = guarantorSchema.partial().parse(req.body);

    const guarantor = await prisma.guarantor.findFirst({
      where: { id, userId: req.userId },
    });

    if (!guarantor) {
      return res.status(404).json({ error: 'Guarantor not found' });
    }

    const updatedGuarantor = await prisma.guarantor.update({
      where: { id },
      data: validatedData,
    });

    res.json(updatedGuarantor);
  } catch (error) {
    console.error('Error updating guarantor:', error);
    res.status(400).json({ error: 'Failed to update guarantor' });
  }
};

export const deleteGuarantor = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const guarantor = await prisma.guarantor.findFirst({
      where: { id, userId: req.userId },
    });

    if (!guarantor) {
      return res.status(404).json({ error: 'Guarantor not found' });
    }

    await prisma.guarantor.delete({
      where: { id },
    });

    res.json({ message: 'Guarantor deleted successfully' });
  } catch (error) {
    console.error('Error deleting guarantor:', error);
    res.status(500).json({ error: 'Failed to delete guarantor' });
  }
};
