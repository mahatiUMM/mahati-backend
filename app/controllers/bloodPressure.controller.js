import { prisma } from "../lib/dbConnect.js";
export * as bloodPressureController from "./bloodPressure.controller.js";
import { verifyToken } from "../lib/tokenHandler.js";

// Create blood pressure record
export const createBloodPressure = async (req, res, next) => {
  try {
    const { sistol, diastole, heartbeat } = req.body;

    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file." });
    }

    const image = req.file ? req.file.path : "";

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
};

// Get all blood pressure records
export const getAllBloodPressures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressures = await prisma.blood_pressures.findMany({
      where: { user_id: data.id },
    });

    res.json({ success: true, data: bloodPressures });
  } catch (error) {
    next(error);
  }
};

// Get blood pressure record by ID
export const getBloodPressureById = async (req, res, next) => {
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
};

// Update blood pressure record by ID
export const updateBloodPressure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressureId = parseInt(req.params.id);
    const { user_id, image, sistol, diastole, heartbeat } = req.body;

    const updatedBloodPressure = await prisma.blood_pressures.update({
      where: { id: bloodPressureId, user_id: data.id },
      data: {
        user_id,
        image,
        sistol,
        diastole,
        heartbeat,
      },
    });

    res.json({ success: true, data: updatedBloodPressure });
  } catch (error) {
    next(error);
  }
};

// Delete blood pressure record by ID
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
};

// Create blood pressure record for admin
export const createBloodPressureAdmin = async (req, res, next) => {
  try {
    const { user_id, sistol, diastole, heartbeat } = req.body;

    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const image = req.file ? req.file.path : "";

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to access this route.",
      });
    }

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
  } catch (error) {
    next(error);
  }
}

// Get all blood pressure records for admin
export const getAllBloodPressuresAdmin = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to access this route.",
      });
    }

    const bloodPressures = await prisma.blood_pressures.findMany();

    res.json({ success: true, data: bloodPressures });
  } catch (error) {
    next(error);
  }
};

// Get blood pressure record by ID for admin
export const getBloodPressureByIdAdmin = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to access this route.",
      });
    }

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
  } catch (error) {
    next(error);
  }
};

// Update blood pressure record by ID for admin
export const updateBloodPressureAdmin = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { user_id, sistol, diastole, heartbeat } = req.body;
    const image = req.file ? req.file.path : "";
    const bloodPressureId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to access this route.",
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
  } catch (error) {
    next(error);
  }
}

// Delete blood pressure record by ID for admin
export const deleteBloodPressureAdmin = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bloodPressureId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to access this route.",
      });
    }

    const deletedBloodPressure = await prisma.blood_pressures.delete({
      where: { id: bloodPressureId },
    });

    res.json({ success: true, data: deletedBloodPressure });
  } catch (error) {
    next(error);
  }
}