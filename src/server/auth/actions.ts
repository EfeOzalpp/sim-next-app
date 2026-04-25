"use server";

import { signIn, signOut } from "@/server/auth/config";

export async function logIn() {
	await signIn("google");
}

export async function logOut() {
	await signOut();
}
