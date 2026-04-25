import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/server/database";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
			authorization: {
				params: {
					scope: "openid email profile",
				},
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			// Add a check for account being non-null
			if (!account) {
				console.error("Account is null or undefined");
				return false; // Prevent further execution if account is invalid
			}

			let defaultSemester;
			const firstSemester = await prisma.semester.findFirst({
				include: { thursdays: { include: { groups: true } }, users: true },
			});

			if (firstSemester) {
				defaultSemester = firstSemester;
			} else {
				defaultSemester = { id: "" };
			}

			const email = user.email as string;

			const isUserFound = await prisma.user.findFirst({ where: { email: email }, include: { accounts: true } });

			if (isUserFound?.accounts.length == 0) {
				try {
					await prisma.user.update({
						where: {
							// Check if the user already exists by email.
							email: email,
						},
						data: {
							accounts: {
								create: {
									type: account.type,
									provider: account.provider,
									providerAccountId: account.providerAccountId,
									access_token: account.access_token,
									refresh_token: account.refresh_token,
									expires_at: account.expires_at,
								},
							},
							semesters: { connect: { id: defaultSemester.id } },
						},
					});
				} catch (error) {
					console.error("ERROR:", error);
					// Deny sign in.
					return false;
				}
			}

			// Allow sign in.
			return true;
		},
		async jwt({ token }) {
			if (!token.email) return token;

			const dbUser = await prisma.user.findUnique({
				where: { email: token.email },
				select: {
					id: true,
					admin: true,
				},
			});

			if (dbUser) {
				token.id = dbUser.id;
				token.admin = dbUser.admin;
			}

			return token;
		},

		async session({ session, token }) {
			if (!session?.user) return session;

			if (token?.email) {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email },
					select: { id: true, admin: true },
				});

				if (dbUser) {
					session.user.id = dbUser.id;
					session.user.admin = dbUser.admin;
				}
			}

			return session;
		},
	},
});
