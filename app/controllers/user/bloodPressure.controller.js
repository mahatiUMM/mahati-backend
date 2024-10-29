import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

export const createBloodPressure = async (req, res, next) => {
  try {
    const { sistol, diastole, heartbeat } = req.body;
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const image = req.file ? req.file.path : "";

    if (parseInt(sistol) < 20 || parseInt(sistol) >= 200) {
      return res.status(400).json({
        status: 400,
        message: "Sistol value should be between 20 and 200.",
      });
    } else if (parseInt(diastole) < 20 || parseInt(diastole) >= 200) {
      return res.status(400).json({
        status: 400,
        message: "Diastole value should be between 20 and 200.",
      });
    } else if (parseInt(heartbeat) < 20 || parseInt(heartbeat) >= 200) {
      return res.status(400).json({
        status: 400,
        message: "Heartbeat value should be between 20 and 200.",
      });
    }

    const newBloodPressure = await prisma.blood_pressures.create({
      data: {
        user_id: data.id,
        image,
        sistol: parseInt(sistol),
        diastole: parseInt(diastole),
        heartbeat: parseInt(heartbeat),
      },
    });
    res.status(201).json({ success: true, data: newBloodPressure });
  } catch (error) {
    next(error);
  }
}

export const getAllBloodPressures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressures = await prisma.blood_pressures.findMany({
      where: { user_id: data.id },
    });
    return res.json({ success: true, data: bloodPressures });
  } catch (error) {
    next(error);
  }
}

export const getDetailedBloodPressureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressureId = parseInt(req.params.id);
    const bloodPressure = await prisma.blood_pressures.findUnique({
      where: { id: bloodPressureId, user_id: data.id },
    });
    if (!bloodPressure) {
      return res.status(404).json({
        status: 404,
        message: "Blood pressure record not found.",
      });
    }
    res.json({ success: true, data: bloodPressure });
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
    const bloodPressure = await prisma.blood_pressures.findUnique({
      where: { id: bloodPressureId },
    });

    if (!bloodPressure || bloodPressure.user_id !== data.id) {
      return res.status(404).json({
        status: 404,
        message: "Blood pressure record not found.",
      });
    }

    const updatedBloodPressure = await prisma.blood_pressures.update({
      where: { id: bloodPressureId, user_id: data.id },
      data: {
        image,
        sistol: parseInt(sistol),
        diastole: parseInt(diastole),
        heartbeat: parseInt(heartbeat),
      },
    });

    res.json({ success: true, data: updatedBloodPressure });
  } catch (error) {
    next(error);
  }
}

export const deleteBloodPressure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressureId = parseInt(req.params.id);
    const deletedBloodPressure = await prisma.blood_pressures.delete({
      where: { id: bloodPressureId, user_id: data.id },
    });
    res.json({ success: true, data: deletedBloodPressure });
  } catch (error) {
    next(error);
  }
}
export * as userBloodPressureController from "./bloodPressure.controller.js";