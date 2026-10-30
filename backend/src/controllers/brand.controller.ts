import { Request, Response } from 'express';
import prisma from '../config/database';
import { brandConfigSchema } from '../utils/validators';

export const getBrandConfig = async (req: any, res: Response) => {
  try {
    const brandConfig = await prisma.brandConfig.findUnique({
      where: { userId: req.userId },
    });

    if (!brandConfig) {
      // Retornar configuración por defecto si no existe
      return res.json({
        appName: 'Sistema de Préstamos',
        tagline: 'Gestión completa de amortización',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        logoUrl: '',
        contactEmail: '',
        contactPhone: '',
        company: '',
      });
    }

    res.json(brandConfig);
  } catch (error) {
    console.error('Error getting brand config:', error);
    res.status(500).json({ error: 'Failed to get brand config' });
  }
};

export const updateBrandConfig = async (req: any, res: Response) => {
  try {
    const validatedData = brandConfigSchema.parse(req.body);

    // Verificar si ya existe configuración
    const existingConfig = await prisma.brandConfig.findUnique({
      where: { userId: req.userId },
    });

    let brandConfig;

    if (existingConfig) {
      // Actualizar configuración existente
      brandConfig = await prisma.brandConfig.update({
        where: { userId: req.userId },
        data: validatedData,
      });
    } else {
      // Crear nueva configuración
      brandConfig = await prisma.brandConfig.create({
         {
          ...validatedData,
          userId: req.userId,
        },
      });
    }

    res.json(brandConfig);
  } catch (error) {
    console.error('Error updating brand config:', error);
    res.status(400).json({ error: 'Failed to update brand config' });
  }
};

export const deleteBrandConfig = async (req: any, res: Response) => {
  try {
    const brandConfig = await prisma.brandConfig.findUnique({
      where: { userId: req.userId },
    });

    if (!brandConfig) {
      return res.status(404).json({ error: 'Brand config not found' });
    }

    await prisma.brandConfig.delete({
      where: { userId: req.userId },
    });

    res.json({ message: 'Brand config deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand config:', error);
    res.status(500).json({ error: 'Failed to delete brand config' });
  }
};
