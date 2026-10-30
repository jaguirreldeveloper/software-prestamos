import { Request, Response } from 'express';
import { createOrder, captureOrder, handleWebhook, getTransactions } from '../services/paypal.service';

export const createOrderController = async (req: Request, res: Response) => {
  return createOrder(req, res);
};

export const captureOrderController = async (req: Request, res: Response) => {
  return captureOrder(req, res);
};

export const webhookHandler = async (req: Request, res: Response) => {
  return handleWebhook(req, res);
};

export const getTransactionsController = async (req: Request, res: Response) => {
  return getTransactions(req, res);
};
