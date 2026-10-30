import { Router } from 'express';
import { createPayment, confirmPaymentController, webhookHandler, getTransactionsController } from '../controllers/stripe.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Crear Payment Intent (requiere autenticación)
router.post('/create-payment-intent', authMiddleware, createPayment);

// Confirmar pago (requiere autenticación)
router.post('/confirm-payment', authMiddleware, confirmPaymentController);

// Webhook de Stripe (NO requiere autenticación, Stripe envía directamente)
router.post('/webhook', webhookHandler);

// Obtener transacciones (requiere autenticación)
router.get('/transactions', authMiddleware, getTransactionsController);

export default router;
