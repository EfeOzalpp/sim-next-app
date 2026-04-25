import SemesterForm from "../../../../components/admin/semesters/SemesterForm";

import { getAllSemesters } from "@/server/shared";
import { getAllUsers } from "@/server/general";
import { addSemester } from "@/server/admin";
import { redirect } from "next/navigation";

export default async function AddSemester() {
	const semesters = await getAllSemesters();

	const usersFromCurrentSemester = semesters[0].users;
	usersFromCurrentSemester.map((user) => {
		user.key = user.id;
	});

	const users = await getAllUsers();
	users.map((user) => {
		user.key = user.id;
	});

	return (
		<div>
			<h1>Add Semester</h1>
			<SemesterForm onSubmit={onSubmitAddSemester} usersFromCurrentSemester={usersFromCurrentSemester} users={users} />
		</div>
	);
}

async function onSubmitAddSemester(data) {
	"use server";
	data.dates = generateThursdays(data.dates);
	await addSemester(data);
	redirect("/admin");
}

function generateThursdays(dates) {
	// Put all Thursdays inbetween the start and end Thursday into an array.

	const thursdays = [];

	let day = new Date(dates[0].setDate(dates[0].getDate() - 1));

	while (day <= dates[1]) {
		if (day.getDay() == 3) {
			thursdays.push(day);
		}

		var newDay = day.setDate(day.getDate() + 1);
		day = new Date(newDay);
	}

	return thursdays;
}
