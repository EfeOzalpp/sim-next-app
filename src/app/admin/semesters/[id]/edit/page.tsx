import SemesterForm from "@/components/forms/semester/SemesterForm";
import { getSemester, editSemester, removeSemester } from "@/actions/semesters";
import { getAllUsers } from "@/actions/users";
import { isCurrentUserAdmin } from "@/actions/auth";
import { redirect, notFound } from "next/navigation";
import Split from "@/components/ui/Split";
import CloseButton from "@/components/ui/CloseButton";
import styles from "@/app/admin/semesters/[id]/edit/page.module.css";

interface EditSemesterProps {
	params: Promise<{ id: string }>;
}

export default async function EditSemester({ params }: EditSemesterProps) {
	const { id } = await params;
	const result = await getSemester(id);
	if (!result.success) {
		notFound();
	}
	const semester = result.success ? {
		...result.data,
		users: result.data.users.map(u => ({ ...u, name: u.name }))
	} : null;

	const usersResult = await getAllUsers();
	const users = usersResult.success ? usersResult.data.map((u: any) => ({ ...u, name: u.name })) : [];
	const isAdmin = await isCurrentUserAdmin();

	async function onSubmitEditSemester(data: any) {
		"use server";
		const result = await editSemester({ ...data, id });
		if (result.success) {
			redirect("/admin");
		}
		return result;
	}

	async function onRemoveSemester(data: any) {
		"use server";
		const result = await removeSemester(data);
		if (result.success) {
			redirect("/admin");
		}
		return result;
	}

	return (
		<>
			<Split
				className={styles.profileSplit}
				start={<h2>Edit Semester</h2>}
				end={<CloseButton href="/admin" />}
			/>
			<div className={styles.pageWrapper}>
				<div className="content-card">
					<SemesterForm
						onSubmit={onSubmitEditSemester}
						onRemove={onRemoveSemester}
						semester={semester}
						users={users}
						isCurrentUserAdmin={isAdmin}
					/>
				</div>
			</div>
		</>
	);
}
