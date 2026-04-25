"use server";

import { prisma } from "@/server/database";
import { getAllSemesters } from "@/server/shared";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";

export async function getSemester(id) {
	const semester = await prisma.semester.findFirst({
		where: { id: id },
		include: { users: true, thursdays: true },
	});
	return semester;
}

export async function getSemesterFromName(name) {
	if (name == "All") {
		name = "";
	}

	if (name == undefined) {
		const semesters = await getAllSemesters();
		name = semesters[0].name;
	}

	const semester = await prisma.semester.findFirst({
		where: { name: { contains: name } },
		include: { users: true, thursdays: { include: { groups: { include: { presentations: { include: { presenters: true } } } } } } },
	});
	return semester;
}

export async function editUser({ id, name, about, image, email, link, pronouns, admin }) {
	return prisma.user.update({
		where: { id },
		data: { name, about, image, link, pronouns, email, admin },
	});
}

export async function handleImageUpload(file, filename, directory) {
	if (!file || !filename) return null;

	const directory_path = path.join(process.cwd(), `public/${directory}`);
	await mkdir(directory_path, { recursive: true });

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	const ext = file.name.split(".").pop();
	const filename_w_ext = `${filename}.${ext}`;
	const filepath = path.join(directory_path, filename_w_ext);

	const existing_files = await readdir(directory_path);
	const matching_files = existing_files.filter((f) => f.startsWith(`${filename}.`));

	await Promise.all(matching_files.map((f) => unlink(path.join(directory_path, f))));

	await writeFile(filepath, buffer);

	return `/${directory}/${filename_w_ext}`;
}

export async function getAllUsers() {
	try {
		const users = await prisma.user.findMany({
			include: { productions: true, semesters: true },
		});

		return users;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to getAllUsers().");
	}
}

export async function getAllWorks() {
	try {
		const works = await prisma.work.findMany({
			include: { presenters: true, group: true },
		});

		return works;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to getAllWorks().");
	}
}

export async function getAllGroups() {
	try {
		const groups = await prisma.group.findMany({
			include: { producers: true },
		});

		groups.map((group) => {
			group.key = groups.indexOf(group);
		});

		return groups;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to getAllUsers().");
	}
}
