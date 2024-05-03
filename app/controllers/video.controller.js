import { prisma } from "../lib/dbConnect.js";
export * as videoController from "./video.controller.js";

// Create video
export const createVideo = async (req, res, next) => {
  try {
    const { link, user_id } = req.body;

    const newVideo = await prisma.videos.create({
      data: {
        link,
        user_id,
      },
    });

    res.status(201).json({ success: true, data: newVideo });
  } catch (error) {
    next(error);
  }
};

// Get all videos
export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await prisma.videos.findMany({
      include: {
        user: true,
        bookmarks: true,
      },
    });

    res.json({ success: true, data: videos });
  } catch (error) {
    next(error);
  }
};

// Get video by ID
export const getVideoById = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);

    const video = await prisma.videos.findUnique({
      where: { id: videoId },
      include: {
        user: true,
        bookmarks: true,
      },
    });

    if (!video) {
      return res.status(404).json({
        status: 404,
        message: "Video not found.",
      });
    }

    res.json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// Update video by ID
export const updateVideo = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);
    const { link, user_id } = req.body;

    const updatedVideo = await prisma.videos.update({
      where: { id: videoId },
      data: {
        link,
        user_id,
      },
      include: {
        user: true,
        bookmarks: true,
      },
    });

    res.json({ success: true, data: updatedVideo });
  } catch (error) {
    next(error);
  }
};

// Delete video by ID
export const deleteVideo = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);

    const deletedVideo = await prisma.videos.delete({
      where: { id: videoId },
    });

    res.json({ success: true, data: deletedVideo });
  } catch (error) {
    next(error);
  }
};
