import { notFound } from "next/navigation";

import ThursdayForm from "@/components/forms/thursday/ThursdayForm";
import { getThursday, updateThursdayWithGroups, removeThursday } from "@/actions/thursdays";
import { getAllUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { isCurrentUserAdmin } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function EditThursday({ params }) {
	const { thursday_id } = await params;

	const thursday = await getThursday(thursday_id);

	if (!thursday) {
		notFound();
	}

	const users = await getAllUsers();
	const semesters = await getAllSemesters();
	const isAdmin = await isCurrentUserAdmin();

	async function onSubmit(data) {
		"use server";
		await updateThursdayWithGroups({ ...data, id: thursday_id });
		redirect(`/thursdays/${thursday_id}`);
	}

	async function onRemove(data) {
		"use server";
		await removeThursday(data);
		redirect("/thursdays");
	}

	return (
		<div>
			<h1>Edit Day</h1>
			<ThursdayForm
				defaultValues={thursday}
				users={users}
				semesters={semesters}
				thursdayId={thursday_id}
				onSubmit={onSubmit}
				onRemove={onRemove}
				isCurrentUserAdmin={isAdmin}
			/>
		</div>
	);
}
