import React from "react";
import styles from "@/components/layout/NavBar/NavBar.module.css";
import { Button } from "@/components/ui/AntD";
import { NavSelect } from "@/components/layout/NavBar/NavSelect";
import { auth } from "@/authentication";
import { Session } from "next-auth";
import AdminOnly from "@/components/layout/AdminOnly";

interface NavBarProps {
	session?: Session | null;
}

export default async function NavBar({ session: initialSession }: NavBarProps) {
	const session = initialSession || (await auth());
	if (!session) {
		return (
			<nav className={styles.NavBar}>
				<div className={styles.brand}>SIM</div>
			</nav>
		);
	} else {
		const pages = [
			{ href: "/users", label: "Names & Faces" },
			{ href: "/thursdays", label: "Thursdays" },
			{ href: `/users/${session.user.id}`, label: "My Profile" },
		];

		return (
			<nav className={styles.NavBar}>
				<div className={styles.brand}>SIM</div>
				<div className={styles.desktopMenu}>
					{pages.slice(0, 2).map((p) => (
						<Button key={p.label} href={p.href}>
							{p.label}
						</Button>
					))}
					<AdminOnly>
						<Button href="/admin">Admin</Button>
					</AdminOnly>
					{pages.slice(2).map((p) => (
						<Button key={p.label} href={p.href}>
							{p.label}
						</Button>
					))}
				</div>
				<div className={styles.mobileMenu}>
					<NavSelect
						pages={[
							...pages.slice(0, 2),
							...(session.user.admin ? [{ href: "/admin", label: "Admin" }] : []),
							...pages.slice(2),
						]}
					/>
				</div>
			</nav>
		);
	}
}
