import { prisma } from "../lib/dbConnect.js";
export * as videoController from "./video.controller.js";
import { verifyToken } from "../lib/tokenHandler.js";

// Create video
export const createVideo = async (req, res, next) => {
  try {
    const { link, user_id } = req.body;

    if (!link || !user_id) {
      return res.status(400).json({
        status: 400,
        message: "Please provide link and user_id.",
      });
    } else if (typeof user_id !== "number") {
      return res.status(400).json({
        status: 400,
        message: "user_id must be a number.",
      });
    }

    const youtubeOembed = "https://www.youtube.com/oembed?url=";

    const response = await fetch(`${youtubeOembed}${link}&format=json`);
    const data = await response.json();

    const newVideo = await prisma.videos.create({
      data: {
        link,
        user_id,
        title: data.title,
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url,
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
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const videos = await prisma.videos.findMany();
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        user_id: data.id,
      },
      select: {
        video_id: true,
      },
    });
    const bookmarkedVideoIds = new Set(
      bookmarks.map((bookmark) => bookmark.video_id)
    );
    const videosWithBookmarkFlag = videos.map((video) => ({
      ...video,
      is_bookmarked: bookmarkedVideoIds.has(video.id),
    }));

    res.json({ success: true, data: videosWithBookmarkFlag });
  } catch (error) {
    next(error);
  }
};

// Get all videos
export const getAllBookmarkedVideos = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        user_id: data.id,
      },
      select: {
        video_id: true,
      },
    });

    const bookmarkedVideoIds = bookmarks.map((bookmark) => bookmark.video_id);
    const bookmarkedVideos = await prisma.videos.findMany({
      where: {
        id: {
          in: bookmarkedVideoIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: bookmarkedVideos.map((video) => ({
        ...video,
        is_bookmarked: true,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get video by ID
export const getVideoById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const videoId = parseInt(req.params.id);

    const video = await prisma.videos.findUnique({
      where: { id: videoId },
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
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

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
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const videoId = parseInt(req.params.id);

    const deletedVideo = await prisma.videos.delete({
      where: { id: videoId },
    });

    res.json({ success: true, data: deletedVideo });
  } catch (error) {
    next(error);
  }
};
