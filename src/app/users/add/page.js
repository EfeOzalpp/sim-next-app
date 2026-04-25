import { redirect } from "next/navigation";
import UserForm from "@/components/users/UserForm";
import { handleImageUpload } from "@/server/general";
import { addUser } from "@/server/admin";
import path from "path";
import { copyFile } from "fs/promises";

import { auth } from "@/server/auth/config";

export default async function AddUser() {
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;
	async function onSubmitAddUser(data) {
		"use server";
		const username = data.email.split("@")[0];
		data.username = username;

		if (data.image && typeof data.image === "object") {
			const imagePath = await handleImageUpload(data.image, username, "faces");
			data.image = imagePath;
		} else {
			const ext = "jpg";
			const filename = `${username}.${ext}`;
			const src = path.join(process.cwd(), "public/faces/default.jpg");
			const dest = path.join(process.cwd(), "public/faces", filename);
			await copyFile(src, dest);
			data.image = `/faces/${filename}`;
		}

		await addUser(data);
		redirect(`/users/${username}`);
	}

	if (isAdmin) {
		return (
			<div>
				<h2>Add User</h2>
				<UserForm onSubmit={onSubmitAddUser} isCurrentUserAdmin={isAdmin} />
			</div>
		);
	} else {
		redirect("/users/");
	}
}
