import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const createBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { video_id } = req.body;

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const { user_id } = req.body;
      const bookmarkAdmin = await prisma.bookmarks.create({
        data: {
          video_id: parseInt(video_id),
          user_id: parseInt(user_id),
        },
      });
      return res.json({ success: true, data: bookmarkAdmin });
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

export const getAllBookmarks = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bookmarksAdmin = await prisma.bookmarks.findMany();
      return res.json({ success: true, data: bookmarksAdmin });
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

export const getBookmarkById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarkId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bookmarkAdmin = await prisma.bookmarks.findFirst({
        where: { id: bookmarkId },
      });
      return res.json({ success: true, data: bookmarkAdmin });
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

export const updateBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarkId = parseInt(req.params.id);
    const { video_id } = req.body;

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bookmarkAdmin = await prisma.bookmarks.update({
        where: { id: bookmarkId },
        data: {
          video_id: parseInt(video_id),
        },
      });
      return res.json({ success: true, data: bookmarkAdmin });
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

export const deleteBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarkId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const bookmarkAdmin = await prisma.bookmarks.delete({
        where: { id: bookmarkId },
      });
      return res.json({ success: true, data: bookmarkAdmin });
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

export * as adminBookmarkController from "./bookmark.controller.js";