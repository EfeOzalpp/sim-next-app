import styles from "./NavBar.module.css";
import Button from "@/components/Button";
import NavSelect from "./NavSelect";

import { auth } from "@/server/auth/config";

export default async function NavBar() {
	const session = await auth();
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
