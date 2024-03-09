"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React from "react";
import { formatDistance } from "date-fns";
import CommentForm from "./CommentForm";
import useStableDbUser from "@/hooks/useStoreUserEffect";
import { isUserSubscribed } from "../../../../convex/users";
import { Button } from "@/components/ui/button";
import UpgradeSubscriptionButton from "@/components/UpgradeButton";

const isSubscribed = (dbUser?: Doc<"users"> | null) => {
	return dbUser?.subscriptionExpirey ?? 0 > Date.now();
};

export default function Comments({
	thumbnailTest,
}: {
	thumbnailTest: Doc<"thumbnail_tests">;
}) {
	const user = useStableDbUser();

	const commentProfiles = useQuery(api.users.getUsersByIds, {
		userIds: thumbnailTest.comments?.map((c) => c.userId) ?? [],
	});

	React.useEffect(() => {
		console.log({ commentProfiles });
	}, [commentProfiles]);

	return (
		<div>
			<h2 className=" my-8 text-4xl font-bold text-center">Comments</h2>
			<div className="max-w-md mx-auto">
				<CommentForm thumbnailTest={thumbnailTest} />
				<div className="space-y-8 mt-12">
					{thumbnailTest.comments
						?.sort((a, b) => b.createdAt - a.createdAt)
						?.slice(0, user && !isSubscribed(user) ? 1 : -1)
						?.map((comment, i) => {
							const commentProfile = commentProfiles?.find(
								(profile) =>
									profile?.tokenIdentifier === comment.userId
							);
							return (
								<div key={i} className="border p-4 rounded">
									<div className="flex gap-4">
										<Avatar>
											<AvatarImage
												src={commentProfile?.pictureUrl}
												alt={
													commentProfile?.name ||
													"User"
												}
											/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<div className="flex flex-col gap-2">
											<div>
												{commentProfile?.preferredUsername ||
													commentProfile?.name ||
													"Unknown User"}
											</div>
											<div>
												{`${formatDistance(
													new Date(comment.createdAt),
													new Date(),
													{ addSuffix: true }
												)}`}
											</div>
											<div>{comment.text}</div>
										</div>
									</div>
								</div>
							);
						})}
					{!isSubscribed(user) && (
						<div className="border p-4 rounded text-center space-y-4">
							Upgrade to view all feedback users left for you
							<div>
								<UpgradeSubscriptionButton />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
