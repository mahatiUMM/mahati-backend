import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

export const getUserDashboard = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    const currentDate = new Date();

    if (data?.status) return res.status(data.status).json(data);

    const recent_blood_pressure = await prisma.blood_pressures.findFirst({
      where: { user_id: data.id },
      orderBy: { created_at: "desc" }, // Adjust 'createdAt' to your timestamp column name
    });

    const lower_medicine = await prisma.reminders.findMany({
      where: {
        medicine_total: {
          lte: 3,
        },
        user_id: data.id,
      },
    });

    const reminders = await prisma.reminders.findMany({
      include: {
        schedules: true,
      },
      where: {
        user_id: data.id,
      },
    });

    const filteredReminders = reminders.filter((reminder) =>
      reminder.schedules.some((schedule) => {
        const scheduleDate = new Date(schedule.time);

        return (
          scheduleDate.getFullYear() === currentDate.getFullYear() &&
          scheduleDate.getMonth() === currentDate.getMonth() &&
          scheduleDate.getDate() === currentDate.getDate()
        );
      })
    );

    res.json({
      success: true,
      data: {
        remaining_reminder: reminders.length - filteredReminders.length,
        lower_medicine,
        recent_blood_pressure,
      },
    });
  } catch (error) {
    next(error);
  }
}

export * as userDashboardController from "./userDashboard.controller.js";