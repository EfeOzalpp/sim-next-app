import { getFilteredUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { Button } from "@/components/ui/AntD";
import { FilterInput, FilterSelect } from "@/components/ui/Filters";
import Split from "@/components/ui/Split";

import styles from "@/components/domain/users/Users.module.css";
import UserCard from "@/components/domain/users/UserCard";

import { auth } from "@/authentication";

export default async function Users({ searchParams }) {
	const filters = await searchParams;
	const users = await getFilteredUsers(filters);
	const semesters = await getAllSemesters();
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;
	return (
		<>
			<Split
				start={<h2>Names & Faces</h2>}
				end={
					<>
						{isAdmin && <Button href="/users/add">New User</Button>}
						<FilterInput query={"user"} />
						<FilterSelect filter={"semester"} options={semesters} defaultValue={filters?.semester ?? null} />
					</>
				}
			/>
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
