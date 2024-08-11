import { prisma } from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export * as userController from "./user.controller.js";

export const getUser = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { id, username, email, number, photo } = req.body;

    if (!id || !username || !email || !number) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      });
    }

    const user = await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        username,
        email,
        number,
        photo,
      },
    });

    res.json({
      status: 200,
      user,
    });
  } catch (err) {
    next(err);
  }
};