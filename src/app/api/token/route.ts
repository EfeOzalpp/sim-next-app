// /app/api/token/route.ts
import { auth } from "@/server/auth/config";
import { prisma } from "@/server/database";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await auth(); // NextAuth in App Router

	if (!session?.user?.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const account = await prisma.account.findFirst({
		where: {
			user: { email: session.user.email },
			provider: "google",
		},
	});

	if (!account?.access_token) {
		return NextResponse.json({ error: "No token found" }, { status: 404 });
	}

	return NextResponse.json({ accessToken: account.access_token });
}
