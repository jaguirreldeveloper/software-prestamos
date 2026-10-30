import { Request, Response } from 'express';
import { createPaymentIntent, confirmPayment, handleWebhook, getTransactions } from '../services/stripe.service';

export const createPayment = async (req: Request, res: Response) => {
  return createPaymentIntent(req, res);
};

export const confirmPaymentController = async (req: Request, res: Response) => {
  return confirmPayment(req, res);
};

export const webhookHandler = async (req: Request, res: Response) => {
  return handleWebhook(req, res);
};

export const getTransactionsController = async (req: Request, res: Response) => {
  return getTransactions(req, res);
};
