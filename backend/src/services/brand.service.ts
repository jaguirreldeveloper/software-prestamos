import prisma from '../config/database';

interface BrandConfigData {
  appName: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  company?: string;
}

export class BrandService {
  // Obtener configuración de marca
  static async getBrandConfig(userId: string) {
    const brandConfig = await prisma.brandConfig.findUnique({
      where: { userId },
    });

    if (!brandConfig) {
      // Retornar configuración por defecto si no existe
      return {
        appName: 'Sistema de Préstamos',
        tagline: 'Gestión completa de amortización',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        logoUrl: '',
        contactEmail: '',
        contactPhone: '',
        company: '',
      };
    }

    return brandConfig;
  }

  // Actualizar o crear configuración de marca
  static async updateBrandConfig(userId: string, data: BrandConfigData) {
    // Verificar si ya existe configuración
    const existingConfig = await prisma.brandConfig.findUnique({
      where: { userId },
    });

    let brandConfig;

    if (existingConfig) {
      // Actualizar configuración existente
      brandConfig = await prisma.brandConfig.update({
        where: { userId },
        data,
      });
    } else {
      // Crear nueva configuración
      brandConfig = await prisma.brandConfig.create({
         {
          ...data,
          userId,
        },
      });
    }

    return brandConfig;
  }

  // Eliminar configuración de marca
  static async deleteBrandConfig(userId: string) {
    const brandConfig = await prisma.brandConfig.findUnique({
      where: { userId },
    });

    if (!brandConfig) {
      throw new Error('Brand config not found');
    }

    await prisma.brandConfig.delete({
      where: { userId },
    });

    return { message: 'Brand config deleted successfully' };
  }

  // Validar colores
  static validateColor(color: string): boolean {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    return hexRegex.test(color);
  }

  // Aplicar configuración de marca a respuesta
  static applyBrandConfig(config: any) {
    return {
      ...config,
      styles: {
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
      },
    };
  }
}
