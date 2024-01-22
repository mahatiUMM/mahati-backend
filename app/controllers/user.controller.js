import { prisma } from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export * as userController from "./user.controller.js";

export const getUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);

    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      user: {
        uuid: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postPointByUserId = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.authorization);
    const { uuid, points } = req.body;

    if (!uuid || points === undefined) {
      return res.status(400).json({
        status: 400,
        message: "UUID and points must be provided in the request body.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: uuid },
      data: {
        points: points,
      },
    });

    res.json({
      status: 200,
      message: "Points updated successfully",
      user: {
        uuid: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        points: updatedUser.points,
      },
    });
  } catch (error) {
    next(error);
  }
};
