import { Router } from 'express';
import { createPayment, getPayments, getPayment, deletePayment } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear pago
router.post('/', createPayment);

// Obtener todos los pagos del usuario (opcionalmente filtrar por loanId)
router.get('/', getPayments);

// Obtener un pago específico
router.get('/:id', getPayment);

// Eliminar pago
router.delete('/:id', deletePayment);

export default router;
