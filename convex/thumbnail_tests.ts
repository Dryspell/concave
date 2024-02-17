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
		return await ctx.db.insert("thumbnail_tests", {
			title: args.title,
			userId: user.subject,
			images: args.images.map((id) => ({ id })),
			voterIds: [],
		});
	},
});

export const getThumbnailsTestById = query({
	args: {
		testId: v.id("thumbnail_tests"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get(args.testId);
	},
});

export const getThumbnailTestsByUser = query({
	args: {},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) {
			return [];
			throw new Error("You must be logged in to get thumbnails");
		}

		return await ctx.db
			.query("thumbnail_tests")
			.filter((q) => q.eq(q.field("userId"), user.subject))
			.order("desc")
			.collect();
	},
});

export const voteOnThumbnail = mutation({
	args: {
		testId: v.id("thumbnail_tests"),
		imageId: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = (await ctx.auth.getUserIdentity())?.subject;
		if (!userId) {
			throw new Error("You must be logged in to vote");
		}

		const test = await ctx.db.get(args.testId);
		if (!test) {
			throw new Error("Test not found");
		}
		const image = test.images.find((i) => i.id === args.imageId);
		if (!image) {
			throw new Error("Image not found");
		}
		if (test.voterIds?.includes(userId)) {
			throw new Error("You have already voted on this test");
		}

		await ctx.db.patch(test._id, {
			images: test.images.map((i) =>
				i.id === args.imageId ? { ...i, votes: (i.votes || 0) + 1 } : i
			),
			voterIds: [...(test.voterIds ?? []), userId],
		});
	},
});
