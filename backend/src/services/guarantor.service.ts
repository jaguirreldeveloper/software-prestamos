import prisma from '../config/database';

interface GuarantorData {
  name: string;
  ci: string;
  phone?: string;
  email?: string;
  income: number;
  existingGuarantees?: number;
}

export class GuarantorService {
  // Crear garante
  static async createGuarantor(userId: string, guarantorData: GuarantorData) {
    return await prisma.guarantor.create({
       {
        ...guarantorData,
        userId,
      },
    });
  }

  // Obtener garantes del usuario
  static async getUserGuarantors(userId: string) {
    return await prisma.guarantor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtener un garante específico
  static async getGuarantorById(guarantorId: string, userId: string) {
    return await prisma.guarantor.findFirst({
      where: { id: guarantorId, userId },
    });
  }

  // Actualizar garante
  static async updateGuarantor(guarantorId: string, userId: string, data: Partial<GuarantorData>) {
    return await prisma.guarantor.update({
      where: { id: guarantorId, userId },
      data,
    });
  }

  // Eliminar garante
  static async deleteGuarantor(guarantorId: string, userId: string) {
    return await prisma.guarantor.delete({
      where: { id: guarantorId, userId },
    });
  }

  // Validar capacidad del garante
  static validateGuarantorCapacity(income: number, existingGuarantees: number, newLoanAmount: number) {
    // Regla: El garante no debe tener más del 30% de su ingreso comprometido
    const maxCommitment = income * 0.3;
    const currentCommitment = existingGuarantees * (newLoanAmount * 0.1); // Asumiendo 10% como cuota estimada
    
    return {
      isValid: currentCommitment + (newLoanAmount * 0.1) <= maxCommitment,
      maxCommitment,
      currentCommitment,
      availableCapacity: maxCommitment - currentCommitment,
    };
  }

  // Obtener estadísticas de garantes
  static async getGuarantorStats(userId: string) {
    const guarantors = await prisma.guarantor.findMany({
      where: { userId },
    });

    const totalGuarantors = guarantors.length;
    const totalIncome = guarantors.reduce((sum, g) => sum + g.income.toNumber(), 0);
    const avgIncome = totalGuarantors > 0 ? totalIncome / totalGuarantors : 0;
    const totalGuarantees = guarantors.reduce((sum, g) => sum + g.existingGuarantees, 0);

    return {
      totalGuarantors,
      totalIncome: Math.round(totalIncome * 100) / 100,
      avgIncome: Math.round(avgIncome * 100) / 100,
      totalGuarantees,
    };
  }
}
