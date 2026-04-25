import ThursdayForm from "@/components/forms/thursday/ThursdayForm";
import { getAllUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { createThursdayWithGroups } from "@/actions/thursdays";
import { redirect } from "next/navigation";

export default async function AddThursday() {
	const users = await getAllUsers();
	const semesters = await getAllSemesters();

	async function onSubmit(data) {
		"use server";
		await createThursdayWithGroups(data);
		redirect("/thursdays");
	}

	return (
		<div>
			<h1>Add New Day</h1>
			<ThursdayForm
				users={users}
				semesters={semesters}
				onSubmit={onSubmit}
			/>
		</div>
	);
}