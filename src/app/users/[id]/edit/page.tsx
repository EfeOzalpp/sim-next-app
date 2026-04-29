import { notFound, redirect } from "next/navigation";

import UserForm from "@/components/forms/user/UserForm";

import { auth } from "@/authentication";

import {
  handleImageUpload,
  getUser,
  editUser,
  removeUser,
  getAllSemesters,
} from "@/actions/users";
import { getCurrentUser } from "@/actions/auth";

interface EditUserProps {
  params: Promise<{ id: string }>;
}

export default async function EditUser({ params }: EditUserProps) {
  const { id } = await params;
  const result = await getUser(id);
  if (!result.success) {
    notFound();
  }
  const user = result.data;
  // Get the user data of the user you are signed in as.
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  const session = await auth();
  const isAdmin = session?.user?.admin ?? false;
  const semesters = await getAllSemesters();

  async function onSubmitEditUser(data: any) {
    "use server";

    let image_path = data.image;

    if (data.image && typeof data.image === "object" && data.image.size > 0) {
      image_path = await handleImageUpload(data.image);
      data.image = image_path;
    }

    const result = await editUser(data);
    if (result.success) {
      redirect(`/users/${result.data.id}`);
    }
    return result;
  }

  async function onSubmitRemoveUser(data: any) {
    "use server";
    const result = await removeUser(data);
    if (result.success) {
      redirect("/");
    }
    return result;
  }

  return (
    <div>
      <h2>Edit User</h2>
      <UserForm
        onSubmit={onSubmitEditUser}
        onRemove={onSubmitRemoveUser}
        user={user}
        isCurrentUserAdmin={isAdmin}
        allSemesters={semesters}
      />
    </div>
  );
}
