// import styles
import styles from "../../components/admin/semesters/semesters.module.css";
import Link from "next/link";
import { getFilteredUsers, getAllSemesters, getFilteredThursdays } from "@/server/shared";
import { getSemesterFromName } from "@/server/general";

import Header from "../../components/Header";

import Select from "../../components/Select";

import UsersManager from "../../components/admin/semesters/UsersManager";
import ThursdaysManager from "../../components/admin/semesters/ThursdaysManager";

import Button from "../../components//Button";

export default async function Admin({ searchParams }) {
	const filters = await searchParams;

	const users = await getFilteredUsers(filters);
	const thursdays = await getFilteredThursdays(filters);

	const semesters = await getAllSemesters();

	const semester = await getSemesterFromName(filters.semester);

	return (
		<div>
			<Header label={<h2>Manage Semester</h2>}>
				<Select filter={"semester"} options={semesters} defaultValue={semesters[0]} />
				<Button href={`admin/semesters/${semester.id}/edit`}>Edit</Button>
				<Button href="admin/semesters/add">New Semester</Button>
			</Header>
			<br />
			<UsersManager
				query={"user"}
				users={users}
				filters={filters}
				button={
					<Button key={"NewUserButton"} href="/users/add">
						New User
					</Button>
				}
				semester={semester}
			/>
			<br />
			<ThursdaysManager query={"thursdays"} thursdays={thursdays} filters={filters} />
			<br />
		</div>
	);
}
