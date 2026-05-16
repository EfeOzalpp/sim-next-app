import ThursdayForm from "@/components/forms/thursday/ThursdayForm";
import { getAllUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { createThursdayWithProductions } from "@/actions/thursdays";
import { redirect } from "next/navigation";
import Split from "@/components/ui/Split";
import CloseButton from "@/components/ui/CloseButton";
import styles from "@/app/thursdays/add/page.module.css";

export default async function AddThursday() {
	const usersResult = await getAllUsers();
	const users = usersResult.success ? usersResult.data : [];
	const semestersResult = await getAllSemesters();
	const semesters = semestersResult.success ? semestersResult.data : [];

	async function onSubmit(data: any) {
		"use server";
		const result = await createThursdayWithProductions(data);
		if (result.success) {
			redirect("/thursdays");
		}
		return result;
	}

	return (
		<>
			<Split
				className={styles.profileSplit}
				start={<h2>Add New Day</h2>}
				end={<CloseButton href="/thursdays" />}
			/>
			<div className={styles.pageWrapper}>
				<div className="content-card">
					<ThursdayForm
						users={users}
						semesters={semesters}
						onSubmit={onSubmit}
					/>
				</div>
			</div>
		</>
	);
}
