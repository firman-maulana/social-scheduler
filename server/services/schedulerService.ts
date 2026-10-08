import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";

export const runSchedulerTask = async () => {
    try {
        const now = new Date();
        const postsToPublish = await Post.find({
            status: "scheduled",
            scheduledFor: { $lte: now }
        });

        const results = [];

        for (const post of postsToPublish) {
            try {
                const accounts = await Account.find({
                    user: post.user,
                    platform: { $in: post.platforms },
                    status: "connected",
                    zernioAccountId: { $exists: true }
                });

                if (accounts.length === 0) {
                    console.log(`No connected Zernio accounts found for post ${post._id}`);
                    continue;
                }
                const zernioPlatforms = accounts.map((acc) => ({
                    platform: acc.platform as any,
                    accountId: acc.zernioAccountId!
                }));

                const payload = {
                    content: post.content,
                    publishNow: true,
                    ...(post.mediaUrl ? {
                        mediaItems: [{
                            type: post.mediaType || "image",
                            url: post.mediaUrl
                        }]
                    } : {}),
                    platforms: zernioPlatforms,
                };

                console.log(`Publishing post ${post._id} to Zernio with media: ${post.mediaUrl || "none"}`);

                const response = await zernio.posts.createPost({
                    body: payload
                });

                const publishedPost = (response.data as any)?.post || response.data;

                if (!publishedPost) {
                    throw new Error("Failed to get post object from Zernio response");
                }

                console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);

                post.status = "published";
                await post.save();

                const platformNames = accounts.map((a) => {
                    const pl = (a.platform || "").toLowerCase();
                    if (pl === "tiktok") return "TIKTOK";
                    if (pl === "youtube") return "YOUTUBE";
                    return pl.toUpperCase();
                }).join(", ");

                await ActivityLog.create({
                    user: post.user,
                    actionType: "POST_PUBLISHED",
                    description: `Published post to ${platformNames}`,
                    relatedPost: post._id,
                });

                results.push({ postId: post._id, status: "published" });

            } catch (err: any) {
                console.error(`Failed to publish post ${post._id}:`, err?.response?.data || err?.message);
                post.status = "failed";
                await post.save();
                results.push({ postId: post._id, status: "failed", error: err?.message });
            }
        }

        if (postsToPublish.length > 0) {
            console.log(`Evaluated ${postsToPublish.length} posts at ${now.toISOString()}`);
        }

        return { processed: postsToPublish.length, results };

    } catch (error) {
        console.error("Error in scheduler:", error);
        throw error;
    }
};

export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
        await runSchedulerTask();
    });
    console.log("Scheduler service initialized.");
};