import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

export const getUsersByIdsUtil = async (
	ctx: QueryCtx | MutationCtx,
	userIds: string[]
) => {
	const users = await Promise.all(
		userIds.map((userId) =>
			ctx.db
				.query("users")
				.withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
				.unique()
		)
	);
	return users;
};
