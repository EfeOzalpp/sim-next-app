"use client";

import { logIn, logOut } from "@/actions/auth";

import { Button } from "@/components/ui/AntD";

export function LoginButton() {
	return <Button onClick={logIn}>Login</Button>;
}

export function LogoutButton() {
	return <Button onClick={logOut}>Logout</Button>;
}
