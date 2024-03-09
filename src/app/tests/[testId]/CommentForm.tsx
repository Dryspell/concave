"use client";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { customAsync, minLength, string, stringAsync } from "valibot";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useDetailedMutation from "@/hooks/useDetailedMutation";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

export default function CommentForm({
	thumbnailTest,
}: {
	thumbnailTest: Doc<"thumbnail_tests">;
}) {
	const { toast } = useToast();

	const { mutate: createComment, isLoading: isCreatingComment } =
		useDetailedMutation(api.thumbnail_tests.addComment, {
			onSuccess: (result) => {
				toast({
					title: "Comment Added!",
					description: `Thanks for leaving feedback!`,
				});
			},
			onError: (error) => {
				toast({
					title: `Error adding comment: ${error.message}`,
				});
			},
			onMutate: (params) => {
				toast({
					title: "Adding Comment...",
				});
			},
		});

	const { Provider, Field, Subscribe, handleSubmit, state, useStore, reset } =
		useForm({
			defaultValues: {
				text: "",
			},
			onSubmit: (values) => {
				console.log(values);
				createComment({
					text: values.value.text,
					testId: thumbnailTest._id,
				});
        reset();
			},
			validatorAdapter: valibotValidator,
		});

	return (
		<>
			{/* <h1>Add a Comment...</h1> */}
			<Provider>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void handleSubmit();
					}}
				>
					<div>
						<Field
							name="text"
							validators={{
								onChange: string([
									minLength(
										3,
										"First name must be at least 3 characters"
									),
								]),
								onChangeAsyncDebounceMs: 500,
								onChangeAsync: stringAsync([
									customAsync(async (value) => {
										await new Promise((resolve) =>
											setTimeout(resolve, 1000)
										);
										return !value.includes("error");
									}, "No 'error' allowed in first name"),
								]),
							}}
							// eslint-disable-next-line react/no-children-prop
							children={(field) => {
								// Avoid hasty abstractions. Render props are great!
								return (
									<>
										<Label htmlFor={field.name}>
											Add a Comment...
										</Label>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value
												)
											}
										/>
									</>
								);
							}}
						/>
						<Subscribe
							selector={(state) => [
								state.canSubmit,
								state.isSubmitting,
							]}
							// eslint-disable-next-line react/no-children-prop
							children={([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit && !isCreatingComment}
								>
									{isSubmitting || isCreatingComment
										? "..."
										: "Submit"}
								</Button>
							)}
						/>
					</div>
				</form>
			</Provider>
		</>
	);
}
