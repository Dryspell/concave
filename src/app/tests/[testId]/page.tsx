"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl, shuffle } from "@/lib/utils";
import { alphabet } from "@/lib/contants";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import Comments from "./Comments";

export default function ThumbnailTestPage() {
	const params = useParams<{ testId: Id<"thumbnail_tests"> }>();
	const session = useSession();

	const thumbnailTest = useQuery(api.thumbnail_tests.getThumbnailsTestById, {
		testId: params.testId,
	});
	const voteOnThumbnail = useMutation(api.thumbnail_tests.voteOnThumbnail);

	if (!thumbnailTest || !session.isLoaded) return <div>{`Loading...`}</div>;
	if (!session.session?.user)
		return <div>{`You must be signed in to vote`}</div>;
	const hasVoted = (thumbnailTest.voterIds ?? []).includes(
		session.session.user.id
	);

	return (
		<div className="mt-16">
			{thumbnailTest ? (
				<div>
					<h2 className="text-2xl font-bold text-center">
						{thumbnailTest.title}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{shuffle(thumbnailTest.images).map((image, i) => (
							<div
								key={i}
								className="flex items-center flex-col gap-4"
							>
								<h3 className="text-xl font-bold text-center">
									{`Image ${alphabet[i].toUpperCase()}`}
								</h3>
								<Image
									style={{ width: "100%", height: "100%" }}
									height={600}
									width={600}
									src={getImageUrl(image.id)}
									alt={image.title || thumbnailTest.title}
									className="w-full h-64 object-cover rounded-lg"
								/>
								{hasVoted ? (
									<>
										<Progress
											value={Math.ceil(
												((image.votes ?? 0) /
													(thumbnailTest.voterIds
														?.length || 1)) *
													100
											)}
										/>
										<div>{`Votes: ${
											image.votes ?? 0
										}`}</div>
									</>
								) : (
									<Button
										onClick={() => {
											voteOnThumbnail({
												testId: thumbnailTest._id,
												imageId: image.id,
											}).catch((e) => console.error(e));
										}}
										size="lg"
										className="w-fit"
									>
										{`Vote ${alphabet[i].toUpperCase()}`}
									</Button>
								)}
							</div>
						))}
					</div>
					<Comments thumbnailTest={thumbnailTest} />
				</div>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
}
