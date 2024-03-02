import { type ReactNode } from "react";

export function P({ children }: { children: ReactNode }) {
	return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
