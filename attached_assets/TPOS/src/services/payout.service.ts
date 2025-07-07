import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findAll = () => prisma.payout.findMany();

export const findById = (id: number) => prisma.payout.findUnique({ where: { id } });

export const create = (data: any) => prisma.payout.create({ data });

export const update = (id: number, data: any) =>
  prisma.payout.update({ where: { id }, data }).catch(() => null);

export const remove = (id: number) =>
  prisma.payout.delete({ where: { id } }).catch(() => null);
