"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin } from "@/actions/auth";
import { getAllSemesters as getAllSemestersUtil, deleteThursdayAndGroups, action } from "@/actions/utilities";
import { updateGroupPresentations } from "@/actions/groups";

export async function getAllSemesters() {
	return await getAllSemestersUtil();
}

export async function getThursday(id) {
	return await prisma.thursday.findFirst({
		where: { id: id },
		include: { 
			groups: { 
				include: { 
					producers: { select: { id: true, name: true, username: true, image: true } }, 
					presentations: { 
						include: { 
							presenters: { select: { id: true, name: true, username: true, image: true } } 
						} 
					} 
				} 
			} 
		},
	});
}

export async function getFilteredThursdays(filters) {
	noStore();

	let defaultSemester = { semester: { name: { contains: "" } } };

	if (filters.semester === undefined) {
		const semesters = await getAllSemesters();
		if (semesters.length > 0) {
			defaultSemester = { semester: { id: semesters[0].id } };
		}
	} else if (filters.semester !== "All") {
		defaultSemester = { semester: { name: { contains: filters.semester } } };
	}

	const search = filters.thursdays || "";

	try {
		return await prisma.thursday.findMany({
			where: {
				OR: [
					{ name: { contains: search, mode: "insensitive" } },
					{ groups: { some: { name: { contains: search, mode: "insensitive" } } } },
					{ groups: { some: { location: { contains: search, mode: "insensitive" } } } },
				],
				AND: defaultSemester,
			},
			orderBy: {
				date: "asc",
			},
			include: {
				groups: {
					include: { 
						producers: { select: { id: true, name: true, username: true, image: true } }, 
						presentations: { 
							include: { 
								presenters: { select: { id: true, name: true, username: true, image: true } } 
							} 
						} 
					},
				},
			},
		});
	} catch (error) {
		console.error("database error:", error);
		throw new Error("failed to fetch thursdays.");
	}
}

export async function editThursday(data) {
	return await action(async () => {
		await ensureAdmin();

		await prisma.thursday.update({
			where: { id: data.id },
			data: {
				name: data.name,
				date: new Date(data.date),
				groups: { set: data.groups.map((id) => ({ id })) },
				semester: { connect: { id: data.semester } },
			},
		});

		revalidatePath("/thursdays");
		revalidatePath(`/thursdays/${data.id}`);
		return { success: true };
	});
}

export async function updateThursdayWithGroups(data) {
	return await action(async () => {
		await ensureAdmin();

		return await prisma.$transaction(async (tx) => {
			await tx.thursday.update({
				where: { id: data.id },
				data: {
					name: data.name,
					date: new Date(data.date),
					semester: data.semesterId ? { connect: { id: data.semesterId } } : undefined,
				},
			});

			const existingGroups = await tx.group.findMany({
				where: { thursday_id: data.id },
				select: { id: true },
			});
			const existingGroupIds = existingGroups.map((g) => g.id);

			const currentGroupIds = data.groups.map((g) => g.id).filter(Boolean);

			// Delete groups no longer in the list
			const groupsToDelete = existingGroupIds.filter((id) => !currentGroupIds.includes(id));
			for (const id of groupsToDelete) {
				// Transactional deletion
				await tx.work.deleteMany({ where: { group_id: id } });
				await tx.group.delete({ where: { id } });
			}

			// Handle new and existing groups
			for (const g of data.groups) {
				if (!g.id) {
					await tx.group.create({
						data: {
							name: g.name,
							location: g.location,
							thursday: { connect: { id: data.id } },
							producers: {
								connect: g.producers.map((id) => ({ id })),
							},
							presentations: {
								create: (g.presentations || []).map((p) => ({
									name: p.name,
									about: "",
									image: "",
									presenters: {
										connect: p.presenters.map((id) => ({ id })),
									},
								})),
							},
						},
					});
				} else {
					// Use the existing function but within transaction would be better
					// For now, simple update here
					await tx.group.update({
						where: { id: g.id },
						data: {
							name: g.name,
							location: g.location,
							producers: { set: g.producers.map((id) => ({ id })) },
						}
					});
					
					const existingWorks = await tx.work.findMany({
						where: { group_id: g.id },
						select: { id: true }
					});
					const existingWorkIds = existingWorks.map(w => w.id);
					const currentWorkIds = (g.presentations || []).map(p => p.id).filter(Boolean);
					
					// Delete works
					await tx.work.deleteMany({
						where: { 
							group_id: g.id,
							id: { notIn: currentWorkIds }
						}
					});
					
					for (const p of (g.presentations || [])) {
						if (!p.id) {
							await tx.work.create({
								data: {
									name: p.name,
									about: "",
									image: "",
									group: { connect: { id: g.id } },
									presenters: { connect: p.presenters.map(id => ({ id })) }
								}
							});
						} else {
							await tx.work.update({
								where: { id: p.id },
								data: {
									name: p.name,
									presenters: { set: p.presenters.map(id => ({ id })) }
								}
							});
						}
					}
				}
			}

			revalidatePath("/thursdays");
			revalidatePath(`/thursdays/${data.id}`);
			return { success: true };
		});
	});
}

export async function createThursdayWithGroups(data) {
	return await action(async () => {
		await ensureAdmin();

		let semesterId = data.semesterId;
		if (!semesterId) {
			const semesters = await getAllSemestersUtil();
			semesterId = semesters[0]?.id;
		}

		return await prisma.$transaction(async (tx) => {
			const thursday = await tx.thursday.create({
				data: {
					name: data.name,
					date: new Date(data.date),
					semester: semesterId ? { connect: { id: semesterId } } : undefined,
				},
			});

			for (const g of data.groups) {
				await tx.group.create({
					data: {
						name: g.name,
						location: g.location,
						thursday: { connect: { id: thursday.id } },
						producers: {
							connect: g.producers.map((id) => ({ id })),
						},
						presentations: {
							create: (g.presentations || []).map((p) => ({
								name: p.name,
								about: "",
								image: "",
								presenters: {
									connect: p.presenters.map((id) => ({ id })),
								},
							})),
						},
					},
				});
			}

			revalidatePath("/thursdays");
			return thursday;
		});
	});
}

export async function removeThursday(data) {
	return await action(async () => {
		await ensureAdmin();

		const thursday = await prisma.thursday.findUnique({
			where: { id: data.id },
			include: { groups: true },
		});
		
		if (thursday) {
			await deleteThursdayAndGroups(thursday);
		}

		revalidatePath("/thursdays");
		return { success: true };
	});
}
