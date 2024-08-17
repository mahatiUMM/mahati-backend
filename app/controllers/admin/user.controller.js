import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const users = await prisma.users.findMany();
      res.json({ success: true, data: users });
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

export const getUser = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const userDetail = await prisma.users.findUnique({
        where: {
          id: data.id,
        },
        include: {
          questionnaire_answers: true,
          bookmarks: true,
          RefreshToken: true,
          blood_pressures: true,
          reminders: true,
          videos: true,
        }
      })

      res.json({ success: true, data: userDetail });
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

export const updateUser = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { username, email, number } = req.body;

    let photo = req.file ? req.file.path : req.body.photo;

    if (!photo) {
      if (!username || !email || !number) {
        return res.status(400).json({
          status: 400,
          message:
            "Please provide all required fields (username, email, number).",
        });
      }
    }

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const updatedUser = await prisma.users.update({
        where: {
          id: data.id,
        },
        data: {
          username,
          email,
          number,
          photo,
        },
      });

      res.json({ success: true, data: updatedUser });
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

export * as adminUserController from "./user.controller.js";