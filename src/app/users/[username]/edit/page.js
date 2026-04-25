import { notFound, redirect } from "next/navigation";

import UserForm from "@/components/forms/user/UserForm";

import { auth } from "@/authentication";

import { handleImageUpload, getUser, editUser, removeUser } from "@/actions/users";
import { getCurrentUser } from "@/actions/auth";

export default async function EditUser({ params }) {
	const { username } = await params;
	const user = await getUser(username);
	if (!user) {
		notFound();
	}
	// Get the user data of the user you are signed in as.
	const currentUser = await getCurrentUser();
	if (!currentUser) return;
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;
	return (
		<div>
			<h1>{user.name}</h1>
			<div>
				<h2>Edit User</h2>
				<UserForm onSubmit={onSubmitEditUser} onRemove={onSubmitRemoveUser} user={user} isCurrentUserAdmin={isAdmin} />
			</div>
		</div>
	);
}

async function onSubmitEditUser(data) {
	"use server";

	let image_path = data.image;

	if (data.image && typeof data.image === "object" && data.image.size > 0) {
		image_path = await handleImageUpload(data.image);
		data.image = image_path;
	} else if (typeof data.image === "string" && data.image.startsWith("data:")) {
		// Already base64
	}

	await editUser(data);

	redirect(`/users/${data.username}`);
}

async function onSubmitRemoveUser(data) {
	"use server";
	removeUser(data);
	redirect("/");
}
