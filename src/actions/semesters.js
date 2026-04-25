"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin } from "@/actions/auth";
import {
	deleteThursdayAndGroups,
	generateSemesterThursdays,
	getAllSemesters as getAllSemestersUtil,
	getDateKey,
	getDefaultGroupsForThursday,
	getSemesterThursdayName,
	isEmptyOrPlaceholderThursday,
	action,
} from "@/actions/utilities";

export async function getAllSemesters() {
	return await getAllSemestersUtil();
}

export async function getSemester(id) {
	return await prisma.semester.findFirst({
		where: { id: id },
		include: { users: true, thursdays: { orderBy: { date: "asc" } } },
	});
}

export async function getSemesterFromName(name) {
	if (name === "All") {
		name = "";
	}

	if (name === undefined) {
		const semesters = await getAllSemestersUtil();
		if (semesters.length === 0) return null;
		name = semesters[0].name;
	}

	return await prisma.semester.findFirst({
		where: { name: { contains: name } },
		include: { 
			users: {
				select: { id: true, name: true, username: true, image: true }
			}, 
			thursdays: { 
				orderBy: { date: "asc" },
				include: { 
					groups: { 
						include: { 
							presentations: { 
								include: { 
									presenters: {
										select: { id: true, name: true, username: true, image: true }
									} 
								} 
							} 
						} 
					} 
				} 
			} 
		},
	});
}

export async function getAdminSemesterData(semesterId, filters = {}) {
	noStore();

	const userSearch = filters.user || "";

	const semester = await prisma.semester.findUnique({
		where: { id: semesterId },
		include: {
			thursdays: {
				orderBy: { date: "asc" },
				include: {
					groups: {
						include: {
							presentations: {
								include: { 
									presenters: {
										select: { id: true, name: true, username: true, image: true }
									}
								},
							},
						},
					},
				},
			},
			users: {
				select: { id: true, name: true, username: true, image: true }
			},
		},
	});

	if (!semester) {
		return { semester: null, users: [] };
	}

	const startDate = semester.thursdays.length > 0 ? new Date(semester.thursdays[0].date) : null;
	const endDate = semester.thursdays.length > 0 ? new Date(semester.thursdays[semester.thursdays.length - 1].date) : null;
	const midTimestamp = startDate && endDate ? (startDate.getTime() + endDate.getTime()) / 2 : null;

	const users = await prisma.user.findMany({
		where: {
			semesters: { some: { id: semesterId } },
			name: { contains: userSearch, mode: "insensitive" },
		},
		orderBy: { name: "asc" },
		select: {
			id: true,
			name: true,
			username: true,
			productions: { 
				where: { thursday: { semester_id: semesterId } },
				include: { thursday: { select: { date: true } } } 
			},
			presentations: { 
				where: { group: { thursday: { semester_id: semesterId } } },
				include: { group: { include: { thursday: { select: { date: true } } } } } 
			},
		},
	});

	const usersWithStats = users.map((user) => {
		const groups = (user.productions || []).map((group) => ({
			...group,
			date: group.thursday?.date,
		}));

		const semesterWorks = (user.presentations || []).map((work) => ({
			...work,
			date: work.group?.thursday?.date,
		}));

		return {
			id: user.id,
			name: user.name,
			username: user.username,
			groups,
			worksBeforeMid: midTimestamp ? semesterWorks.filter((work) => new Date(work.date).getTime() < midTimestamp) : semesterWorks,
			worksAfterMid: midTimestamp ? semesterWorks.filter((work) => new Date(work.date).getTime() >= midTimestamp) : [],
		};
	});

	return { semester, users: usersWithStats };
}

export async function addSemester(data) {
	return await action(async () => {
		await ensureAdmin();

		const thursdays = await Promise.all(data.dates.map(async (day, index) => {
			const name = getSemesterThursdayName(index);
			const defaultGroups = getDefaultGroupsForThursday(name);
			return {
				name,
				date: new Date(day),
				...(defaultGroups ? { groups: defaultGroups } : {}),
			};
		}));

		const people = data.users.map((id) => ({ id }));

		try {
			const semester = await prisma.semester.create({
				data: {
					name: data.name,
					thursdays: {
						create: thursdays,
					},
					users: {
						connect: people,
					},
				},
			});
			revalidatePath("/admin");
			return semester;
		} catch (error) {
			if (error.code === "P2002") {
				throw new Error("A semester with this name already exists.");
			}
			throw error;
		}
	});
}

export async function editSemester(data) {
	return await action(async () => {
		await ensureAdmin();

		return await prisma.$transaction(async (tx) => {
			await tx.semester.update({
				where: { id: data.id },
				data: {
					name: data.name,
					users: { set: data.users.map((id) => ({ id })) },
				},
			});

			if (data.dates?.length === 2) {
				const desiredDates = await generateSemesterThursdays(data.dates);
				const desiredDateStrings = desiredDates.map((date) => getDateKey(date));

				const existingThursdays = await tx.thursday.findMany({
					where: { semester_id: data.id },
					include: { groups: { include: { presentations: true, producers: true } } },
					orderBy: { date: "asc" },
				});

				const existingByDate = new Map();
				for (const thursday of existingThursdays) {
					existingByDate.set(getDateKey(thursday.date), thursday);
				}

				const orphanThursdays = await tx.thursday.findMany({
					where: {
						semester_id: null,
						date: { in: desiredDates },
					},
					include: { groups: { include: { presentations: true, producers: true } } },
				});

				const orphanByDate = new Map();
				for (const thursday of orphanThursdays) {
					orphanByDate.set(getDateKey(thursday.date), thursday);
				}

				const emptyOutOfRangeThursdays = [];
				for (const thursday of existingThursdays) {
					const dateKey = getDateKey(thursday.date);
					if (!desiredDateStrings.includes(dateKey) && (await isEmptyOrPlaceholderThursday(thursday))) {
						emptyOutOfRangeThursdays.push(thursday);
					}
				}

				const reusableThursdays = [...emptyOutOfRangeThursdays];

				for (let index = 0; index < desiredDates.length; index++) {
					const desiredDate = desiredDates[index];
					const desiredName = getSemesterThursdayName(index);
					const desiredDateString = getDateKey(desiredDate);
					const existing = existingByDate.get(desiredDateString);
					const orphan = orphanByDate.get(desiredDateString);
					const defaultGroups = getDefaultGroupsForThursday(desiredName);

					if (existing) {
						await tx.thursday.update({
							where: { id: existing.id },
							data: {
								name: desiredName,
								...(defaultGroups && (existing.groups?.length ?? 0) === 0 ? { groups: defaultGroups } : {}),
							},
						});
					} else if (orphan) {
						await tx.thursday.update({
							where: { id: orphan.id },
							data: {
								semester: { connect: { id: data.id } },
								name: desiredName,
								...(defaultGroups && (orphan.groups?.length ?? 0) === 0 ? { groups: defaultGroups } : {}),
							},
						});
					} else if (reusableThursdays.length > 0) {
						const reusable = reusableThursdays.shift();
						await tx.thursday.update({
							where: { id: reusable.id },
							data: {
								date: desiredDate,
								name: desiredName,
								...(defaultGroups ? { groups: defaultGroups } : {}),
							},
						});
					} else {
						await tx.thursday.create({
							data: {
								name: desiredName,
								date: desiredDate,
								semester: { connect: { id: data.id } },
								...(defaultGroups ? { groups: defaultGroups } : {}),
							},
						});
					}
				}

				// Handle cleanup of out-of-range thursdays
				for (const thursday of existingThursdays) {
					const dateKey = getDateKey(thursday.date);
					if (!desiredDateStrings.includes(dateKey)) {
						if (await isEmptyOrPlaceholderThursday(thursday)) {
							// For actual deletion in transaction, we need to be careful with deleteThursdayAndGroups
							// Since that utility uses prisma client, we might want to inline it or pass tx
							const groupIds = thursday.groups?.map(g => g.id).filter(Boolean) || [];
							if (groupIds.length) {
								await tx.work.deleteMany({ where: { group_id: { in: groupIds } } });
								await tx.group.deleteMany({ where: { id: { in: groupIds } } });
							}
							await tx.thursday.delete({ where: { id: thursday.id } });
						} else {
							await tx.thursday.update({
								where: { id: thursday.id },
								data: { semester: { disconnect: true } },
							});
						}
					}
				}
			}

			revalidatePath("/admin");
			revalidatePath(`/admin/semesters/${data.id}`);
			return { success: true };
		});
	});
}

export async function removeSemester(data) {
	return await action(async () => {
		await ensureAdmin();

		return await prisma.$transaction(async (tx) => {
			const thursdays = await tx.thursday.findMany({
				where: { semester_id: data.id },
				include: { groups: true },
			});

			for (const thursday of thursdays) {
				const groupIds = thursday.groups?.map(g => g.id).filter(Boolean) || [];
				if (groupIds.length) {
					await tx.work.deleteMany({ where: { group_id: { in: groupIds } } });
					await tx.group.deleteMany({ where: { id: { in: groupIds } } });
				}
				await tx.thursday.delete({ where: { id: thursday.id } });
			}

			await tx.semester.delete({
				where: { id: data.id },
			});

			revalidatePath("/admin");
			return { success: true };
		});
	});
}
