import { prisma } from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const createBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { video_id } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

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
    }
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

export const getBookmarkById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarkId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (user.isAdmin) {
      const bookmarkAdmin = await prisma.bookmarks.findFirst({
        where: { id: bookmarkId },
      })
      return res.json({ success: true, data: bookmarkAdmin });
    } else {
      const bookmark = await prisma.bookmarks.findFirst({
        where: { id: bookmarkId, user_id: data.id },
      });

      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }

      return res.json({ success: true, data: bookmark });
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

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (user.isAdmin) {
      const { user_id } = req.body;
      const updatedBookmarkAdmin = await prisma.bookmarks.update({
        where: { id: bookmarkId },
        data: {
          video_id: parseInt(video_id),
          user_id: parseInt(user_id),
        },
      });
      return res.json({ success: true, data: updatedBookmarkAdmin });
    } else {
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

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (user.isAdmin) {
      await prisma.bookmarks.delete({
        where: { id: bookmarkId },
      });
      return res.json({ success: true, message: "Bookmark deleted" });
    } else {
      const bookmark = await prisma.bookmarks.findFirst({
        where: { id: bookmarkId, user_id: data.id },
      });

      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }

      await prisma.bookmarks.delete({
        where: { id: bookmarkId, user_id: data.id },
      });
      return res.json({ success: true, message: "Bookmark deleted" });
    }
  } catch (error) {
    next(error);
  }
};

export * as bookmarkController from "./bookmark.controller.js";
