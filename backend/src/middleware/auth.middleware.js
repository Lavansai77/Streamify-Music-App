import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    const auth = req.auth();

    console.log("Clerk auth diagnostic:", {
      userId: auth.userId,
      status: auth.status,
      reason: auth.reason,
    });

    if (!auth.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.userId = auth.userId;
    next();
  } catch (err) {
    console.error("Clerk authentication error:", err.message);
    next(err);
  }
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.userId);

		const isAdmin =
  currentUser.primaryEmailAddress?.emailAddress
    ?.trim()
    .toLowerCase() ===
  process.env.ADMIN_EMAIL?.trim().toLowerCase();

		if (!isAdmin) {
			return res.status(403).json({
				message: "Admin only",
			});
		}

		next();
	} catch (err) {
		next(err);
	}
};