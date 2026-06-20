import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import candidatesRouter from "./candidates";
import employersRouter from "./employers";
import vacanciesRouter from "./vacancies";
import applicationsRouter from "./applications";
import documentsRouter from "./documents";
import trainingRouter from "./training";
import recognitionRouter from "./recognition";
import visaRouter from "./visa";
import interviewsRouter from "./interviews";
import offersRouter from "./offers";
import welfareRouter from "./welfare";
import notificationsRouter from "./notifications";
import analyticsRouter from "./analytics";
import aiRouter from "./ai";
import certificationsRouter from "./certifications";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", service: "indo-german-mobility-api" });
});

router.use(healthRouter);
router.use(authRouter);
router.use(candidatesRouter);
router.use(employersRouter);
router.use(vacanciesRouter);
router.use(applicationsRouter);
router.use(documentsRouter);
router.use(trainingRouter);
router.use(recognitionRouter);
router.use(visaRouter);
router.use(interviewsRouter);
router.use(offersRouter);
router.use(welfareRouter);
router.use(notificationsRouter);
router.use(analyticsRouter);
router.use(aiRouter);
router.use(certificationsRouter);

export default router;
