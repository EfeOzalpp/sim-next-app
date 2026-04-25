import { prisma } from "@/database";

export async function getAllSemesters() {
	try {
		const semesters = await prisma.semester.findMany({
			include: { thursdays: { include: { groups: true } }, users: true },
		});

		// Sort Semesters by Thursday dates.
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

export async function generateSemesterThursdays(dateRange) {
	if (!Array.isArray(dateRange) || dateRange.length !== 2) {
		return [];
	}

	const startDate = new Date(dateRange[0]);
	const endDate = new Date(dateRange[1]);

	if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) {
		return [];
	}

	const dates = [];
	let current = new Date(startDate);

	while (current <= endDate) {
		if (current.getDay() === 4) {
			dates.push(new Date(current));
		}
		current.setDate(current.getDate() + 1);
	}

	return dates;
}

export function getSemesterThursdayName(index) {
	return index % 2 === 0 ? "Big Day" : "Small Day";
}

export function getDateKey(date) {
	return new Date(date).toISOString().split("T")[0];
}

export function getDefaultGroupsForThursday(name) {
	if (name === "Big Day") {
		return { create: [{ name: "Big Group", location: "Pozen Center" }] };
	}
	return undefined;
}

export function isPlaceholderBigGroup(group) {
	return (
		group?.name === "Big Group" &&
		group?.location === "Pozen Center" &&
		(group?.presentations?.length ?? 0) === 0 &&
		(group?.producers?.length ?? 0) === 0
	);
}

export async function isEmptyOrPlaceholderThursday(thursday) {
	const groupCount = thursday.groups?.length ?? 0;
	if (groupCount === 0) return true;
	if (groupCount === 1 && (isPlaceholderBigGroup(thursday.groups[0]))) return true;
	return false;
}

/**
 * Standard wrapper for Server Actions to provide consistent error handling
 */
export async function action(fn) {
	try {
		const data = await fn();
		return { success: true, data };
	} catch (error) {
		console.error("Action Error:", error);
		return { 
			success: false, 
			error: error.message || "An unexpected error occurred." 
		};
	}
}

export async function deleteThursdayAndGroups(thursday) {
	const groupIds = thursday.groups?.map((group) => group.id).filter(Boolean) || [];
	if (groupIds.length) {
		await prisma.work.deleteMany({
			where: {
				group_id: { in: groupIds },
			},
		});
		await prisma.group.deleteMany({
			where: {
				id: { in: groupIds },
			},
		});
	}

	await prisma.thursday.delete({
		where: { id: thursday.id },
	});
}
