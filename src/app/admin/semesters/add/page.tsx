import SemesterForm from "@/components/forms/semester/SemesterForm";
import { getAllSemesters, addSemester } from "@/actions/semesters";
import { getAllUsers } from "@/actions/users";
import { redirect } from "next/navigation";
import Split from "@/components/ui/Split";
import CloseButton from "@/components/ui/CloseButton";
import styles from "@/app/admin/semesters/add/page.module.css";

export default async function AddSemester() {
	const semestersResult = await getAllSemesters();
	const semesters = semestersResult.success ? semestersResult.data : [];

	const usersFromCurrentSemester = (semesters[0]?.users || []).map((u: any) => ({ ...u, name: u.name }));

	const usersResult = await getAllUsers();
	const users = usersResult.success ? usersResult.data.map((u: any) => ({ ...u, name: u.name })) : [];

	async function onSubmitAddSemester(data: any) {
		"use server";
		const result = await addSemester(data);
		if (result.success) {
			redirect("/admin");
		}
		return result;
	}

	return (
		<>
			<Split
				className={styles.profileSplit}
				start={<h2>Add Semester</h2>}
				end={<CloseButton href="/admin" />}
			/>
			<div className={styles.pageWrapper}>
				<div className="content-card">
					<SemesterForm
						onSubmit={onSubmitAddSemester}
						usersFromCurrentSemester={usersFromCurrentSemester}
						users={users}
					/>
				</div>
			</div>
		</>
	);
}
