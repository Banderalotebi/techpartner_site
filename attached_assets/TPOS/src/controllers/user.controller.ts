import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.findAll();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.findById(Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const newUser = await userService.create(req.body);
  res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const updated = await userService.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await userService.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
};