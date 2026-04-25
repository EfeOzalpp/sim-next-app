"use client";

import { logIn, logOut } from "@/server/auth/actions";

import Button from "@/components/Button";

export function LoginButton() {
	return <Button onClick={logIn}>Login</Button>;
}

export function LogoutButton() {
	return <Button onClick={logOut}>Logout</Button>;
}
