"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin } from "@/actions/auth";
import { getAllSemesters as getAllSemestersUtil, action } from "@/actions/utilities";

export async function getAllSemesters() {
	return await getAllSemestersUtil();
}

export async function getWork(id) {
	return await prisma.work.findFirst({
		where: { id: id },
		include: { 
			group: true, 
			presenters: { select: { id: true, name: true, username: true, image: true } } 
		},
	});
}

export async function getAllWorks() {
	return await action(async () => {
		return await prisma.work.findMany({
			select: {
				id: true,
				name: true,
				image: true,
				presenters: { select: { id: true, name: true } },
				group: { select: { id: true, name: true, thursday: { select: { date: true } } } },
			},
			orderBy: { name: "asc" }
		});
	});
}

export async function getFilteredWorks(filters) {
	noStore();

	let defaultSemester = { group: { thursday: { semester: { name: { contains: "" } } } } };

	if (filters.semester === undefined) {
		const semesters = await getAllSemesters();
		if (semesters.length > 0) {
			defaultSemester = { group: { thursday: { semester: { id: semesters[0].id } } } };
		}
	} else if (filters.semester !== "All") {
		defaultSemester = { group: { thursday: { semester: { name: { contains: filters.semester } } } } };
	}

	const search = filters.query || "";

	try {
		return await prisma.work.findMany({
			where: {
				OR: [{ name: { contains: search, mode: "insensitive" } }],
				AND: defaultSemester,
			},
			orderBy: {
				name: "asc",
			},
			select: {
				id: true,
				name: true,
				image: true,
				presenters: { select: { id: true, name: true, username: true, image: true } },
				group: { select: { id: true, name: true, thursday: { select: { date: true } } } },
			},
		});
	} catch (error) {
		console.error("Database error:", error);
		throw new Error(`Failed to get filtered works`);
	}
}

export async function editWork(data) {
	return await action(async () => {
		await ensureAdmin();

		await prisma.work.update({
			where: { id: data.id },
			data: {
				name: data.name,
				about: data.about,
				image: data.image,
				presenters: { set: data.users.map((id) => ({ id })) },
				group: { connect: { id: data.group } },
			},
		});

		revalidatePath("/thursdays");
		if (data.group) {
			revalidatePath(`/thursdays/${data.group}`);
		}
		return { success: true };
	});
}

export async function addWork(data) {
	return await action(async () => {
		await ensureAdmin();

		const work = await prisma.work.create({
			data: {
				name: data.name,
				about: data.about,
				image: data.image || "",
				presenters: {
					connect: data.presenters.map((id) => ({ id })),
				},
				group: {
					connect: { id: data.group },
				},
			},
		});
		revalidatePath(`/thursdays/${data.group}`);
		return work;
	});
}
