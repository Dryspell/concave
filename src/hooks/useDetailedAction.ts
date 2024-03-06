"use client";

import { useAction } from "convex/react";
import {
	FunctionReference,
	FunctionReturnType,
	FunctionArgs,
} from "convex/server";
import React from "react";

export default function useDetailedAction<
	ActionType extends FunctionReference<"action", "public", any, any>
>(
	action: Parameters<typeof useAction<ActionType>>[0],
	{
		onSuccess,
		onMutate,
		onError,
	}: {
		onSuccess?: (result: FunctionReturnType<ActionType>) => void;
		onMutate?: (actionParams: FunctionArgs<ActionType>) => void;
		onError?: (error: Error) => void;
	}
) {
	const doAction = useAction(action);
	const [isLoading, setIsLoading] = React.useState(false);
	const [data, setData] =
		React.useState<FunctionReturnType<ActionType>>(undefined);

	const mutate = React.useCallback(
		(...actionParams: FunctionArgs<ActionType>) => {
			onMutate?.(actionParams);
			setIsLoading(() => true);

			doAction(...actionParams)
				.then((actionResult) => {
					setData(() => actionResult);
					onSuccess?.(actionResult);
					setIsLoading(() => false);
				})
				.catch((error: Error) => {
					onError?.(error);
					setIsLoading(() => false);
				});
		},
		[doAction, onError, onSuccess, onMutate]
	);

	return { data: data, isLoading: isLoading, mutate };
}
