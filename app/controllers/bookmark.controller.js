import { prisma } from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const createBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { video_id } = req.body;

    const existingBookmark = await prisma.bookmarks.findFirst({
      where: {
        video_id: video_id,
        user_id: data.id,
      },
    });

    if (existingBookmark) {
      return res
        .status(409)
        .json({ success: false, message: "Bookmark already exists" });
    }

    const newBookmark = await prisma.bookmarks.create({
      data: {
        video_id,
        user_id: data.id,
      },
    });

    res.status(201).json({ success: true, data: newBookmark });
  } catch (error) {
    next(error);
  }
};

export const getAllBookmarks = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (user.isAdmin) {
      const bookmarksAdmin = await prisma.bookmarks.findMany();
      return res.json({ success: true, data: bookmarksAdmin });
    } else {
      const bookmarks = await prisma.bookmarks.findMany({
        where: { user_id: data.id },
      });
      return res.json({ success: true, data: bookmarks });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const videoId = parseInt(req.params.id);

    const deletedBookmark = await prisma.bookmarks.deleteMany({
      where: {
        video_id: videoId,
        user_id: data.id,
      },
    });

    res.json({ success: true, data: deletedBookmark });
  } catch (error) {
    next(error);
  }
};

export * as bookmarkController from "./bookmark.controller.js";
