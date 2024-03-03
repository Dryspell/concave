import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
	path: "/stripe",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const signature = request.headers.get("stripe-signature") || "";

		const result = await ctx.runAction(internal.stripe.fulfill, {
			payload: await request.text(),
			signature,
		});

		if (result.success) {
			return new Response("Success", { status: 200 });
		} else {
			return new Response("Webhook Error", { status: 400 });
		}
	}),
});

http.route({
	path: "/clerk",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const payloadString = await request.text();
		const headers = request.headers;

		try {
			const result = await ctx.runAction(internal.clerk.fulfill, {
				payload: payloadString,
				headers: {
					"svix-id": headers.get("svix-id") || "",
					"svix-signature": headers.get("svix-signature") || "",
					"svix-timestamp": headers.get("svix-timestamp") || "",
				},
			});

			switch (result.type) {
				case "user.created":
					await ctx.runMutation(internal.users.createUser, {
						user: {
							id: result.data.id,
							name:
								result.data.username ||
								result.data.email_addresses[0].email_address,
							preferredUsername:
								result.data.email_addresses[0].email_address,
							pictureUrl: result.data.image_url,
							tokenIdentifier: result.data.id,
							email: result.data.email_addresses[0].email_address,
						},
					});
					return new Response("User created", { status: 200 });
			}
		} catch (e) {
			console.error(e);
		}
		return new Response("Webhook Error", { status: 400 });
	}),
});

export default http;
