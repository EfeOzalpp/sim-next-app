import { getFilteredUsers, getAllSemesters } from "@/server/shared";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";

import styles from "../../components/users/Users.module.css";
import UserCard from "../../components/users/UserCard";

import { auth } from "@/server/auth/config";

export default async function Users({ searchParams }) {
	const filters = await searchParams;
	const users = await getFilteredUsers(filters);
	const semesters = await getAllSemesters();
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;
	return (
		<>
			<Header label={<h2>Names & Faces</h2>}>
				{isAdmin && <Button href="/users/add">New User</Button>}
				<Input query={"user"} />
				<Select filter={"semester"} options={semesters} defaultValue={filters?.semester ?? null} />
			</Header>
			<div
				style={{
					margin: "1rem",
					padding: "1rem",
					backgroundColor: "rgba(211, 211, 211, 0.75)", // lightgrey with 0.8 opacity
					borderRadius: "0.33rem",
				}}
			>
				{users.length < 1 ? (
					<div>There are no results for User {filters?.user}</div>
				) : (
					<div className={styles.UsersGrid}>
						{users.map((user) => {
							return <UserCard key={user.id} user={user} />;
						})}
					</div>
				)}
			</div>
		</>
	);
}
