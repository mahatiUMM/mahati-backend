import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const createSchedule = async (req, res, next) => {
  try {
    const {
      reminder_id,
      time,
      status
    } = req.body;

    const reminder = await prisma.reminders.findUnique({
      where: { id: parseInt(reminder_id) },
    });

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    const newSchedule = await prisma.schedules.create({
      data: {
        reminder_id: parseInt(reminder_id),
        time,
        status
      }
    })

    res.status(201).json({ success: true, data: newSchedule });
  } catch (error) {
    next(error);
  }
}

export const getAllSchedules = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const schedules = await prisma.schedules.findMany({
        include: {
          reminder: true,
        },
      });

      res.json({ success: true, data: schedules });
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

export const getScheduleById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const scheduleId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const schedule = await prisma.schedules.findUnique({
        where: { id: scheduleId },
        include: {
          reminder: true,
        },
      });

      if (!schedule) {
        return res.status(404).json({
          status: 404,
          message: "Schedule not found.",
        });
      }

      res.json({ success: true, data: schedule });
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

export const updateSchedule = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const scheduleId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const schedule = await prisma.schedules.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return res.status(404).json({
          status: 404,
          message: "Schedule not found.",
        });
      }

      const updatedSchedule = await prisma.schedules.update({
        where: { id: scheduleId },
        data: req.body,
      });

      res.json({ success: true, data: updatedSchedule });
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

export const deleteSchedule = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const scheduleId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const schedule = await prisma.schedules.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return res.status(404).json({
          status: 404,
          message: "Schedule not found.",
        });
      }

      await prisma.schedules.delete({
        where: { id: scheduleId },
      });

      res.json({ success: true, message: "Schedule deleted successfully." });
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

export * as adminScheduleController from "./schedule.controller.js";