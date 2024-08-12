import bcryptjs from "bcryptjs";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/dbConnect.js";
import { generateToken, verifyToken } from "../../lib/tokenHandler.js";
import { createHash } from "crypto";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, number, photo } = req.body;

    const existingUsers = await prisma.users.findFirst({
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

      const users = await prisma.users.create({
        data: {
          username,
          email,
          password: hashPassword,
          number,
          photo,
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

    // Fetch user by email
    const user = await prisma.users.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Pengguna tidak ditemukan",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(422).json({
        status: 422,
        message: "Password salah!",
      });
    } else {
      const access_token = generateToken({ id: user.id });
      const refresh_token = generateToken({ id: user.id }, false);
      const md5Refresh = createHash("md5").update(refresh_token).digest("hex");

      const existingRefreshToken = await prisma.refresh_tokens.findUnique({
        where: { user_id: user.id },
      });
      if (existingRefreshToken) {
        // Update existing refresh token
        const updatedRefreshToken = await prisma.refresh_tokens.update({
          where: { user_id: user.id },
          data: { token: md5Refresh },
        });

        res.json({
          status: 200,
          user_id: user.id,
          access_token,
          refresh_token: refresh_token,
          refresh_token_md5: updatedRefreshToken.token,
        });
      } else {
        // Create new refresh token
        const createdRefreshToken = await prisma.refresh_tokens.create({
          data: {
            token: md5Refresh,
            user: { connect: { id: user.id } },
          },
        });

        res.json({
          status: 200,
          user_id: user.id,
          access_token,
          refresh_token: refresh_token,
          refresh_token_md5: createdRefreshToken.token,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers.refresh_token;
    // Verify the refresh token
    const data = verifyToken(refreshToken, false);
    if (data?.status) return res.status(data.status).json(data);

    const md5Refresh = createHash("md5").update(refreshToken).digest("hex");
    // Find the refresh token in the database
    const refreshTokenRecord = await prisma.refresh_tokens.findFirst({
      where: {
        token: md5Refresh,
      },
    });

    if (!refreshTokenRecord) {
      return res.json({
        status: 401,
        message: "Unauthorized: Invalid Refresh Token.",
      });
    }

    // Generating new access and refresh token
    const access_token = generateToken({ id: data.id });
    const refresh_token = generateToken({ id: data.id }, false);

    const md5RefreshUpdate = createHash("md5")
      .update(refresh_token)
      .digest("hex");

    // Update the refresh token in the database
    await prisma.refresh_tokens.update({
      where: {
        user_id: refreshTokenRecord.user_id,
      },
      data: {
        token: md5RefreshUpdate,
      },
    });

    res.json({
      status: 200,
      access_token,
      refresh_token,
    });
  } catch (err) {
    next(err);
  }
};

export * as userAuthController from "./auth.controller.js";
