import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'manager', 'operator', 'viewer']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const loanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  amount: z.number().positive('Amount must be positive'),
  monthlyRate: z.number().min(0, 'Rate cannot be negative'),
  term: z.number().int().positive('Term must be positive'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  loanId: z.string().uuid('Invalid loan ID'),
  installmentNumber: z.number().int().positive('Invalid installment number'),
  amount: z.number().positive('Amount must be positive'),
  paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  notes: z.string().optional(),
});

export const guarantorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  ci: z.string().min(5, 'CI must be at least 5 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  income: z.number().positive('Income must be positive'),
  existingGuarantees: z.number().int().min(0).optional(),
});

export const brandConfigSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  tagline: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  logoUrl: z.string().url('Invalid URL').optional(),
  contactEmail: z.string().email('Invalid email').optional(),
  contactPhone: z.string().optional(),
  company: z.string().optional(),
});
