import useDetailedAction from "@/hooks/useDetailedAction";
import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";

export default function UpgradeSubscriptionButton () {
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
		<Button disabled={paymentUrlLoading} onClick={handleUpgradeClick}>
			{!paymentUrlLoading ? "Upgrade" : "Loading..."}
		</Button>
  );
}