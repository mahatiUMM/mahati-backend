import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

export const createVideo = async (req, res, next) => {
  try {
    const {
      link,
      user_id
    } = req.body;

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
}

export const getAllVideos = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const videos = await prisma.videos.findMany();

      // check all users bookmarks and return bookmarked videos
      const bookmarks = await prisma.bookmarks.findMany({
        select: {
          video_id: true,
        }
      })

      const bookmarkedVideoIds = new Set(bookmarks.map((bookmark) => bookmark.video_id));

      const videosWithBookmarkFlag = videos.map((video) => ({
        ...video,
        is_bookmarked: bookmarkedVideoIds.has(video.id),
      }));

      res.json({ success: true, data: videosWithBookmarkFlag });
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

export const getVideoById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const videoId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const video = await prisma.videos.findUnique({
        where: { id: videoId },
      });

      res.json({ success: true, data: video });
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

export const updateVideo = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);
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

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const youtubeOembed = "https://www.youtube.com/oembed?url=";

      const response = await fetch(`${youtubeOembed}${link}&format=json`);
      const data = await response.json();

      const updatedVideo = await prisma.videos.update({
        where: { id: videoId },
        data: {
          link,
          user_id,
          title: data.title,
          author_name: data.author_name,
          author_url: data.author_url,
          thumbnail_url: data.thumbnail_url,
        },
      });

      res.json({ success: true, data: updatedVideo });
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

export const deleteVideo = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      await prisma.videos.delete({
        where: { id: videoId },
      });

      res.json({ success: true, message: "Video deleted successfully." });
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

export * as adminVideoController from "./video.controller.js";