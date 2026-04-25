import { notFound, redirect } from "next/navigation";

import ThursdayForm from "../../../../components/thursdays/ThursdayForm";

import { getAllGroups } from "@/server/general";
import { getThursday, getAllSemesters } from "@/server/shared";
import { editThursday } from "@/server/admin";

export default async function EditThursday({ params }) {
	const { thursday_id } = await params;

	const thursday = await getThursday(thursday_id);

	if (!thursday) {
		notFound();
	}

	const groups = await getAllGroups();
	groups.map((group) => {
		group.key = group.id;
	});

	const semesters = await getAllSemesters();
	const semester_ids = [];
	semesters.map((semester) => {
		semester_ids.push({
			value: semester.id,
			label: semester.name,
		});
	});

	return (
		<div>
			<h1>Edit Thursday</h1>
			<ThursdayForm onSubmit={onSubmitEditThursday} thursday={thursday} semester_ids={semester_ids} groups={groups} />
		</div>
	);
}

async function onSubmitEditThursday(data) {
	"use server";
	editThursday(data);
	redirect(`/thursdays/${data.id}`);
}
