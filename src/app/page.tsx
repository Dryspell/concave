"use client";
import { SignInButton, SignOutButton, auth, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
	const { isSignedIn } = useSession();

	const createThumbnail = useMutation(api.thumbnails.createThumbnail);
	const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{isSignedIn && (
				<div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const form = e.target as HTMLFormElement;
							const formData = new FormData(form);
							const title = formData.get("title") as string;
							createThumbnail({ title });
							form.reset();
						}}
					>
						<label>Title</label>
						<input
							name="title"
							className="border-2 border-black"
							type="text"
						/>
						<button type="submit">Create</button>
					</form>

					{thumbnails?.map((thumbnail) => (
						<div key={thumbnail._id}>
							<h2>{thumbnail.title}</h2>
							{/* <img src={thumbnail.url} /> */}
						</div>
					))}
				</div>
			)}
		</main>
	);
}
