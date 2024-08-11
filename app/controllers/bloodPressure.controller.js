import { prisma } from "../lib/dbConnect.js";
export * as bloodPressureController from "./bloodPressure.controller.js";
import { getPaginationMeta, getPaginationParams } from "../lib/pagination.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const createBloodPressure = async (req, res, next) => {
  try {
    const { sistol, diastole, heartbeat } = req.body;

    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file." });
    }

    const image = req.file ? req.file.path : "";

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

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
    }
  } catch (error) {
    next(error);
  }
};

export const getAllBloodPressures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    const { page = 1 } = req.query;
    const { skip, take } = getPaginationParams(page);

    let bloodPressures;

    if (user.isAdmin) {
      bloodPressures = await prisma.blood_pressures.findMany({
        skip,
        take,
      });

      const totalRecords = await prisma.blood_pressures.count();
      const pagination = getPaginationMeta(totalRecords, page);

      return res.json({ success: true, data: bloodPressures, pagination });
    } else {
      bloodPressures = await prisma.blood_pressures.findMany({
        where: { user_id: data.id },
        skip,
        take,
      });

      const totalRecords = await prisma.blood_pressures.count({
        where: { user_id: data.id },
      });
      const pagination = getPaginationMeta(totalRecords, page);

      return res.json({ success: true, data: bloodPressures, pagination });
    }
  } catch (error) {
    next(error);
  }
};

export const getBloodPressureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressureId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (user.isAdmin) {
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
    }

  } catch (error) {
    next(error);
  }
};

export const updateBloodPressure = async (req, res, next) => {
  try {

    const { sistol, diastole, heartbeat } = req.body;
    const bloodPressureId = parseInt(req.params.id);

    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    // if no file is uploaded, use the existing image
    let image = req.file ? req.file.path : req.body.image;

    if (user.isAdmin) {
      const { user_id } = req.body;
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
    }
  } catch (error) {
    next(error);
  }
};

export const deleteBloodPressure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressureId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (user.isAdmin) {
      const deletedBloodPressure = await prisma.blood_pressures.delete({
        where: { id: bloodPressureId },
      });
      res.json({ success: true, data: deletedBloodPressure });
    } else {
      const deletedBloodPressure = await prisma.blood_pressures.delete({
        where: { id: bloodPressureId, user_id: data.id },
      });
      res.json({ success: true, data: deletedBloodPressure });
    }
  } catch (error) {
    next(error);
  }
};