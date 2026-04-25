import { auth } from "@/server/auth/config";
import { prisma } from "@/server/database";

export async function getCurrentUser() {
	const session = await auth();
	if (session?.user?.email) {
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});
		return user;
	}
	return null;
}

export async function isCurrentUserAdmin() {
	const user = await getCurrentUser();
	if (user) {
		return user.admin;
	} else {
		return false;
	}
}
