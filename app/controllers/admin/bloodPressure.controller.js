import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const createBloodPressure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { sistol, diastole, heartbeat } = req.body;
    const image = req.file ? req.file.path : "";

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const { user_id } = req.body;
      const newBloodPressure = await prisma.blood_pressures.create({
        data: {
          user_id: parseInt(user_id),
          image,
          sistol: parseInt(sistol),
          diastole: parseInt(diastole),
          heartbeat: parseInt(heartbeat),
        },
      });
      res.status(201).json({ success: true, data: newBloodPressure });
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

export const getAllBloodPressures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bloodPressures = await prisma.blood_pressures.findMany();
      return res.json({ success: true, data: bloodPressures });
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

export const getBloodPressureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bloodPressureId = parseInt(req.params.id);
      const bloodPressure = await prisma.blood_pressures.findUnique({
        where: { id: bloodPressureId },
      });
      if (!bloodPressure) {
        return res.status(404).json({
          status: 404,
          message: "Blood pressure record not found.",
        });
      }
      res.json({ success: true, data: bloodPressure });
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

export const updateBloodPressure = async (req, res, next) => {
  try {
    const { sistol, diastole, heartbeat } = req.body;
    const bloodPressureId = parseInt(req.params.id);

    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    let image = req.file ? req.file.path : req.body.image;

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const { user_id } = req.body;
      const bloodPressure = await prisma.blood_pressures.findUnique({
        where: { id: bloodPressureId },
      });

      if (!bloodPressure) {
        return res.status(404).json({
          status: 404,
          message: "Blood pressure record not found.",
        });
      }

      const updatedBloodPressure = await prisma.blood_pressures.update({
        where: { id: bloodPressureId },
        data: {
          user_id: parseInt(user_id),
          image,
          sistol: parseInt(sistol),
          diastole: parseInt(diastole),
          heartbeat: parseInt(heartbeat),
        },
      });
      res.json({ success: true, data: updatedBloodPressure });
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

export const deleteBloodPressure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bloodPressureId = parseInt(req.params.id);
      const bloodPressure = await prisma.blood_pressures.findUnique({
        where: { id: bloodPressureId },
      });

      if (!bloodPressure) {
        return res.status(404).json({
          status: 404,
          message: "Blood pressure record not found.",
        });
      }

      await prisma.blood_pressures.delete({
        where: { id: bloodPressureId },
      });

      res.json({ success: true, message: "Blood pressure record deleted." });
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

export * as adminBloodPressureController from "./bloodPressure.controller.js";
