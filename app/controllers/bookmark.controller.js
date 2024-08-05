import { prisma } from "../lib/dbConnect.js"
import { verifyToken } from "../lib/tokenHandler.js"

// Create bookmark record
export const createBookmark = async (req, res, next) => {
  try {
    const { video_id, user_id, is_bookmark } = req.body

    const newBookmark = await prisma.bookmarks.create({
      data: {
        video_id,
        user_id,
        is_bookmark,
      },
    })

    res.status(201).json({ success: true, data: newBookmark })
  } catch (error) {
    next(error)
  }
}

// Get all bookmarks
export const getAllBookmarks = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const user = await prisma.users.findUnique({
      where: { id: data.id },
    })

    if (user.isAdmin) {
      const bookmarksAdmin = await prisma.bookmarks.findMany()
      return res.json({ success: true, data: bookmarksAdmin })
    } else {
      const bookmarks = await prisma.bookmarks.findMany({
        where: { user_id: data.id },
      })
      return res.json({ success: true, data: bookmarks })
    }
  } catch (error) {
    next(error)
  }
}

// Get bookmark by ID
export const getBookmarkById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const bookmarkId = parseInt(req.params.id)

    const bookmark = await prisma.bookmarks.findUnique({
      where: { id: bookmarkId },
    })

    if (!bookmark) {
      return res.status(404).json({
        status: 404,
        message: "Bookmark not found.",
      })
    }

    res.json({ success: true, data: bookmark })
  } catch (error) {
    next(error)
  }
}

// Update bookmark by ID
export const updateBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const bookmarkId = parseInt(req.params.id)
    const { video_id, user_id, is_bookmark } = req.body

    const updatedBookmark = await prisma.bookmarks.update({
      where: { id: bookmarkId },
      data: {
        video_id,
        user_id,
        is_bookmark,
      },
    })

    res.json({ success: true, data: updatedBookmark })
  } catch (error) {
    next(error)
  }
}

// Delete bookmark by ID
export const deleteBookmark = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const bookmarkId = parseInt(req.params.id)

    const deletedBookmark = await prisma.bookmarks.delete({
      where: { id: bookmarkId },
    })

    res.json({ success: true, data: deletedBookmark })
  } catch (error) {
    next(error)
  }
}

export * as bookmarkController from "./bookmark.controller.js";