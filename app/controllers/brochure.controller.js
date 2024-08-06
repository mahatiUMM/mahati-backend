import { prisma } from "../lib/dbConnect.js";
export * as brochureController from "./brochure.controller.js";
import { verifyToken } from "../lib/tokenHandler.js";
import { removeFile } from "../lib/multerStorage.js";

// Create brochure
export const createBrochure = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!req.files) {
      return res.status(400).json({ message: "Please upload an image file." });
    }

    const images = req.files ? req.files.map((file) => file.path) : [];

    const newBrochure = await prisma.brochures.create({
      data: {
        title,
        images: {
          create: images.map((imagePath) => ({ imagePath })),
        },
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({ success: true, data: newBrochure });
  } catch (error) {
    next(error);
  }
};

// Get all brochures
export const getAllBrochures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const brochures = await prisma.brochures.findMany({
      include: {
        images: true,
      },
    });

    res.json({ success: true, data: brochures });
  } catch (error) {
    next(error);
  }
};

// Get brochure by ID
export const getBrochureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const brochureId = parseInt(req.params.id);

    const brochure = await prisma.brochures.findUnique({
      where: { id: brochureId },
    });

    if (!brochure) {
      return res.status(404).json({
        status: 404,
        message: "Brochure not found.",
      });
    }

    res.json({ success: true, data: brochure });
  } catch (error) {
    next(error);
  }
};

// Update brochure by ID
export const updateBrochure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const brochureId = parseInt(req.params.id);
    const { title, image } = req.body;

    const updatedBrochure = await prisma.brochures.update({
      where: { id: brochureId },
      data: {
        title,
        image,
        updated_at: new Date(),
      },
    });

    res.json({ success: true, data: updatedBrochure });
  } catch (error) {
    next(error);
  }
};

// Delete brochure by ID
export const deleteBrochure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const brochureId = parseInt(req.params.id);

    const brochure = await prisma.brochures.findUnique({
      where: { id: brochureId },
      include: {
        images: true,
      },
    })

    if (!brochure) {
      return res.status(404).json({
        status: 404,
        message: "Brochure not found.",
      })
    };

    if (brochure.images.length > 0) {
      try {
        brochure.images.forEach((image) => {
          removeFile(image.imagePath);
        });
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: "Failed to delete brochure images.",
        });
      }
    };

    const deletedBrochure = await prisma.brochures.delete({
      where: { id: brochureId },
    });

    res.json({ success: true, data: deletedBrochure });
  } catch (error) {
    next(error);
  }
};
