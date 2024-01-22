import { prisma } from "../lib/dbConnect.js";

export * as eventController from "./event.controller.js";

export const getEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.findMany();
    res.json({
      status: 200,
      data: event,
    });
  } catch (error) {
    throw new error(`Error: ${error}`);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, path_image, user_id } = req.body;

    const createdEvent = await prisma.event.create({
      data: {
        title,
        description,
        path_image,
        user: {
          connect: { id: user_id },
        },
      },
    });

    res.status(201).json({
      status: 201,
      data: createdEvent,
    });
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};
