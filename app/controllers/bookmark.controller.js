import { prisma } from "../lib/dbConnect.js";
export * as bookmarkController from "./bookmark.controller.js";

// Create bookmark record
export const createBookmark = async (req, res, next) => {
  try {
    const { video_id, user_id, is_bookmark } = req.body;

    const newBookmark = await prisma.bookmarks.create({
      data: {
        video_id,
        user_id,
        is_bookmark,
      },
    });

    res.status(201).json({ success: true, data: newBookmark });
  } catch (error) {
    next(error);
  }
};

// Get all bookmarks
export const getAllBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmarks.findMany();

    res.json({ success: true, data: bookmarks });
  } catch (error) {
    next(error);
  }
};

// Get bookmark by ID
export const getBookmarkById = async (req, res, next) => {
  try {
    const bookmarkId = parseInt(req.params.id);

    const bookmark = await prisma.bookmarks.findUnique({
      where: { id: bookmarkId },
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
};

// Update bookmark by ID
export const updateBookmark = async (req, res, next) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    const { video_id, user_id, is_bookmark } = req.body;

    const updatedBookmark = await prisma.bookmarks.update({
      where: { id: bookmarkId },
      data: {
        video_id,
        user_id,
        is_bookmark,
      },
    });

    res.json({ success: true, data: updatedBookmark });
  } catch (error) {
    next(error);
  }
};

// Delete bookmark by ID
export const deleteBookmark = async (req, res, next) => {
  try {
    const bookmarkId = parseInt(req.params.id);

    const deletedBookmark = await prisma.bookmarks.delete({
      where: { id: bookmarkId },
    });

    res.json({ success: true, data: deletedBookmark });
  } catch (error) {
    next(error);
  }
};
