import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export * as exchangeTransaction from "./exchange.controller.js";

export const getExchangeTransactions = async (req, res, next) => {
  try {
    const exchangeTransactions = await prisma.exchangeTransaction.findMany({
      include: {
        items: true,
        user: true,
      },
    });

    res.json({
      status: 200,
      data: exchangeTransactions,
    });
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const getExchangeTransactionsByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const exchangeTransactions = await prisma.exchangeTransaction.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        items: true,
        user: true,
      },
    });

    res.json({
      status: 200,
      data: exchangeTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export const createExchangeTransaction = async (req, res, next) => {
  try {
    const { items_id, user_id } = req.body;

    const createdExchangeTransaction = await prisma.exchangeTransaction.create({
      data: {
        items: {
          connect: { id: items_id },
        },
        user: {
          connect: { id: user_id },
        },
      },
      include: {
        items: true,
        user: true,
      },
    });

    res.status(201).json({
      status: 201,
      data: createdExchangeTransaction,
    });
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};
