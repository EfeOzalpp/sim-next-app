import styles from "../../components/thursdays/thursdays.module.css";
import Button from "@/components//Button";
import { getFilteredThursdays, getAllSemesters } from "@/server/shared";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Content from "@/components/Content";

import ThursdayCard from "../../components/ThursdayCard";

export default async function Thursdays({ searchParams }) {
	const filters = await searchParams;

	const thursdays = await getFilteredThursdays(filters);

	const semesters = await getAllSemesters();
	return (
		<>
			<Header label={<h2>Thursdays</h2>}>
				<Input query={"thursdays"} />
				<Select filter={"semester"} options={semesters} defaultValue={filters?.semester ?? null} />
			</Header>
			<Content>
				{thursdays.length < 1 ? (
					<>There are no results for {filters?.thursdays}.</>
				) : (
					<div className={styles.ThursdaysGrid}>
						{thursdays.map((thursday) => {
							return <ThursdayCard key={thursday.id} thursday={thursday} />;
						})}
					</div>
				)}
			</Content>
		</>
	);
}
