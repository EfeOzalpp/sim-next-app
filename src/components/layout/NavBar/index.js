import styles from "@/components/layout/NavBar/NavBar.module.css";
import { Button } from "@/components/ui/AntD";
import { NavSelect } from "@/components/layout/NavBar/NavSelect";

import { auth } from "@/authentication";

export default async function NavBar({ session: initialSession }) {
	const session = initialSession || await auth();
	if (!session) {
		return (
			<nav className={styles.NavBar}>
				<div className={styles.brand}>SIM</div>
			</nav>
		);
	} else {
		const admin = session?.user?.admin ?? false;

		const pages = [
			{ href: "/users", label: "Names & Faces" },
			{ href: "/thursdays", label: "Thursdays" },
			...(admin ? [{ href: "/admin", label: "Admin" }] : []),
			{ href: `/users/${session.user.username}`, label: "My Profile" },
		];

		return (
			<nav className={styles.NavBar}>
				<div className={styles.brand}>SIM</div>
				<div className={styles.desktopMenu}>
					{pages.map((p) => (
						<Button key={p.label} href={p.href}>
							{p.label}
						</Button>
					))}
				</div>
				<div className={styles.mobileMenu}>
					<NavSelect pages={pages} />
				</div>
			</nav>
		);
	}
}
