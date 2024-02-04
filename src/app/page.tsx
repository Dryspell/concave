"use client";
import { SignInButton, SignOutButton, auth, useSession } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
	const { isSignedIn } = useSession();

	const createThumbnail = useMutation(api.thumbnails.createThumbnail);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{isSignedIn ? (
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
					<SignOutButton />
				</div>
			) : (
				<SignInButton />
			)}
		</main>
	);
}
