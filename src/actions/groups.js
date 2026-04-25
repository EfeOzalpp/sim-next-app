"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/database";

import { ensureAdmin } from "@/actions/auth";
import { action } from "@/actions/utilities";

export async function getGroup(id) {
	return await prisma.group.findFirst({
		where: { id: id },
		include: { 
			producers: { select: { id: true, name: true, username: true, image: true } }, 
			presentations: { 
				include: { 
					presenters: { select: { id: true, name: true, username: true, image: true } } 
				} 
			}, 
			thursday: true 
		},
	});
}

export async function getAllGroups() {
	return await action(async () => {
		const groups = await prisma.group.findMany({
			select: {
				id: true,
				name: true,
				location: true,
				producers: { select: { id: true, name: true } },
			},
			orderBy: { name: "asc" }
		});

		return groups.map((group, index) => ({
			...group,
			key: index
		}));
	});
}

export async function addGroup(data) {
	return await action(async () => {
		await ensureAdmin();

		return await prisma.$transaction(async (tx) => {
			const group = await tx.group.create({
				data: {
					name: data.name,
					location: data.location,
					producers: {
						connect: data.producers.map((id) => ({ id })),
					},
					thursday: {
						connect: { id: data.thursday },
					},
				},
			});

			for (const p of data.presentations) {
				await tx.work.create({
					data: {
						name: p.name,
						about: p.about,
						image: p.image ?? "",
						group: { connect: { id: group.id } },
						presenters: {
							connect: p.presenters.map((id) => ({ id })),
						},
					},
				});
			}

			revalidatePath("/thursdays");
			revalidatePath(`/thursdays/${data.thursday}`);
			return group;
		});
	});
}

export async function editGroup(data) {
	return await action(async () => {
		await ensureAdmin();

		return await prisma.$transaction(async (tx) => {
			await tx.group.update({
				where: { id: data.id },
				data: {
					name: data.name,
					location: data.location,
					producers: { set: data.producers.map((id) => ({ id })) },
					thursday: { connect: { id: data.thursday } },
				},
			});

			const existingWorks = await tx.work.findMany({
				where: { group_id: data.id },
				select: { id: true },
			});
			const existingIds = existingWorks.map((w) => w.id);
			const currentPresentationIds = data.presentations.map((p) => p.id).filter(Boolean);

			// Delete works
			await tx.work.deleteMany({
				where: {
					group_id: data.id,
					id: { notIn: currentPresentationIds }
				}
			});

			// Handle new and existing presentations
			for (const p of data.presentations) {
				if (!p.id) {
					await tx.work.create({
						data: {
							name: p.name,
							about: p.about,
							image: p.image ?? "",
							group: { connect: { id: data.id } },
							presenters: {
								connect: p.presenters.map((id) => ({ id })),
							},
						},
					});
				} else {
					await tx.work.update({
						where: { id: p.id },
						data: {
							name: p.name,
							about: p.about,
							image: p.image ?? "",
							presenters: {
								set: p.presenters.map((id) => ({ id })),
							},
						},
					});
				}
			}

			revalidatePath("/thursdays");
			revalidatePath(`/thursdays/${data.thursday}`);
			return { success: true };
		});
	});
}

/**
 * Optimized helper for updating group presentations within a larger transaction or standalone
 */
export async function updateGroupPresentations(groupData) {
	return await action(async () => {
		await ensureAdmin();

		return await prisma.$transaction(async (tx) => {
			await tx.group.update({
				where: { id: groupData.id },
				data: {
					name: groupData.name,
					location: groupData.location,
					producers: { set: groupData.producers.map((id) => ({ id })) },
				},
			});

			const existingWorks = await tx.work.findMany({
				where: { group_id: groupData.id },
				select: { id: true },
			});
			const existingWorkIds = existingWorks.map((w) => w.id);
			const currentPresentationIds = (groupData.presentations || []).map((p) => p.id).filter(Boolean);

			// Delete
			await tx.work.deleteMany({
				where: {
					group_id: groupData.id,
					id: { notIn: currentPresentationIds }
				}
			});

			// Update / Create
			for (const p of (groupData.presentations || [])) {
				if (!p.id) {
					await tx.work.create({
						data: {
							name: p.name,
							about: "",
							image: "",
							group: { connect: { id: groupData.id } },
							presenters: {
								connect: p.presenters.map((id) => ({ id })),
							},
						},
					});
				} else {
					await tx.work.update({
						where: { id: p.id },
						data: {
							name: p.name,
							presenters: {
								set: p.presenters.map((id) => ({ id })),
							},
						},
					});
				}
			}
			return { success: true };
		});
	});
}
