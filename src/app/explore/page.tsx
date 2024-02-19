"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";

export default function ExplorePage() {
	const router = useRouter();
	const tests = useQuery(api.thumbnail_tests.getRecentThumbnailTests);

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
							<CardHeader className="relative">
								<CardTitle>{test.title}</CardTitle>
								{/* <CardDescription>
								{test.description}
							</CardDescription> */}
							</CardHeader>
							<CardContent className="gap-2">
								<Image
									className="rounded-lg pb-2"
									style={{ width: "100%", height: "100%" }}
									height={300}
									width={400}
									src={getImageUrl(topImage.id)}
									alt={topImage.title || topImage.id}
								/>

								<div className="text">
									{`Votes: ${test.images
										.map((image) =>
											String(image.votes ?? 0)
										)
										.join(" / ")}`}
								</div>
							</CardContent>
							<CardFooter>
								<p>
									{`Created: ${formatDistance(
										new Date(test._creationTime),
										new Date(),
										{ addSuffix: true }
									)} by ${
										test.user?.preferredUsername ||
										test.user?.name
									}`}
								</p>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
