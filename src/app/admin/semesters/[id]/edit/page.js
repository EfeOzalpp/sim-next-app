import SemesterForm from "../../../../../components/admin/semesters/SemesterForm";

import { getSemester, getAllUsers } from "@/server/general";
import { editSemester } from "@/server/admin";
import { redirect } from "next/navigation";

export default async function EditSemester({ params }) {
	const { id } = await params;
	const semester = await getSemester(id);

	const users = await getAllUsers();
	users.map((user) => {
		user.key = user.id;
	});

	return (
		<div>
			<h1>Edit Semester</h1>
			<SemesterForm onSubmit={onSubmitEditSemester} semester={semester} users={users} />
		</div>
	);
}

async function onSubmitEditSemester(data) {
	"use server";
	await editSemester(data);
	redirect("/admin");
}
