"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton } from "@xixixao/uploadstuff/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { getImageUrl } from "../../lib/utils";
import { alphabet } from "@/lib/contants";
import { isStorageIdResponse } from "./utils";
import useDetailedMutation from "@/hooks/useDetailedMutation";
import UpgradeSubscriptionButton from "@/components/UpgradeButton";

const defaultErrors = (images: string[]) => {
	const errors: Record<string, string> = {};
	return errors;
};

function ImageUploadForm(props: {
	title: string;
	index: number;
	images: string[];
	setImages: React.Dispatch<React.SetStateAction<string[]>>;
	errors: Record<string, string>;
}) {
	const generateUploadUrl = useMutation(api.files.generateUploadUrl);

	const { title, setImages, index, images } = props;

	return (
		<div
			className={clsx("flex flex-col gap-4 rounded p-2", {
				"border-red-500 border-2 p-4":
					props.errors[`${alphabet[index]}Image`],
			})}
		>
			<h2 className="2xl font-bold">{title}</h2>
			{images[index] ? (
				<Image
					style={{ width: "100%", height: "100%" }}
					height={300}
					width={400}
					src={getImageUrl(images[index])}
					alt={title}
					className="w-full h-64 object-cover rounded-lg"
				/>
			) : (
				<UploadButton
					uploadUrl={generateUploadUrl}
					fileTypes={["image/*"]}
					onUploadBegin={() => {
						console.log("uploading...");
					}}
					onUploadComplete={(uploaded) => {
						console.log(
							`UploadResponse: ${JSON.stringify(
								uploaded[0].response
							)}`
						);
						if (!isStorageIdResponse(uploaded[0].response)) {
							console.error(
								"Expected a storageId in the response, but got something else"
							);
							return;
						}

						setImages((images) =>
							images.map((image, i) =>
								i === index &&
								isStorageIdResponse(uploaded[0].response)
									? uploaded[0].response.storageId
									: image
							)
						);
					}}
					onUploadError={(error: unknown) => {
						// Do something with the error.
						alert(`ERROR! ${error}`);
					}}
				/>
			)}

			{props.errors[`${alphabet[index]}Image`] && (
				<div className="text bg-red-500">
					{props.errors[`${alphabet[index]}Image`]}
				</div>
			)}
		</div>
	);
}

export default function CreatePage() {
	const [images, setImages] = useState<string[]>(["", ""]);
	const [errors, setErrors] = useState(defaultErrors(images));
	const { toast } = useToast();
	const router = useRouter();

	const { mutate: createThumbnailTest } = useDetailedMutation(
		api.thumbnail_tests.createThumbnailTest,
		{
			onSuccess: (thumbnailTestId) => {
				toast({
					title: "Test Created!",
					description: `Thanks for creating a test!`,
				});
				router.push(`/tests/${thumbnailTestId}`);
			},
			onError: (error) => {
				toast({
					title: `Error creating test...`,
					variant: "destructive",
					description: (
						<div>
							{error.message}
							<UpgradeSubscriptionButton />
						</div>
					),
				});
			},
			onMutate: (params) => {
				toast({
					title: "Creating Test...",
				});
			},
		}
	);

	useEffect(() => {
		console.log({ images });
	}, [images]);

	return (
		<div className="mt-16">
			<h1 className="text-4xl font-bold mb-8">Create a Thumbnail</h1>
			<p className="text-lg max-w-md">
				Create your test Thumbnails so that other people can vote on
				their favorite and help you decide which one to use.
			</p>
			<form
				className="py-4"
				onSubmit={async (e) => {
					e.preventDefault();
					setErrors(() => defaultErrors(images));

					const form = e.target as HTMLFormElement;
					const formData = new FormData(form);
					const title = formData.get("title") as string;
					const formErrors = {
						...(!title && { title: "required" }),
						...(!images[0] && { aImage: "required" }),
						...(!images[1] && { bImage: "required" }),
					};
					setErrors((prev) => ({ ...prev, ...formErrors }));

					if (Object.keys(formErrors).length) {
						toast({
							title: "Error",
							description: "Please fill out all fields",
							variant: "destructive",
						});
						return;
					}

					createThumbnailTest({
						title,
						images,
					});
				}}
			>
				<div className="flex flex-col gap-4 mb-8">
					<Label htmlFor="title">Title</Label>
					<Input
						required
						id="title"
						name="title"
						type="text"
						placeholder="Label your Test for easy reference"
						className={clsx({
							"border-red-500 border-2 p-4": errors["title"],
						})}
					/>
				</div>
				<div className="grid grid-cols-2 gap-8 mb-8">
					{images.map((_, i) => (
						<ImageUploadForm
							key={i}
							title={`Image ${alphabet[i].toUpperCase()}`}
							index={i}
							images={images}
							setImages={setImages}
							errors={errors}
						/>
					))}
				</div>
				<Button>Create A/B Thumbnail Test</Button>
			</form>
		</div>
	);
}
