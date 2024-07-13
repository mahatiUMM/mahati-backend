import { convertJSONToXLSX } from "../lib/convertJSONtoXLSX.js";
import { prisma } from "../lib/dbConnect.js";
export * as exportController from "./export.controller.js";
import { verifyToken } from "../lib/tokenHandler.js";

// Export all blood pressure records
export const exportAllBloodPressures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressures = await prisma.blood_pressures.findMany({
      where: { user_id: data.id },
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bloodPressureData.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(convertJSONToXLSX(bloodPressures));
  } catch (error) {
    next(error);
  }
};

// export all reminders for a user
export const exportAllReminders = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const reminders = await prisma.reminders.findMany({
      where: { user_id: data.id },
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reminderData.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(convertJSONToXLSX(reminders));
  } catch (error) {
    next(error);
  }
};