import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	thumbnail_tests: defineTable({
		title: v.string(),
		userId: v.string(),
		images: v.array(
			v.object({
				id: v.string(),
				title: v.optional(v.string()),
				votes: v.optional(v.number()),
			})
		),
		voterIds: v.optional(v.array(v.string())),
    comments: v.optional(v.array(v.object({
      userId: v.string(),
      text: v.string(),
      createdAt: v.number(),
    }))),
	}),
	users: defineTable({
		id: v.string(),
		tokenIdentifier: v.string(),
		name: v.string(),
		preferredUsername: v.optional(v.string()),
		email: v.optional(v.string()),
		pictureUrl: v.optional(v.string()),
		subscriptionId: v.optional(v.string()),
		subscriptionExpirey: v.optional(v.number()),
    credits: v.optional(v.number()),
	})
		.index("by_token", ["tokenIdentifier"])
		.index("by_userid", ["id"])
		.index("by_subscriptionId", ["subscriptionId"]),
});
