import { Button } from "@/components/ui/button";
import {
	Tooltip as ShadTooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ReactNode } from "react";

export default function Tooltip({
	title,
	side = "top",
	delayDuration = 0,
	children,
}: {
	title: string;
	side?: "top" | "bottom" | "left" | "right";
	delayDuration?: number;
	children: ReactNode;
}) {
	return (
		<TooltipProvider>
			<ShadTooltip delayDuration={delayDuration}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side}>
					<p>{title}</p>
				</TooltipContent>
			</ShadTooltip>
		</TooltipProvider>
	);
}
