import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/database";

export const { handlers, signIn, signOut, auth } = NextAuth({
	trustHost: true,
	debug: process.env.NODE_ENV === "development",
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	cookies: {
		sessionToken: {
			name: "sim_session",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
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
		async jwt({ token, user }) {
			// On initial sign in, user object is available
			if (user) {
				token.id = user.id;
			}

			if (!token.email) return token;

			try {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email },
					select: {
						id: true,
						admin: true,
						username: true,
					},
				});

				if (dbUser) {
					token.id = dbUser.id;
					token.admin = dbUser.admin;
					token.username = dbUser.username;
				}
			} catch (error) {
				console.error("JWT Callback Error:", error);
			}

			// Clean up token to keep it small - ONLY essential fields
			const cleanToken = {
				id: (token.id as string) || (token.sub as string),
				email: token.email as string,
				name: token.name as string,
				picture: token.picture as string,
				admin: token.admin as boolean,
				username: token.username as string,
			};
			
			return cleanToken;
		},

		async session({ session, token }) {
			if (session?.user && token) {
				session.user.id = token.id as string;
				session.user.admin = token.admin as boolean;
				session.user.username = token.username as string;
				session.user.name = token.name as string;
				session.user.image = token.picture as string;
			}

			return session;
		},
	},
});
