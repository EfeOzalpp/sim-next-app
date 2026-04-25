import { notFound, redirect } from "next/navigation";

import GroupForm from "../../../../../../components/thursdays/groups/GroupForm";

import { getAllUsers, getAllWorks } from "@/server/general";
import { getGroup, getAllSemesters } from "@/server/shared";
import { editGroup } from "@/server/admin";

export default async function EditGroup({ params }) {
	const { group_id } = await params;

	const group = await getGroup(group_id);

	if (!group) {
		notFound();
	}

	const users = await getAllUsers();
	users.map((user) => {
		user.key = user.id;
	});

	const works = await getAllWorks();
	works.map((work) => {
		work.key = work.id;
	});

	const semesters = await getAllSemesters();
	const thursdays = [];
	semesters.map((semester) => {
		thursdays.push({
			value: semester.id,
			label: semester.name,
			children: semester.thursdays.map((thursday) => ({ value: thursday.id, label: `${thursday.name} (${thursday.date.toLocaleDateString()})` })),
		});
	});

	return (
		<div>
			<h1>Edit Group</h1>
			<GroupForm onSubmit={onSubmitEditGroup} group={group} thursday={group.thursday} users={users} presentations={works} thursdays={thursdays} />
		</div>
	);
}

async function onSubmitEditGroup(data) {
	"use server";
	editGroup(data);
	redirect(`/thursdays/${data.thursday}`);
}
