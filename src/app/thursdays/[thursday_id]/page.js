import { notFound } from "next/navigation";

import { getThursday } from "@/actions/thursdays";

import ThursdayCard from "@/components/domain/thursdays/ThursdayCard";

export default async function Thursday({ params }) {
	// Get the user data of the user you are looking at.
	const { thursday_id } = await params;
	const thursday = await getThursday(thursday_id);

	if (!thursday) {
		notFound();
	}

	return <ThursdayCard thursday={thursday} />;
}
