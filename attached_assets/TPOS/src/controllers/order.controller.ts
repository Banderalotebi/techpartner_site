import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await orderService.findAll();
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await orderService.findById(Number(req.params.id));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  const newOrder = await orderService.create(req.body);
  res.status(201).json(newOrder);
};

export const updateOrder = async (req: Request, res: Response) => {
  const updated = await orderService.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Order not found' });
  res.json(updated);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const deleted = await orderService.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Order not found' });
  res.status(204).send();
};
