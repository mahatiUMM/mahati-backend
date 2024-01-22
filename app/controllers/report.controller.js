import { prisma } from "../lib/dbConnect.js";

export * as reportController from "./report.controller.js";

export const getReport = async (req, res, next) => {
  try {
    const report = await prisma.report.findMany();
    res.json({
      status: 200,
      data: report,
    });
  } catch (error) {
    throw new error(`Error: ${error}`);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { email, subject, location, user_id } = req.body;

    // Use Prisma to create the report
    const createdReport = await prisma.report.create({
      data: {
        email,
        subject,
        location,
        user: {
          connect: { id: user_id },
        },
      },
    });

    res.status(201).json({
      status: 201,
      data: createdReport,
    });
  } catch (error) {
    next(error);
  }
};
