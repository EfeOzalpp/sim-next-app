import { notFound } from "next/navigation";

import ThursdayForm from "@/components/forms/thursday/ThursdayForm";
import { getThursday, updateThursdayWithProductions, removeThursday } from "@/actions/thursdays";
import { getAllUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { isCurrentUserAdmin } from "@/actions/auth";
import { redirect } from "next/navigation";

interface EditThursdayProps {
	params: Promise<{ id: string }>;
}

export default async function EditThursday({ params }: EditThursdayProps) {
	const { id } = await params;

	const result = await getThursday(id);

	if (!result.success) {
		notFound();
	}
	const thursday = result.data;

	const usersResult = await getAllUsers();
	const users = usersResult.success ? usersResult.data : [];
	const semestersResult = await getAllSemesters();
	const semesters = semestersResult.success ? semestersResult.data : [];
	const isAdmin = await isCurrentUserAdmin();

	async function onSubmit(data: any) {
		"use server";
		const result = await updateThursdayWithProductions({ ...data, id: id });
		if (result.success) {
			redirect(`/thursdays/${id}`);
		}
		return result;
	}

	async function onRemove(data: any) {
		"use server";
		const result = await removeThursday(data);
		if (result.success) {
			redirect("/thursdays");
		}
		return result;
	}

	return (
		<div>
			<h1>Edit Day</h1>
			<ThursdayForm
				defaultValues={thursday}
				users={users}
				semesters={semesters}
				thursdayId={id}
				onSubmit={onSubmit}
				onRemove={onRemove}
				isCurrentUserAdmin={isAdmin}
			/>
		</div>
	);
}
