"use server";

import { prisma } from "@/server/database";
import { getAllSemesters } from "@/server/shared";

export async function addUser(data) {
	const current_semester = await getAllSemesters();

	try {
		await prisma.user.create({
			data: {
				email: data.email,
				username: data.email.split("@")[0],
				image: data.image,
				name: data.name,
				about: data.about?.trim() || "I'm new to SIM!",
				link: data.link,
				pronouns: data.pronouns,
				semesters: { connect: { id: current_semester[0].id } },
				admin: data.admin,
			},
		});
	} catch (error) {
		throw new Error(error);
	}
}

export async function removeUser(data) {
	await prisma.user.delete({
		where: {
			id: data.id,
		},
	});
}

export async function editGroup(data) {
	await prisma.group.update({
		where: { id: data.id },
		data: {
			name: data.name,
			location: data.location,
			producers: { set: data.producers.map((id) => ({ id })) },
			thursday: { connect: { id: data.thursday } },
		},
	});

	const existingWorks = await prisma.work.findMany({
		where: { group_id: data.id },
		select: { id: true },
	});
	const existingIds = existingWorks.map((w) => w.id);

	const newPresentations = data.presentations.filter((p) => !p.id);
	const existingPresentations = data.presentations.filter((p) => p.id);
	const currentPresentationIds = existingPresentations.map((p) => p.id);

	await Promise.all(
		newPresentations.map((p) =>
			prisma.work.create({
				data: {
					name: p.name,
					about: p.about,
					image: p.image ?? "",
					group: { connect: { id: data.id } },
					presenters: {
						connect: p.presenters.map((id) => ({ id })),
					},
				},
			}),
		),
	);

	await Promise.all(
		existingPresentations.map((p) =>
			prisma.work.update({
				where: { id: p.id },
				data: {
					name: p.name,
					about: p.about,
					image: p.image ?? "",
					presenters: {
						set: p.presenters.map((id) => ({ id })),
					},
				},
			}),
		),
	);

	const worksToDelete = existingIds.filter((id) => !currentPresentationIds.includes(id));
	await Promise.all(
		worksToDelete.map((id) =>
			prisma.work.delete({
				where: { id },
			}),
		),
	);
}

export async function editThursday(data) {
	await prisma.thursday.update({
		where: {
			id: data.id,
		},
		data: {
			name: data.name,
			date: data.date,
			groups: { set: data.groups.map((id) => ({ id })) },
			semester: { connect: { id: data.semester } },
		},
	});
}

export async function editSemester(data) {
	await prisma.semester.update({
		where: {
			id: data.id,
		},
		data: {
			name: data.name,
			users: { set: data.users.map((id) => ({ id })) },
		},
	});
}

export async function addSemester(data) {
	const thursdays = [];
	data.dates.map((day) => {
		thursdays.push({
			name: data.dates.indexOf(day) % 2 == 0 ? "Big Day" : "Small Day",
			date: day,
		});
	});

	const people = [];
	data.users.map((user) => {
		people.push({ id: user });
	});

	try {
		await prisma.semester.create({
			data: {
				name: data.name,
				thursdays: {
					createMany: {
						data: thursdays,
					},
				},
				users: {
					connect: people,
				},
			},
		});
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to addSemester().");
	}
}

export async function addGroup(data) {
	try {
		const group = await prisma.group.create({
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
		await Promise.all(
			data.presentations.map((p) =>
				prisma.work.create({
					data: {
						name: p.name,
						about: p.about,
						image: p.image ?? "",
						group: { connect: { id: group.id } },
						presenters: {
							connect: p.presenters.map((id) => ({ id })),
						},
					},
				}),
			),
		);
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error(`Failed to addGroup(data) with data:`);
	}
}
