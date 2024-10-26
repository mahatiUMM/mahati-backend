import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

export const createBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { video_id } = req.body;
    const bookmarkExists = await prisma.bookmarks.findFirst({
      where: { video_id: parseInt(video_id), user_id: data.id },
    });

    if (bookmarkExists) {
      return res.status(400).json({ message: "Bookmark already exists" });
    }

    const bookmark = await prisma.bookmarks.create({
      data: {
        video_id: parseInt(video_id),
        user_id: parseInt(data.id),
      },
    });
    return res.json({ success: true, data: bookmark });
  } catch (error) {
    next(error);
  }
}

export const getAllBookmarks = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarks = await prisma.bookmarks.findMany({
      where: { user_id: data.id },
    });
    return res.json({ success: true, data: bookmarks });
  } catch (error) {
    next(error);
  }
}

export const getBookmarkById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarkId = parseInt(req.params.id);
    const bookmark = await prisma.bookmarks.findUnique({
      where: { id: bookmarkId, user_id: data.id },
    });
    if (!bookmark) {
      return res.status(404).json({
        status: 404,
        message: "Bookmark not found.",
      });
    }
    res.json({ success: true, data: bookmark });
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

    const bookmarkExists = await prisma.bookmarks.findFirst({
      where: { video_id: parseInt(video_id), user_id: data.id },
    });

    if (bookmarkExists) {
      return res.status(400).json({ message: "Bookmark already exists" });
    }

    const updatedBookmark = await prisma.bookmarks.update({
      where: { id: bookmarkId, user_id: data.id },
      data: {
        video_id: parseInt(video_id),
        user_id: parseInt(data.id),
      },
    });
    return res.json({ success: true, data: updatedBookmark });
  } catch (error) {
    next(error);
  }
}

export const deleteBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const videoId = parseInt(req.params.id);
    await prisma.bookmarks.deleteMany({
      where: {
        video_id: videoId,
        user_id: data.id,
      },
    });

    return res.json({ success: true, message: "Bookmark deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

export * as userBookmarkController from "./bookmark.controller.js";