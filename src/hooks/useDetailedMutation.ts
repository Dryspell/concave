"use client";

import { OptimisticUpdate } from "convex/browser";
import { useMutation } from "convex/react";
import {
	FunctionArgs,
	FunctionReference,
	FunctionReturnType,
} from "convex/server";
import React from "react";

export default function useDetailedMutation<
	MutationType extends FunctionReference<"mutation", "public", any, any>
>(
	mutation: Parameters<typeof useMutation<MutationType>>[0],
	options?: {
		onSuccess?: (result: FunctionReturnType<MutationType>) => void;
		onMutate?: (mutationParams: FunctionArgs<MutationType>) => void;
		onError?: (error: Error) => void;
		optimisticUpdate?: OptimisticUpdate<FunctionArgs<MutationType>>;
	}
) {
	const doMutation = useMutation(mutation).withOptimisticUpdate(
		options?.optimisticUpdate ?? (() => {})
	);
	const [isLoading, setIsLoading] = React.useState(false);
	const [data, setData] =
		React.useState<FunctionReturnType<MutationType>>(undefined);

	const mutate = React.useCallback(
		(mutationParams: FunctionArgs<MutationType>) => {
			options?.onMutate?.(mutationParams);
			setIsLoading(() => true);

			doMutation(mutationParams)
				.then((mutationResult) => {
					setData(() => mutationResult);
					options?.onSuccess?.(mutationResult);
					setIsLoading(() => false);
				})
				.catch((error: Error) => {
					options?.onError?.(error);
					setIsLoading(() => false);
				});
		},
		[doMutation, options?.onError, options?.onSuccess, options?.onMutate]
	);

	return { data: data, isLoading: isLoading, mutate };
}
