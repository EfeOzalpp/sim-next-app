import { redirect } from "next/navigation";
import UserForm from "@/components/forms/user/UserForm";
import { addUser, handleImageUpload } from "@/actions/users";

import { auth } from "@/authentication";

export default async function AddUser() {
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;
	async function onSubmitAddUser(data) {
		"use server";
		const username = data.email.split("@")[0];
		data.username = username;

		if (data.image && typeof data.image === "object" && data.image.size > 0) {
			const imagePath = await handleImageUpload(data.image);
			data.image = imagePath;
		} else if (typeof data.image === "string" && data.image.startsWith("data:")) {
			// Already base64 from the client-side fetch/processing
		} else {
			data.image = "/face.jpg";
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
