"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function Header() {
	return (
		<div className="border-b">
			<div className="h-16 container flex justify-between items-center">
				<div>Thumbnail Rater</div>

				<div>
					<SignedIn>
						<Link href="/create">Create Test</Link>
					</SignedIn>
					<SignedOut>
						<Link href="/about">About</Link>
						<Link href="pricing">Pricing</Link>
					</SignedOut>
				</div>

				<div className="flex gap-4 items-center">
					<SignedIn>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<SignInButton />
					</SignedOut>
					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
