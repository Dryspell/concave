import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createThumbnailTest = mutation({
	args: {
		title: v.string(),
		images: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) {
			throw new Error("You must be logged in to create a thumbnail");
		}
		return await ctx.db.insert("thumbnails", {
			title: args.title,
			userId: user.subject,
			images: args.images,
		});
	},
});

export const getThumbnailsForUser = query({
	args: {},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) {
			return [];
			throw new Error("You must be logged in to get thumbnails");
		}

		return await ctx.db
			.query("thumbnails")
			.filter((q) => q.eq(q.field("userId"), user.subject))
			.collect();
	},
});
