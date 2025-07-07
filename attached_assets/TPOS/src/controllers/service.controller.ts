import { Request, Response } from 'express';
import * as serviceService from '../services/service.service';

export const getAllServices = async (_req: Request, res: Response) => {
  const services = await serviceService.findAll();
  res.json(services);
};

export const getServiceById = async (req: Request, res: Response) => {
  const service = await serviceService.findById(Number(req.params.id));
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
};

export const createService = async (req: Request, res: Response) => {
  const newService = await serviceService.create(req.body);
  res.status(201).json(newService);
};

export const updateService = async (req: Request, res: Response) => {
  const updated = await serviceService.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Service not found' });
  res.json(updated);
};

export const deleteService = async (req: Request, res: Response) => {
  const deleted = await serviceService.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Service not found' });
  res.status(204).send();
};