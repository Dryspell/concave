"use node";

import { v } from "convex/values";
import Stripe from "stripe";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

const priceIds = {
	thumbnailRater: "price_1OqKUhCv4rZu5wGcHYjLQG8k",
};

export const getPaymentUrl = action({
	args: {},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) {
			throw new Error("You must be logged in to make a purchase.");
		}
		if (!user.emailVerified) {
			throw new Error("You must verify your email to make a purchase.");
		}

		const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
		const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
			apiVersion: "2023-10-16",
		});

		const session = await stripe.checkout.sessions.create({
			line_items: [{ price: priceIds.thumbnailRater, quantity: 1 }],
			metadata: { userId: user.subject },
			customer_email: user.email,
			mode: "subscription",
			success_url: `${domain}`,
			cancel_url: `${domain}`,
			// automatic_tax: { enabled: true },
		});

		return session.url;
	},
});

export const fulfill = internalAction({
	args: {
		signature: v.string(),
		payload: v.string(),
	},
	handler: async (ctx, args) => {
		const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
			apiVersion: "2023-10-16",
		});

		try {
			const event = stripe.webhooks.constructEvent(
				args.payload,
				args.signature,
				process.env.STRIPE_WEBHOOK_SECRET || ""
			);

			// const metadata = event.data.object.metadata as Metadata;

			switch (event.type) {
				case "checkout.session.completed":
					const userId = event.data.object.metadata?.userId;
					if (!userId) {
						throw new Error("No userId in checkout session");
					}

					const mutationResult = await ctx.runMutation(
						internal.users.setStripeId,
						{
							userId,
							stripeId: event.id as string,
						}
					);

					return { success: true };

				case "payment_intent.succeeded":
					console.log("Payment intent succeeded");
					console.log(event);
					// await ctx.runMutation(internal.users.addCredits, {
					// 	userId: metadata.userId,
					// 	amount: event.data.object.amount,
					// });
					return { success: true };
			}
		} catch (err) {
			console.error(err);
			return { success: false, error: (err as Error).message };
		}
		return { success: false };
	},
});
