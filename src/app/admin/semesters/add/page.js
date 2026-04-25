import SemesterForm from "@/components/forms/semester/SemesterForm";

import { getAllSemesters, addSemester } from "@/actions/semesters";
import { getAllUsers } from "@/actions/users";
import { redirect } from "next/navigation";

export default async function AddSemester() {
	const semesters = await getAllSemesters();

	const usersFromCurrentSemester = semesters[0].users;

	const users = await getAllUsers();

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
	addSemester(data);
	redirect("/admin");
}

function generateThursdays(dates) {
	// Put all Thursdays inbetween the start and end Thursday into an array.

	const thursdays = [];

	let day = new Date(dates[0].setDate(dates[0].getDate() - 1));

	while (day <= dates[1]) {
		if (day.getDay() == 4) {
			thursdays.push(new Date(day));
		}

		var newDay = day.setDate(day.getDate() + 1);
		day = new Date(newDay);
	}

	return thursdays;
}
