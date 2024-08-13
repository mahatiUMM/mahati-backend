import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { removeFile } from "../../lib/multerStorage.js";
import { getUserById } from "../../lib/userHandler.js";

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
}

export const getAllBrochures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const brochures = await prisma.brochures.findMany({
        include: {
          images: true,
        },
      });

      res.json({ success: true, data: brochures });
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

export const getBrochureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const brochureId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const brochure = await prisma.brochures.findUnique({
        where: { id: brochureId },
        include: {
          images: true,
        },
      });

      if (!brochure) {
        return res.status(404).json({
          status: 404,
          message: "Brochure not found.",
        });
      }

      res.json({ success: true, data: brochure });
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

export const updateBrochure = async (req, res, next) => {
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

    const { title } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const updatedBrochure = await prisma.brochures.update({
        where: { id: brochureId },
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

      if (updatedBrochure.images.length > 0) {
        updatedBrochure.images.forEach((image) => {
          removeFile(image.imagePath);
        });
      }

      res.json({ success: true, data: updatedBrochure });
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
    });

    if (!brochure) {
      return res.status(404).json({
        status: 404,
        message: "Brochure not found.",
      });
    }

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const deletedBrochure = await prisma.brochures.delete({
        where: { id: brochureId },
        include: {
          images: true,
        },
      });

      if (deletedBrochure.images.length > 0) {
        deletedBrochure.images.forEach((image) => {
          removeFile(image.imagePath);
        });
      }

      res.json({ success: true, data: deletedBrochure });
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

export * as adminBrochureController from "./brochure.controller.js";