import styles from "@/components/domain/thursdays/Thursdays.module.css";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import { getFilteredThursdays } from "@/actions/thursdays";
import { getAllSemesters } from "@/actions/semesters";
import { auth } from "@/authentication";
import { FilterInput, FilterSelect } from "@/components/ui/Filters";

import ThursdayCard from "@/components/domain/thursdays/ThursdayCard";

export default async function Thursdays({ searchParams }) {
	const filters = await searchParams;

	const thursdays = await getFilteredThursdays(filters);

	const semesters = await getAllSemesters();
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;

	return (
		<>
			<Split
				start={<h2>Days</h2>}
				end={
					<>
						<FilterInput query={"thursdays"} />
						<FilterSelect filter={"semester"} options={semesters} defaultValue={filters?.semester ?? null} />
						{isAdmin && <Button href="/thursdays/add">Add Day</Button>}
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
				{thursdays.length < 1 ? (
					<>There are no results for {filters?.thursdays}.</>
				) : (
					<div className={styles.ThursdaysGrid}>
						{thursdays.map((thursday) => {
							return <ThursdayCard key={thursday.id} thursday={thursday} isAdmin={isAdmin} />;
						})}
					</div>
				)}
			</div>
		</>
	);
}
