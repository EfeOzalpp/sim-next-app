"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin, getAuthSession } from "@/actions/auth";
import { getAllSemesters as getAllSemestersUtil, action } from "@/actions/utilities";
import { UserSchema, UserInput, FilterSchema, FilterInputValues } from "@/components/forms/schemas";
import { Prisma } from "@prisma/client";

export async function getAllSemesters() {
	return await getAllSemestersUtil();
}

export async function getUser(id: string) {
	return await action(async () => {
		const user = await prisma.user.findUnique({
			where: { id: id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				pronouns: true,
				link: true,
				about: true,
				admin: true,
				semesters: {
					select: { id: true, name: true }
				},
				presentations: { 
					include: { 
						presenters: {
							select: {
								id: true,
								name: true,
							}
						},
						production: {
							select: {
								thursday_id: true,
							}
						}
					} 
				},
				// Exclude productions as they aren't used in the main profile view currently
			}
		});
		if (!user) throw new Error("User not found");
		return user;
	});
}

export async function getAllUsers() {
	return await action(async () => {
		return await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				admin: true,
				// Removed productions and semesters as they are not needed for user selection lists
			},
			orderBy: { name: "asc" }
		});
	});
}

export async function getFilteredUsers(rawFilters: any) {
	return await action(async () => {
		noStore();

		const validation = FilterSchema.safeParse(rawFilters);
		const validatedFilters = validation.success ? validation.data : {};

		const filters = {
			semesterId: Array.isArray(validatedFilters.semesterId) ? validatedFilters.semesterId[0] : validatedFilters.semesterId,
			user: Array.isArray(validatedFilters.user) ? validatedFilters.user[0] : validatedFilters.user,
			semester: Array.isArray(validatedFilters.semester) ? validatedFilters.semester[0] : validatedFilters.semester,
		};

		let semesterQuery: Prisma.UserWhereInput = {};

		if (filters.semesterId && filters.semesterId !== "All") {
			semesterQuery = { semesters: { some: { id: filters.semesterId } } };
		} else if (filters.semester && filters.semester !== "All") {
			// Fallback for legacy name-based filtering
			semesterQuery = { semesters: { some: { name: { contains: filters.semester } } } };
		} else if (!filters.semesterId && !filters.semester) {
			// Default to first semester if no filter provided
			const semesters = await getAllSemestersUtil();
			if (semesters.length > 0) {
				semesterQuery = { semesters: { some: { id: semesters[0].id } } };
			}
		}

		const userSearch = filters.user || "";

		return await prisma.user.findMany({
			where: {
				OR: [{ name: { contains: userSearch, mode: "insensitive" } }],
				AND: semesterQuery,
			},
			orderBy: {
				name: "asc",
			},
			select: {
				id: true,
				name: true,
				image: true,
				admin: true,
			},
		});
	});
}

export async function editUser(formData: UserInput) {
	return await action(async () => {
		const validation = UserSchema.safeParse(formData);
		if (!validation.success) {
			throw new Error(validation.error.issues[0].message);
		}
		const validatedFields = validation.data;
		const { id, name, about, image, email, link, pronouns, admin, semesterIds } = validatedFields;
		
		const { user: currentUser, isAdmin } = await getAuthSession();
		
		// Permission check: Admin or user editing themselves
		if (!isAdmin && currentUser?.id !== id) {
			throw new Error("Unauthorized: You can only edit your own profile.");
		}

		// Only admins can change admin status or semesters
		const data: Prisma.UserUpdateInput = { name, about, image, link, pronouns, email };
		if (isAdmin) {
			data.admin = admin;
			if (semesterIds) {
				data.semesters = {
					set: semesterIds.map(id => ({ id }))
				};
			}
		}

		try {
			const updatedUser = await prisma.user.update({
				where: { id: id! },
				data,
			});
			revalidatePath(`/users/${updatedUser.id}`);
			revalidatePath("/admin");
			return updatedUser;
		} catch (error: any) {
			if (error instanceof Error && (error as any).code === "P2002") {
				throw new Error("A user with this email already exists.");
			}
			throw error;
		}
	});
}

export async function addUser(formData: UserInput) {
	return await action(async () => {
		await ensureAdmin();

		const validation = UserSchema.safeParse(formData);
		if (!validation.success) {
			throw new Error(validation.error.issues[0].message);
		}
		const validatedFields = validation.data;
		const { semesterIds, ...userData } = validatedFields;

		try {
			const newUser = await prisma.user.create({
				data: {
					...userData,
					semesters: {
						connect: semesterIds?.map(id => ({ id })) || []
					}
				},
			});
			revalidatePath("/admin");
			return newUser;
		} catch (error: any) {
			if (error instanceof Error && (error as any).code === "P2002") {
				throw new Error("A user with this email already exists.");
			}
			throw error;
		}
	});
}

export async function removeUser(user: any) {
	return await action(async () => {
		await ensureAdmin();

		await prisma.user.delete({
			where: { id: user.id },
		});

		revalidatePath("/admin");
		return { success: true };
	});
}

export async function handleImageUpload(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString("base64");
	return `data:${file.type};base64,${base64}`;
}
