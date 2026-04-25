"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin, getAuthSession } from "@/actions/auth";
import { getAllSemesters as getAllSemestersUtil, action } from "@/actions/utilities";
import { UserSchema } from "@/components/forms/schemas";

export async function getAllSemesters() {
	return await getAllSemestersUtil();
}

export async function getUser(username) {
	return await prisma.user.findFirst({
		where: { username: username },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			image: true,
			pronouns: true,
			link: true,
			about: true,
			admin: true,
			presentations: { 
				include: { 
					presenters: {
						select: {
							id: true,
							name: true,
							username: true,
							image: true
						}
					} 
				} 
			},
			productions: true,
		}
	});
}

export async function getAllUsers() {
	return await action(async () => {
		return await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				image: true,
				admin: true,
				productions: true,
				semesters: true,
			},
			orderBy: { name: "asc" }
		});
	});
}

export async function getFilteredUsers(filters) {
	noStore();

	let defaultSemester = { semesters: { some: { name: { contains: "" } } } };

	if (filters.semester === undefined) {
		const semesters = await getAllSemesters();
		if (semesters.length > 0) {
			defaultSemester = { semesters: { some: { id: semesters[0].id } } };
		}
	} else if (filters.semester !== "All") {
		defaultSemester = { semesters: { some: { name: { contains: filters.semester } } } };
	}

	const userSearch = filters.user || "";

	try {
		return await prisma.user.findMany({
			where: {
				OR: [{ name: { contains: userSearch, mode: "insensitive" } }],
				AND: defaultSemester,
			},
			orderBy: {
				name: "asc",
			},
			select: {
				id: true,
				name: true,
				username: true,
				image: true,
				productions: true,
				presentations: true,
				semesters: true,
			},
		});
	} catch (error) {
		console.error("Database error:", error);
		throw new Error(`Failed to get filtered users`);
	}
}

export async function editUser(formData) {
	return await action(async () => {
		const validatedFields = UserSchema.parse(formData);
		const { id, name, about, image, email, link, pronouns, admin } = validatedFields;
		
		const { user: currentUser, isAdmin } = await getAuthSession();
		
		// Permission check: Admin or user editing themselves
		if (!isAdmin && currentUser?.id !== id) {
			throw new Error("Unauthorized: You can only edit your own profile.");
		}

		// Only admins can change admin status
		const data = { name, about, image, link, pronouns, email };
		if (isAdmin) {
			data.admin = admin;
		}

		try {
			const updatedUser = await prisma.user.update({
				where: { id },
				data,
			});
			revalidatePath(`/users/${updatedUser.username}`);
			revalidatePath("/admin");
			return updatedUser;
		} catch (error) {
			if (error.code === "P2002") {
				throw new Error("A user with this email already exists.");
			}
			throw error;
		}
	});
}

export async function addUser(formData) {
	return await action(async () => {
		await ensureAdmin();
		const validatedFields = UserSchema.parse(formData);
		
		const current_semester = await getAllSemesters();

		try {
			const user = await prisma.user.create({
				data: {
					email: validatedFields.email,
					username: validatedFields.email.split("@")[0],
					image: validatedFields.image,
					name: validatedFields.name,
					about: validatedFields.about?.trim() || "I'm new to SIM!",
					link: validatedFields.link,
					pronouns: validatedFields.pronouns,
					semesters: { connect: { id: current_semester[0].id } },
					admin: validatedFields.admin,
				},
			});
			revalidatePath("/admin");
			return user;
		} catch (error) {
			if (error.code === "P2002") {
				throw new Error("A user with this email already exists.");
			}
			throw error;
		}
	});
}

export async function removeUser(data) {
	return await action(async () => {
		await ensureAdmin();

		await prisma.user.delete({
			where: {
				id: data.id,
			},
		});
		revalidatePath("/admin");
		return { success: true };
	});
}

export async function handleImageUpload(file) {
	if (!file || !(file instanceof Blob)) return null;

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	const mimeType = file.type || "image/jpeg";
	const base64 = buffer.toString("base64");

	return `data:${mimeType};base64,${base64}`;
}
