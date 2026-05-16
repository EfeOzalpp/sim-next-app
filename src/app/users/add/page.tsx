import { redirect } from "next/navigation";
import UserForm from "@/components/forms/user/UserForm";
import { addUser, handleImageUpload, getAllSemesters } from "@/actions/users";
import Split from "@/components/ui/Split";
import CloseButton from "@/components/ui/CloseButton";
import styles from "@/app/users/add/page.module.css";

import { auth } from "@/authentication";

export default async function AddUser() {
	const session = await auth();
	const isAdmin = session?.user?.role === "ADMIN";
	const semesters = await getAllSemesters();
	
	async function onSubmitAddUser(data: any) {
		"use server";

		if (data.image && typeof data.image === "object" && data.image.size > 0) {
			const imagePath = await handleImageUpload(data.image);
			data.image = imagePath;
		} else {
			data.image = "/face.jpg";
		}

		const result = await addUser(data);
		if (result.success) {
			redirect(`/users/${result.data.id}`);
		}
		return result;
	}

	if (isAdmin) {
		return (
			<>
				<Split
					className={styles.profileSplit}
					start={<h2>Add New User</h2>}
					end={<CloseButton href="/users" />}
				/>
				<div className={styles.pageWrapper}>
					<div className="content-card">
						<UserForm
							onSubmit={onSubmitAddUser}
							isCurrentUserAdmin={isAdmin}
							allSemesters={semesters}
						/>
					</div>
				</div>
			</>
		);
	} else {
		redirect("/users/");
	}
}
