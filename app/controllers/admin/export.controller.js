import { convertJSONToXLSX } from "../../lib/convertJSONtoXLSX.js";
import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const exportAllBloodPressures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bloodPressures = await prisma.blood_pressures.findMany();
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=bloodPressureData.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(convertJSONToXLSX(bloodPressures));
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

export * as adminExportController from "./export.controller.js";