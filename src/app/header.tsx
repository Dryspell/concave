"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";

export function Header() {
	const userId = useStoreUserEffect();

	return (
		<div className="border-b">
			<div className="h-16 container flex justify-between items-center">
				<Link className="link" href="/">
					Thumbnail Rater
				</Link>

				<div className="flex gap-8">
					<SignedIn>
						<Link className="link" href="/create">
							Create Test
						</Link>
						<Link className="link" href="/dashboard">
							Dashboard
						</Link>
						<Link className="link" href="/explore">
							Explore
						</Link>
					</SignedIn>
					<SignedOut>
						<Link className="link" href="/about">
							About
						</Link>
						<Link className="link" href="pricing">
							Pricing
						</Link>
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
