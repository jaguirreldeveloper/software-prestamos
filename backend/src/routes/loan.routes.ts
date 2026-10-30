import { Router } from 'express';
import { createLoan, getLoans, getLoan, updateLoan, deleteLoan, duplicateLoan } from '../controllers/loan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear préstamo
router.post('/', createLoan);

// Obtener todos los préstamos del usuario
router.get('/', getLoans);

// Obtener un préstamo específico
router.get('/:id', getLoan);

// Actualizar préstamo
router.put('/:id', updateLoan);

// Eliminar préstamo
router.delete('/:id', deleteLoan);

// Duplicar préstamo
router.post('/:id/duplicate', duplicateLoan);

export default router;
