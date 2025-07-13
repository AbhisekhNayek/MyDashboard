// Import the 'node-cron' package for scheduling tasks
import cron from "node-cron";

// Import the User model to interact with the users collection in the database
import { User } from "../models/user.model.js";

// Function to schedule a job that removes unverified user accounts every 30 minutes
export const removeUnverifiedAccounts = () => {
  // Schedule a task to run every 30 minutes using cron expression
  cron.schedule("*/30 * * * *", async () => {
    // Calculate the timestamp for 30 minutes ago from current time
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Delete users whose accounts are still unverified and were created more than 30 minutes ago
    await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });
  });
};
