import ThursdayForm from "@/components/forms/thursday/ThursdayForm";
import { getAllUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { createThursdayWithProductions } from "@/actions/thursdays";
import { redirect } from "next/navigation";

export default async function AddThursday() {
	const usersResult = await getAllUsers();
	const users = usersResult.success ? usersResult.data : [];
	const semestersResult = await getAllSemesters();
	const semesters = semestersResult.success ? semestersResult.data : [];

	async function onSubmit(data: any) {
		"use server";
		const result = await createThursdayWithProductions(data);
		if (result.success) {
			redirect("/thursdays");
		}
		return result;
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
