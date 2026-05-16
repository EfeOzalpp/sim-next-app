import { notFound } from "next/navigation";

import ThursdayForm from "@/components/forms/thursday/ThursdayForm";
import { getThursday, updateThursdayWithProductions, removeThursday } from "@/actions/thursdays";
import { getAllUsers } from "@/actions/users";
import { getAllSemesters } from "@/actions/semesters";
import { isCurrentUserAdmin } from "@/actions/auth";
import { redirect } from "next/navigation";
import Split from "@/components/ui/Split";
import CloseButton from "@/components/ui/CloseButton";
import styles from "@/app/thursdays/[id]/edit/page.module.css";

interface EditThursdayProps {
	params: Promise<{ id: string }>;
}

export default async function EditThursday({ params }: EditThursdayProps) {
	const { id } = await params;

	const result = await getThursday(id);

	if (!result.success) {
		notFound();
	}
	const thursday = result.data;

	const usersResult = await getAllUsers();
	const users = usersResult.success ? usersResult.data : [];
	const semestersResult = await getAllSemesters();
	const semesters = semestersResult.success ? semestersResult.data : [];
	const isAdmin = await isCurrentUserAdmin();

	async function onSubmit(data: any) {
		"use server";
		const result = await updateThursdayWithProductions({ ...data, id: id });
		if (result.success) {
			redirect(`/thursdays/${id}`);
		}
		return result;
	}

	async function onRemove(data: any) {
		"use server";
		const result = await removeThursday(data);
		if (result.success) {
			redirect("/thursdays");
		}
		return result;
	}

	return (
		<>
			<Split
				className={styles.profileSplit}
				start={<h2>Edit Day</h2>}
				end={<CloseButton href={`/thursdays/${id}`} />}
			/>
			<div className={styles.pageWrapper}>
				<div className="content-card">
					<ThursdayForm
						defaultValues={thursday}
						users={users}
						semesters={semesters}
						thursdayId={id}
						onSubmit={onSubmit}
						onRemove={onRemove}
						isCurrentUserAdmin={isAdmin}
					/>
				</div>
			</div>
		</>
	);
}
