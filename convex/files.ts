import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
	args: {
		// ...
	},
	handler: async (ctx, args) => {
		// use `args` and/or `ctx.auth` to authorize the user
		// ...

		// Return an upload URL
		return await ctx.storage.generateUploadUrl();
	},
});
