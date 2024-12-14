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

export const getBrochureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const brochureId = parseInt(req.params.id);

    const brochure = await prisma.brochures.findUnique({
      where: { id: brochureId, user_id: data.id },
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
  } catch (error) {
    next(error);
  }
}

export const updateBrochure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    const brochureId = parseInt(req.params.id);
    const brochure = await prisma.brochures.findFirst({
      where: { id: brochureId },
    });

    if (!user.isAdmin) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Access is denied due to invalid credentials.",
      });
    } {
      if (!brochure) {
        return res.status(404).json({
          status: 404,
          message: "Brochure not found.",
        });
      }

      const { title } = req.body;
      const images = req.files ? req.files.map((file) => file.path) : [];

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

      res.json({ success: true, data: updatedBrochure });
    }
  } catch (error) {
    next(error);
  }
}

export const deleteBrochure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    const brochureId = parseInt(req.params.id);
    const brochure = await prisma.brochures.findUnique({
      where: { id: brochureId },
    });

    if (!user.isAdmin) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Access is denied due to invalid credentials.",
      });
    } {


      if (!brochure) {
        return res.status(404).json({
          status: 404,
          message: "Brochure not found.",
        });
      }

      const deletedBrochure = await prisma.brochures.delete({
        where: { id: brochureId },
        include: {
          images: true,
        },
      });

      deletedBrochure.images.forEach((image) => {
        removeFile(image.imagePath);
      });

      res.json({ success: true, data: deletedBrochure });
    }
  } catch (error) {
    next(error);
  }
}

export * as userBrochureController from "./brochure.controller.js";