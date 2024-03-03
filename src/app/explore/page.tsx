"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/components/ui/typography";
import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Doc } from "../../../convex/_generated/dataModel";
import { useSession } from "@clerk/nextjs";

const hasVoted = (
	thumbnailTest: Doc<"thumbnail_tests"> & {
		user: Doc<"users"> | undefined | null;
	},
	session: ReturnType<typeof useSession>
) => {
	return session.session?.user.id
		? thumbnailTest.voterIds?.includes(session.session.user.id)
		: false;
};

export default function ExplorePage() {
	const router = useRouter();
	const {
		results: tests,
		status,
		loadMore,
	} = usePaginatedQuery(
		api.thumbnail_tests.getRecentThumbnailTests,
		{},
		{ initialNumItems: 5 }
	);

	const session = useSession();

	return (
		<div className="mt-12">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
				{tests?.map((test) => {
					const topImage = test.images.sort(
						(a, b) => (b.votes ?? 0) - (a.votes ?? 0)
					)[0];

					return (
						<Card
							className="on-hover:shadow-lg cursor-pointer"
							key={test._id}
							onClick={() => {
								router.push(`/tests/${test._id}`);
							}}
						>
							<CardHeader className="relative flex flex-col items-center">
								<Tooltip
									title={
										test.user?.preferredUsername ||
										test.user?.name ||
										"User"
									}
									side="bottom"
								>
									<Avatar className="absolute top-2 right-2">
										<AvatarImage
											src={test.user?.pictureUrl}
											alt={test.user?.name || "User"}
										/>
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</Tooltip>
								<div>
									<CardTitle>{test.title}</CardTitle>
								</div>
								{/* <CardDescription>
								{test.description}
							</CardDescription> */}
							</CardHeader>
							<CardContent className="gap-2 relative">
								<Image
									className="rounded-lg pb-2"
									style={{ width: "100%", height: "100%" }}
									height={300}
									width={400}
									src={getImageUrl(topImage.id)}
									alt={topImage.title || topImage.id}
								/>

								<P>
									{`Votes: ${test.images
										.map((image) =>
											String(image.votes ?? 0)
										)
										.join(" vs ")}`}
								</P>
							</CardContent>
							<CardFooter>
								<P>
									{`Created: ${formatDistance(
										new Date(test._creationTime),
										new Date(),
										{ addSuffix: true }
									)}`}
								</P>
								<Button
									className="w-full"
									variant={
										hasVoted(test, session)
											? "outline"
											: "default"
									}
								>
									{hasVoted(test, session)
										? "View Results"
										: "Vote"}
								</Button>
							</CardFooter>
						</Card>
					);
				})}
			</div>
			<Button
				className="w-full mt-8"
				disabled={status !== "CanLoadMore"}
				onClick={() => {
					loadMore(5);
				}}
			>
				Load More
			</Button>
		</div>
	);
}
