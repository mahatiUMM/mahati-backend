import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

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
};

export const getAllReminders = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminders = await prisma.reminders.findMany({
      include: {
        schedules: true,
      },
      where: { user_id: data.id },
    });

    res.json({ success: true, data: reminders });
  } catch (error) {
    next(error);
  }
};

export const getReminderById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);

    const reminder = await prisma.reminders.findUnique({
      where: { id: reminderId, user_id: data.id },
      include: {
        schedules: true,
      },
    });

    if (!reminder) {
      return res.status(404).json({
        status: 404,
        message: "Reminder not found.",
      });
    }

    res.json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);
    const {
      user_id,
      medicine_name,
      medicine_taken,
      amount,
      cause,
      cap_size,
      medicine_time,
    } = req.body;

    if (amount - medicine_taken < 0) {
      return res.status(400).json({
        success: false,
        message: `Obat Tidak boleh kosong, mohon isi ulang obat ${medicine_name}`,
      });
    }

    const updatedReminder = await prisma.reminders.update({
      where: { id: reminderId, user_id: data.id },
      data: {
        user_id,
        medicine_name,
        medicine_taken,
        medicine_total: amount - medicine_taken,
        amount,
        cause,
        cap_size,
        medicine_time,
      },
      include: {
        schedules: true,
      },
    });

    res.json({ success: true, data: updatedReminder });
  } catch (error) {
    next(error);
  }
};

export const acceptReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);
    const date = new Date();

    const currentReminder = await prisma.reminders.findUnique({
      where: { id: reminderId, user_id: data.id },
    });

    if (!currentReminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    const newMedicineTaken = currentReminder.medicine_taken + 1;

    if (currentReminder.amount - newMedicineTaken < 0) {
      return res.status(400).json({
        success: false,
        message: `Obat Habis, mohon isi ulang obat ${currentReminder.medicine_name}`,
      });
    }

    const updatedReminder = await prisma.reminders.update({
      where: { id: reminderId },
      data: {
        medicine_taken: newMedicineTaken,
        medicine_total: currentReminder.amount - newMedicineTaken,
        updated_at: date,
      },
      include: {
        schedules: true,
      },
    });

    const createSchedules = await prisma.schedules.create({
      data: {
        reminder_id: reminderId,
        status: 0,
        time: date,
      },
    });

    res.json({ success: true, data: { updatedReminder, createSchedules } });
  } catch (error) {
    next(error);
  }
};

export const deleteReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminderId = parseInt(req.params.id);

    const deletedReminder = await prisma.reminders.delete({
      where: { id: reminderId, user_id: data.id },
    });

    res.json({ success: true, data: { deletedReminder } });
  } catch (error) {
    next(error);
  }
};

export * as userReminderController from "./reminder.controller.js";
