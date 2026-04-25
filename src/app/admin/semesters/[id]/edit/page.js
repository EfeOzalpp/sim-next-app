import SemesterForm from "@/components/forms/semester/SemesterForm";

import { getSemester, editSemester, removeSemester } from "@/actions/semesters";
import { getAllUsers } from "@/actions/users";
import { isCurrentUserAdmin } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function EditSemester({ params }) {
	const { id } = await params;
	const semester = await getSemester(id);

	const users = await getAllUsers();
	const isAdmin = await isCurrentUserAdmin();

	async function onSubmitEditSemester(data) {
		"use server";
		await editSemester({ ...data, id });
		redirect("/admin");
	}

	async function onRemoveSemester(data) {
		"use server";
		await removeSemester(data);
		redirect("/admin");
	}

	return (
		<div>
			<h1>Edit Semester</h1>
			<SemesterForm 
				onSubmit={onSubmitEditSemester} 
				onRemove={onRemoveSemester}
				semester={semester} 
				users={users} 
				isCurrentUserAdmin={isAdmin}
			/>
		</div>
	);
}
