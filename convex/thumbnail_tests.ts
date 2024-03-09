import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { isUserSubscribed } from "./users";
import { getUsersByIdsUtil } from "./utils";

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
		const dbUser = await getUsersByIdsUtil(ctx, [
			user.tokenIdentifier,
		]).then((res) => res[0]);
		if (!dbUser) {
			throw new Error("User not found");
		}

		// if (!(await isUserSubscribed(ctx))) {
		// 	throw new Error("You must be subscribed to create a thumbnail");
		// }

		if ((dbUser?.credits ?? 0) < 1) {
			throw new Error(
				"You don't have enough credits to create a thumbnail"
			);
		}

		const [creditsPatch, newThumbnailTest] = await Promise.all([
			ctx.db.patch(dbUser._id, {
				credits: Math.max(0, (dbUser?.credits ?? 0) - 1),
			}),
			ctx.db.insert("thumbnail_tests", {
				title: args.title,
				userId: user.tokenIdentifier,
				images: args.images.map((id) => ({ id })),
				voterIds: [],
			}),
		]);

		return newThumbnailTest;
	},
});

export const addComment = mutation({
	args: {
		testId: v.id("thumbnail_tests"),
		text: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) {
			throw new Error("You must be logged in to comment");
		}

		const test = await ctx.db.get(args.testId);
		if (!test) {
			throw new Error("Test not found");
		}

		return await ctx.db.patch(args.testId, {
			comments: [
				{
					userId: user.tokenIdentifier,
					text: args.text,
					createdAt: Date.now(),
				},
			].concat(test.comments ?? []),
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

export const getRecentThumbnailTests = query({
	args: { paginationOpts: paginationOptsValidator },
	handler: async (ctx, args) => {
		const tests = await ctx.db
			.query("thumbnail_tests")
			.order("desc")
			.paginate(args.paginationOpts);

		const users = await getUsersByIdsUtil(
			ctx,
			tests.page.map((test) => test.userId)
		);

		return {
			...tests,
			page: tests.page.map((test) => ({
				...test,
				user: users.find((u) => u?.tokenIdentifier === test.userId),
			})),
		};
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
