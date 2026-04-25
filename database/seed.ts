import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	await prisma.user.deleteMany();
	await prisma.semester.deleteMany();
	await prisma.thursday.deleteMany();
	await prisma.group.deleteMany();
	await prisma.work.deleteMany();

	await prisma.user.create({
		data: {
			name: "Anthony Ochoa Fader",
			username: "aeochoafader",
			email: "aeochoafader@gmail.com",
			admin: true,
			image: "/face.jpg",
			pronouns: "(they/them)",
			link: "https://massartsim.fun/",
		},
	});

	await prisma.semester.create({
		data: {
			name: "Default",
			thursdays: {
				create: [
					{
						date: "2025-01-23T00:00:00.000Z",
						name: "Big Group Day",
						groups: {
							create: [
								{
									name: "Big Group",
									location: "Pozen Center",
								},
							],
						},
					},
					{
						date: "2025-01-30T00:00:00.000Z",
						name: "Small Group Day",
					},
				],
			},
		},
	});
}

main()
	.catch((error) => {
		console.error(error.message);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
