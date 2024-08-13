import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const createReminder = async (req, res, next) => {
  try {
    const {
      user_id,
      medicine_name,
      medicine_taken,
      medicine_total,
      amount,
      cause,
      cap_size,
      medicine_time,
    } = req.body;

    if (
      !user_id ||
      !medicine_name ||
      !medicine_taken ||
      !medicine_total ||
      !amount ||
      !cause ||
      !cap_size ||
      !medicine_time
    ) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      });
    }

    const newReminder = await prisma.reminders.create({
      data: {
        user_id,
        medicine_name,
        medicine_taken,
        medicine_total,
        amount,
        cause,
        cap_size,
        medicine_time,
      },
    });

    res.status(201).json({ success: true, data: newReminder });
  } catch (error) {
    next(error);
  }
}

export const getAllReminders = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const reminders = await prisma.reminders.findMany({
        include: {
          schedules: true,
        },
      });

      res.json({ success: true, data: reminders });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const getReminderById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const reminder = await prisma.reminders.findUnique({
        where: { id: reminderId },
        include: {
          schedules: true,
        },
      });

      res.json({ success: true, data: reminder });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const updateReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);
    const {
      user_id,
      medicine_name,
      medicine_taken,
      medicine_total,
      amount,
      cause,
      cap_size,
      medicine_time,
    } = req.body;

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const reminder = await prisma.reminders.update({
        where: { id: reminderId },
        data: {
          user_id,
          medicine_name,
          medicine_taken,
          medicine_total,
          amount,
          cause,
          cap_size,
          medicine_time,
        },
      });

      res.json({ success: true, data: reminder });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const deleteReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      await prisma.reminders.delete({
        where: { id: reminderId },
      });

      res.json({ success: true, message: "Reminder deleted successfully." });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}
export * as adminReminderController from "./reminder.controller.js";