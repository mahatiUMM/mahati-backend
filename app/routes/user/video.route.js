import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userVideoController } from "../../controllers/user/video.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/video",
  tokenValidation(),
  userVideoController.getAllVideos
);
routes.get(
  "/video/:id",
  tokenValidation(),
  userVideoController.getVideoById
);
routes.post(
  "/video",
  userVideoController.createVideo
);
routes.put(
  "/video/:id",
  tokenValidation(),
  userVideoController.updateVideo
);
routes.delete(
  "/video/:id",
  tokenValidation(),
  userVideoController.deleteVideo
);

export default routes;
