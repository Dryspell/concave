"use client";

import { useQuery } from "convex/react";
import {
	FunctionArgs,
	FunctionReference,
	FunctionReturnType,
} from "convex/server";
import React, { useRef } from "react";

export default function useDetailedQuery<
	QueryType extends FunctionReference<"query", "public", any, any>
>(
	query: Parameters<typeof useQuery<QueryType>>[0],
	queryParams: FunctionArgs<QueryType>,
	options?: {
		onSuccess?: (result: FunctionReturnType<QueryType>) => void;
		onQuery?: (queryParams: FunctionArgs<QueryType>) => void;
	}
) {
	const queryResult = useQuery(query, ...queryParams);
	const storedResult = useRef(queryResult);
	const [isLoading, setIsLoading] = React.useState(false);

	if (queryResult !== undefined) {
		storedResult.current = queryResult;
	}

	React.useEffect(() => {
		if (queryResult !== undefined) {
			setIsLoading(false);
			options?.onSuccess?.(queryResult);
		} else {
			setIsLoading(true);
			options?.onQuery?.(queryParams);
		}
	}, [options, queryParams, queryResult]);

	return { data: storedResult.current, isLoading: isLoading };
}
