"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin } from "@/actions/auth";
import {
	generateSemesterThursdays,
	getAllSemesters as getAllSemestersUtil,
	getDateKey,
	getDefaultProductionsForThursday,
	getSemesterThursdayName,
	isEmptyOrPlaceholderThursday,
	getMidSemesterTimestamp,
	action,
} from "@/actions/utilities";
import { SemesterSchema, SemesterInput, FilterSchema } from "@/components/forms/schemas";

export async function getAllSemesters() {
	return await action(async () => {
		return await getAllSemestersUtil();
	});
}

export async function getSemester(id: string) {
	return await action(async () => {
		const semester = await prisma.semester.findUnique({
			where: { id: id },
			select: {
				id: true,
				name: true,
				users: {
					select: { id: true, name: true, image: true }
				},
				thursdays: {
					orderBy: { date: "asc" },
					select: { id: true, date: true, name: true }
				}
			},
		});
		if (!semester) throw new Error("Semester not found");
		return semester;
	});
}

export async function getSemesterFromName(name?: string) {
	return await action(async () => {
		let semesterName = name;
		if (semesterName === "All") {
			semesterName = "";
		}

		if (semesterName === undefined) {
			const semesters = await getAllSemestersUtil();
			if (semesters.length === 0) return null;
			semesterName = semesters[0].name;
		}

		return await prisma.semester.findFirst({
			where: { name: { contains: semesterName } },
			select: {
				id: true,
				name: true,
				users: {
					select: { id: true, name: true, image: true }
				}, 
				thursdays: { 
					orderBy: { date: "asc" },
					select: {
						id: true,
						date: true,
						name: true,
						productions: { 
							select: {
								id: true,
								name: true,
								location: true,
								presentations: { 
									select: {
										id: true,
										name: true,
										about: true,
										presenters: {
											select: { id: true, name: true, image: true, role: true }
										} 
									} 
								} 
							} 
						} 
					} 
				} 
			},
		});
	});
}

export async function getAdminSemesterData(semesterId: string, rawFilters: any = {}) {
	return await action(async () => {
		noStore();

		const validation = FilterSchema.safeParse(rawFilters);
		const filters = validation.success ? validation.data : {};
		const userSearch = Array.isArray(filters.user) ? filters.user[0] : (filters.user || "");

		const semester = await prisma.semester.findUnique({
			where: { id: semesterId },
			select: {
				id: true,
				name: true,
				thursdays: {
					orderBy: { date: "asc" },
					select: {
						id: true,
						date: true,
						name: true,
						productions: {
							select: {
								id: true,
								name: true,
								location: true,
								presentations: {
									select: { 
										id: true,
										name: true,
										presenters: {
											select: { id: true, name: true, image: true, role: true }
										}
									},
								},
							},
						},
					},
				},
				users: {
					select: { id: true, name: true }
				},
			},
		});

		if (!semester) {
			return { semester: null, users: [] };
		}

		const midTimestamp = getMidSemesterTimestamp(semester.thursdays);

		const users = await prisma.user.findMany({
			where: {
				semesters: { some: { id: semesterId } },
				name: { contains: userSearch, mode: "insensitive" },
				role: { not: "STAFF" },
			},
			orderBy: { name: "asc" },
			select: {
				id: true,
				name: true,
				productions: { 
					where: { thursday: { semester_id: semesterId } },
					include: { thursday: { select: { id: true, date: true } } } 
				},
				presentations: { 
					where: { production: { thursday: { semester_id: semesterId } } },
					include: { production: { include: { thursday: { select: { id: true, date: true } } } } } 
				},
			},
		});

		const usersWithStats = users.map((user) => {
			const productions = (user.productions || []).map((production) => ({
				...production,
				date: production.thursday?.date,
			}));

			const semesterPresentations = (user.presentations || []).map((presentation) => ({
				...presentation,
				date: presentation.production?.thursday?.date,
			}));

			return {
				id: user.id,
				name: user.name,
				productions,
				presentationsBeforeMid: midTimestamp ? semesterPresentations.filter((presentation) => presentation.date && new Date(presentation.date).getTime() < midTimestamp) : semesterPresentations,
				presentationsAfterMid: midTimestamp ? semesterPresentations.filter((presentation) => presentation.date && new Date(presentation.date).getTime() >= midTimestamp) : [],
			};
		});

		return { semester, users: usersWithStats };
	});
}

export async function addSemester(data: SemesterInput & { dates: string[], users: string[] }) {
	return await action(async () => {
		await ensureAdmin();

		const validation = SemesterSchema.safeParse(data);
		if (!validation.success) {
			throw new Error(validation.error.issues[0].message);
		}
		const validatedFields = validation.data;

		// If dates are provided as a range [start, end], generate the thursdays
		let dates = validatedFields.dates || [];
		if (dates.length === 2) {
			const generatedDates = await generateSemesterThursdays(dates as [string, string]);
			dates = generatedDates.map(d => d.toISOString());
		}

		const thursdays = await Promise.all(dates.map(async (day, index) => {
			const name = getSemesterThursdayName(index);
			const defaultProductions = getDefaultProductionsForThursday(name);
			return {
				name,
				date: new Date(day),
				...(defaultProductions ? { productions: defaultProductions } : {}),
			};
		}));

		const people = (validatedFields.users || []).map((id) => ({ id }));

		try {
			const semester = await prisma.semester.create({
				data: {
					name: validatedFields.name,
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
		} catch (error: any) {
			if (error.code === "P2002") {
				throw new Error("A semester with this name already exists.");
			}
			throw error;
		}
	});
}

export async function editSemester(data: { id: string, name: string, users: string[], dates?: [string, string] }) {
	return await action(async () => {
		await ensureAdmin();

		const validation = SemesterSchema.safeParse(data);
		if (!validation.success) {
			throw new Error(validation.error.issues[0].message);
		}

		return await prisma.$transaction(async (tx) => {
			await tx.semester.update({
				where: { id: data.id },
				data: {
					name: data.name,
					users: { set: data.users.map((id) => ({ id })) },
				},
			});

			if (data.dates && data.dates.length === 2) {
				const desiredDates = await generateSemesterThursdays(data.dates);
				const desiredDateStrings = desiredDates.map((date) => getDateKey(date));

				const existingThursdays = await tx.thursday.findMany({
					where: { semester_id: data.id },
					include: { productions: { include: { presentations: true, producers: true } } },
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
					include: { productions: { include: { presentations: true, producers: true } } },
				});

				const orphanByDate = new Map();
				for (const thursday of orphanThursdays) {
					orphanByDate.set(getDateKey(thursday.date), thursday);
				}

				const emptyOutOfRangeThursdays: any[] = [];
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
					const defaultProductions = getDefaultProductionsForThursday(desiredName);

					if (existing) {
						await tx.thursday.update({
							where: { id: existing.id },
							data: {
								name: desiredName,
								...(defaultProductions && (existing.productions?.length ?? 0) === 0 ? { productions: defaultProductions } : {}),
							},
						});
					} else if (orphan) {
						await tx.thursday.update({
							where: { id: orphan.id },
							data: {
								semester: { connect: { id: data.id } },
								name: desiredName,
								...(defaultProductions && (orphan.productions?.length ?? 0) === 0 ? { productions: defaultProductions } : {}),
							},
						});
					} else if (reusableThursdays.length > 0) {
						const reusable = reusableThursdays.shift();
						await tx.thursday.update({
							where: { id: reusable.id },
							data: {
								date: desiredDate,
								name: desiredName,
								...(defaultProductions ? { productions: defaultProductions } : {}),
							},
						});
					} else {
						await tx.thursday.create({
							data: {
								name: desiredName,
								date: desiredDate,
								semester: { connect: { id: data.id } },
								...(defaultProductions ? { productions: defaultProductions } : {}),
							},
						});
					}
				}

				// Handle cleanup of out-of-range thursdays
				for (const thursday of existingThursdays) {
					const dateKey = getDateKey(thursday.date);
					if (!desiredDateStrings.includes(dateKey)) {
						if (await isEmptyOrPlaceholderThursday(thursday)) {
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

export async function removeSemester(data: { id: string }) {
	return await action(async () => {
		await ensureAdmin();

		await prisma.semester.delete({
			where: { id: data.id },
		});

		revalidatePath("/admin");
		return { success: true };
	});
}
