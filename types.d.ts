import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			admin: boolean;
			username: string;
		} & DefaultSession["user"];
	}

	interface User {
		admin: boolean;
		username: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		admin: boolean;
		username: string;
	}
}
