"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import useStableDbUser from "@/hooks/useStoreUserEffect";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import useDetailedAction from "@/hooks/useDetailedAction";

export function Header() {
	const user = useStableDbUser();
	const router = useRouter();

	const isSubscribed = user && (user.subscriptionExpirey ?? 0 > Date.now());

	// const getPaymentUrl = useAction(api.stripe.getPaymentUrl);

	const { mutate: getDetailedPaymentUrl, isLoading: paymentUrlLoading } =
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
						{!isSubscribed && (
							<Button
								disabled={paymentUrlLoading}
								onClick={handleUpgradeClick}
							>
								{!paymentUrlLoading ? "Upgrade" : "Loading..."}
							</Button>
						)}
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
