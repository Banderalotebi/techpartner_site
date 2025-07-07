import { Request, Response } from 'express';
import * as payoutService from '../services/payout.service';

export const getAllPayouts = async (_req: Request, res: Response) => {
  const payouts = await payoutService.findAll();
  res.json(payouts);
};

export const getPayoutById = async (req: Request, res: Response) => {
  const payout = await payoutService.findById(Number(req.params.id));
  if (!payout) return res.status(404).json({ message: 'Payout not found' });
  res.json(payout);
};

export const createPayout = async (req: Request, res: Response) => {
  const newPayout = await payoutService.create(req.body);
  res.status(201).json(newPayout);
};

export const updatePayout = async (req: Request, res: Response) => {
  const updated = await payoutService.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Payout not found' });
  res.json(updated);
};

export const deletePayout = async (req: Request, res: Response) => {
  const deleted = await payoutService.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Payout not found' });
  res.status(204).send();
};
