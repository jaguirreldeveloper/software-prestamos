import { Request, Response } from 'express';
import paypal from '@paypal/checkout-server-sdk';
import { config } from '../config/env';

// Configurar entorno de PayPal
const environment = config.paypal.mode === 'live'
  ? new paypal.core.LiveEnvironment(config.paypal.clientId, config.paypal.clientSecret)
  : new paypal.core.SandboxEnvironment(config.paypal.clientId, config.paypal.clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'USD', loanId, installmentNumber } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        custom_id: loanId,
        description: `Pago de cuota #${installmentNumber}`,
      }],
    });

    const order = await client.execute(request);

    res.json({
      orderId: order.result.id,
      status: order.result.status,
      links: order.result.links,
    });
  } catch (error) {
    console.error('PayPal error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);

    if (capture.result.status === 'COMPLETED') {
      // Aquí puedes guardar el pago en la base de datos
      res.json({
        success: true,
        capture: capture.result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }
  } catch (error) {
    console.error('PayPal error:', error);
    res.status(500).json({ error: 'Failed to capture order' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const webhookEvent = req.body;

    // Verificar el webhook (en producción debes verificar la firma)
    console.log('PayPal webhook received:', webhookEvent.event_type);

    // Manejar diferentes tipos de eventos
    switch (webhookEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        const capture = webhookEvent.resource;
        console.log('Payment captured:', capture.id);
        // Aquí puedes actualizar el estado del pago en la base de datos
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        const deniedCapture = webhookEvent.resource;
        console.log('Payment denied:', deniedCapture.id);
        // Manejar pago denegado
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        const refund = webhookEvent.resource;
        console.log('Payment refunded:', refund.id);
        // Manejar reembolso
        break;

      default:
        console.log(`Unhandled event type: ${webhookEvent.event_type}`);
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    // PayPal no tiene un endpoint directo para listar transacciones
    // Necesitas mantener tu propio registro en la base de datos
    res.json({
      message: 'Use database to track transactions',
      note: 'PayPal does not provide a direct API to list all transactions',
    });
  } catch (error) {
    console.error('PayPal error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};
