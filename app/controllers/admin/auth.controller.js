import bcrypt from "bcrypt";
import { prisma } from "../../lib/dbConnect.js";
import { generateToken } from "../../lib/tokenHandler.js";
import { createHash } from "crypto";

export const signInAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findFirst({
      where: { email: email, isAdmin: true },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
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
  } catch (error) {
    next(error);
  }
};

export * as adminAuthController from "./auth.controller.js";