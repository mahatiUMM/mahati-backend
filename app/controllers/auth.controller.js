import bcryptjs from "bcryptjs";
import { prisma } from "../lib/dbConnect.js";
import { generateToken, verifyToken } from "../lib/tokenHandler.js";
import { createHash } from "crypto";

export * as authController from "./auth.controller.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUsers = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUsers) {
      return res.status(400).json({
        status: 400,
        message: "Email address is already in use.",
      });
    } else {
      const saltRounds = 12;
      const hashPassword = await bcryptjs.hash(password, saltRounds);

      const users = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          points: 0,
          role: "USER",
        },
      });
      res.status(201).json({ success: true, data: users });
    }
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(422).json({
        status: 422,
        message: "Incorrect password!",
      });
    }

    const access_token = generateToken({ id: user.id });
    const refresh_token = generateToken({ id: user.id }, false);
    const md5Refresh = createHash("md5").update(refresh_token).digest("hex");

    // Check if a refresh token already exists for the user
    const existingRefreshToken = await prisma.refreshToken.findUnique({
      where: { user_id: user.id },
    });

    if (existingRefreshToken) {
      // Update existing refresh token
      const updatedRefreshToken = await prisma.refreshToken.update({
        where: { user_id: user.id },
        data: { token: md5Refresh },
      });

      res.json({
        status: 200,
        access_token,
        refresh_token: updatedRefreshToken.token,
      });
    } else {
      // Create new refresh token
      const createdRefreshToken = await prisma.refreshToken.create({
        data: {
          token: md5Refresh,
          user: { connect: { id: user.id } },
        },
      });

      res.json({
        status: 200,
        access_token,
        refresh_token: createdRefreshToken.token,
      });
    }
  } catch (error) {
    next(error);
  }
};
