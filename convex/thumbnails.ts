import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createThumbnail = mutation({
	args: {
		title: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("thumbnails", {
			title: args.title,
		});
	},
});
