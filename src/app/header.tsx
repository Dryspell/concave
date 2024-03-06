"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import useDetailedAction from "@/hooks/useDetailedAction";

export function Header() {
	useStoreUserEffect();
	const router = useRouter();

	// const getPaymentUrl = useAction(api.stripe.getPaymentUrl);

	const { isLoading: paymentUrlLoading, mutate: getDetailedPaymentUrl } =
		useDetailedAction(api.stripe.getPaymentUrl, {
			onSuccess: (url) => {
				console.log(`Received Stripe Url: ${url}`);
				url &&
					typeof window !== "undefined" &&
					window.open(url, "_blank");
			},
			onError: (error) => {
				console.error(error);
			},
			onMutate: (params) => {
				console.log(`mutating...`, params);
			},
		});

	const handleUpgradeClick = async () => {
		getDetailedPaymentUrl();
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
						<Button
							disabled={paymentUrlLoading}
							onClick={handleUpgradeClick}
						>
							{!paymentUrlLoading ? "Upgrade" : "Loading..."}
						</Button>
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
