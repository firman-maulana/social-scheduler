import express, { Request, Response } from "express";
import { runSchedulerTask } from "../services/schedulerService.js";

const cronRouter = express.Router();

cronRouter.get("/trigger", async (_req: Request, res: Response) => {
    try {
        const result = await runSchedulerTask();
        res.status(200).json({
            success: true,
            message: "Scheduler task executed successfully",
            ...result,
        });
    } catch (error: any) {
        console.error("Cron trigger error:", error);
        res.status(500).json({
            success: false,
            message: error?.message || "Failed to run scheduler task",
        });
    }
});

export default cronRouter;
