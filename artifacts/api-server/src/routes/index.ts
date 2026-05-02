import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import alertsRouter from "./alerts";
import detectionsRouter from "./detections";
import analyticsRouter from "./analytics";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(settingsRouter);
router.use(alertsRouter);
router.use(detectionsRouter);
router.use(analyticsRouter);

export default router;
