import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler.js";

import { eventController } from "../controllers/event.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { reportController } from "../controllers/report.controller.js";
import { userController } from "../controllers/user.controller.js";
import { exchangeTransaction } from "../controllers/exchange.controller.js";

const routes = Router({ strict: true });

// auth
routes.post("/signup", authController.signUp);
routes.post("/signin", authController.signIn);

// user
routes.get("/user", tokenValidation(), userController.getUser);
routes.post("/user/points", userController.postPointByUserId);

// events
routes.get("/events", eventController.getEvent);
routes.post("/events", eventController.createEvent);

// report
routes.get("/reports", reportController.getReport);
routes.post("/reports", reportController.createReport);

// exchange
routes.get("/exchange", exchangeTransaction.getExchangeTransactions);
routes.get("/exchange/:user_id", exchangeTransaction.getExchangeTransactionsByUserId);
routes.post("/exchange", exchangeTransaction.createExchangeTransaction);

export default routes;
