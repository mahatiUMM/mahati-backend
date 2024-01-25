import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler.js";

import { eventController } from "../controllers/event.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { reportController } from "../controllers/report.controller.js";
import { userController } from "../controllers/user.controller.js";
import { exchangeTransaction } from "../controllers/exchange.controller.js";
import { bloodPressureController } from "../controllers/bloodPressure.controller.js";
import { bookmarkController } from "../controllers/bookmark.controller.js";
import { brochureController } from "../controllers/brochure.controller.js";

const routes = Router({ strict: true });

// auth
routes.post("/signup", authController.signUp);
routes.post("/signin", authController.signIn);
routes.get(
  "/refresh",
  tokenValidation(true),
  authController.refreshAccessToken
);
routes.get("/profile", tokenValidation(), authController.getUser);

//blood pressures
routes.get("/blood_pressure", bloodPressureController.getAllBloodPressures);
routes.get("/blood_pressure/:id", bloodPressureController.getBloodPressureById);
routes.post("/blood_pressure", bloodPressureController.createBloodPressure);
routes.put("/blood_pressure/:id", bloodPressureController.updateBloodPressure);
routes.delete(
  "/blood_pressure/:id",
  bloodPressureController.deleteBloodPressure
);

//bookmark
routes.get("/bookmark", bookmarkController.getAllBookmarks);
routes.get("/bookmark/:id", bookmarkController.getBookmarkById);
routes.post("/bookmark", bookmarkController.createBookmark);
routes.put("/bookmark/:id", bookmarkController.updateBookmark);
routes.delete("/bookmark/:id", bookmarkController.deleteBookmark);

//brochure
routes.get("/brochure", brochureController.getAllBrochures);
routes.get("/brochure/:id", brochureController.getBrochureById);
routes.post("/brochure", brochureController.createBrochure);
routes.put("/brochure/:id", brochureController.updateBrochure);
routes.delete("/brochure/:id", brochureController.deleteBrochure);


export default routes;
