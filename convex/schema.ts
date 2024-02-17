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
	}),
});
