import Welcome from "@/components/layout/Welcome";
import { Suspense } from "react";

export default function WelcomePage() {
	return (
		<Suspense>
			<Welcome />
		</Suspense>
	);
}
