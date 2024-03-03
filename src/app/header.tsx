"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

export function Header() {
	useStoreUserEffect();
	const router = useRouter();

	const pay = useAction(api.stripe.pay);

	const handleUpgradeClick = async () => {
		const url = await pay();
		url && router.push(url);
	};

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
						<Button onClick={handleUpgradeClick}>Upgrade</Button>
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
