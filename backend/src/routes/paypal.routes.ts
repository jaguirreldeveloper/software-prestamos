import { Router } from 'express';
import { createOrderController, captureOrderController, webhookHandler, getTransactionsController } from '../controllers/paypal.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Crear orden (requiere autenticación)
router.post('/create-order', authMiddleware, createOrderController);

// Capturar orden (requiere autenticación)
router.post('/capture-order', authMiddleware, captureOrderController);

// Webhook de PayPal (NO requiere autenticación, PayPal envía directamente)
router.post('/webhook', webhookHandler);

// Obtener transacciones (requiere autenticación)
router.get('/transactions', authMiddleware, getTransactionsController);

export default router;
