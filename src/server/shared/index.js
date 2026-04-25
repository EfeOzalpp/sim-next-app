"use server";

import { prisma } from "@/server/database";

import { unstable_noStore as noStore } from "next/cache";

export async function getFilteredUsers(filters) {
	noStore();

	let defaultSemester = { semesters: { some: { name: { contains: "" } } } };

	if (filters.semester == undefined) {
		const semesters = await getAllSemesters();
		defaultSemester = { semesters: { some: { id: semesters[0].id } } };
	} else if (filters.semester != "All") {
		defaultSemester = { semesters: { some: { name: { contains: filters.semester } } } };
	}

	if (filters.user === undefined) {
		filters.user = "";
	}

	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [{ name: { contains: `${filters.user}`, mode: "insensitive" } }],
				AND: defaultSemester,
			},
			orderBy: {
				name: "asc",
			},
			include: {
				productions: true,
				presentations: true,
				semesters: true,
			},
		});

		return users;
	} catch (error) {
		console.error("Database error!!!:", error);
		throw new Error(`Failed to get filtered users with filters: ${filters}`);
	}
}

export async function getUser(username) {
	const user = await prisma.user.findFirst({
		where: { username: username },
		include: { presentations: { include: { presenters: true } }, productions: true },
	});
	return user;
}

export async function getThursday(id) {
	const thursday = await prisma.thursday.findFirst({
		where: { id: id },
		include: { groups: { include: { producers: true, presentations: { include: { presenters: true } } } } },
	});
	return thursday;
}

export async function getGroup(id) {
	const group = await prisma.group.findFirst({
		where: { id: id },
		include: { producers: true, presentations: { include: { presenters: true } }, thursday: true },
	});
	return group;
}

export async function getAllSemesters() {
	try {
		const semesters = await prisma.semester.findMany({
			include: { thursdays: { include: { groups: true } }, users: true },
		});

		semesters.sort((a, b) => {
			const aFirstThursdayDate = a.thursdays.length > 0 ? a.thursdays[0].date : Infinity;
			const bFirstThursdayDate = b.thursdays.length > 0 ? b.thursdays[0].date : Infinity;
			return bFirstThursdayDate - aFirstThursdayDate;
		});

		return semesters;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch Semesters.");
	}
}

export async function getFilteredThursdays(filters) {
	noStore();

	let defaultSemester = { semester: { name: { contains: "" } } };

	if (filters.semester == undefined) {
		const semesters = await getAllSemesters();
		defaultSemester = { semester: { id: semesters[0].id } };
	} else if (filters.semester != "All") {
		defaultSemester = { semester: { name: { contains: filters.semester } } };
	}

	if (filters.thursdays === undefined) {
		filters.thursdays = "";
	}

	try {
		const thursdays = await prisma.thursday.findMany({
			where: {
				OR: [
					{ name: { contains: `${filters.thursdays}`, mode: "insensitive" } },
					{
						groups: {
							some: {
								name: { contains: `${filters.thursdays}`, mode: "insensitive" },
							},
						},
					},
					{
						groups: {
							some: {
								id: { contains: `${filters.thursdays}`, mode: "insensitive" },
							},
						},
					},
					{
						groups: {
							some: {
								location: {
									contains: `${filters.thursdays}`,
									mode: "insensitive",
								},
							},
						},
					},
				],
				AND: defaultSemester,
			},
			orderBy: {
				date: "asc",
			},
			include: {
				groups: {
					include: { producers: true, presentations: { include: { presenters: true } } },
				},
			},
		});

		return thursdays;
	} catch (error) {
		console.error("database error:", error);
		throw new Error("failed to fetch thursdays.");
	}
}
