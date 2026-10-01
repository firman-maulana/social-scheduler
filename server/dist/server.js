import "dotenv/config";
import express from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";
import cronRouter from "./routes/cronRoutes.js";
import { initScheduler } from "./services/schedulerService.js";
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Ensure database is connected before handling requests
app.use(async (_req, _res, next) => {
    try {
        await connectDB();
        next();
    }
    catch (error) {
        next(error);
    }
});
const port = process.env.PORT || 3000;
app.get('/', (_req, res) => {
    res.send('Server is Live!');
});
app.use("/api/auth", authRouter);
app.use("/api/oauth", socialAuthRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/posts", postRouter);
app.use("/api/activity", activityRouter);
app.use("/api/cron", cronRouter);
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message);
});
// If running locally (not in Vercel Serverless runtime)
if (process.env.VERCEL !== "1") {
    // Initial connection for local dev
    await connectDB();
    // Initialize Local Scheduler
    initScheduler();
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}
export default app;
