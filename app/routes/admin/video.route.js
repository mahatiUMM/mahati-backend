import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminVideoController } from "../../controllers/admin/video.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/videos",
  tokenValidation(),
  adminVideoController.getAllVideos
);
routes.get(
  "/videos/:id",
  tokenValidation(),
  adminVideoController.getVideoById
);
routes.post(
  "/videos",
  tokenValidation(),
  adminVideoController.createVideo
);
routes.put(
  "/videos/:id",
  tokenValidation(),
  adminVideoController.updateVideo
);
routes.delete(
  "/videos/:id",
  tokenValidation(),
  adminVideoController.deleteVideo
);

export default routes;