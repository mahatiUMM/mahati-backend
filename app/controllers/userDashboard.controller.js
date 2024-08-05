import { prisma } from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const getUserDashboard = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
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

    res.json({
      success: true,
      data: { lower_medicine, recent_blood_pressure },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    })

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to access this route.",
      });
    }

    const users = await prisma.users.findMany();

    res.json({ success: true, data: users })
  } catch (error) {
    next(error);
  }
}

export * as userDashboardController from "./userDashboard.controller.js";