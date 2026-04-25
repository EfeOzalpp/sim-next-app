import { getUser } from "@/server/shared";
import { getCurrentUser } from "@/server/auth/context";
import { notFound, redirect } from "next/navigation";
import Button from "@/components//Button";
import styles from "../../../components/users/User.module.css";
import Header from "@/components/Header";
import Link from "next/link";
import { LogoutButton } from "@/components/AuthenticationButtons";
import Presentation from "@/components/PresentationCard";

export default async function User({ params }) {
	const { username } = await params;
	const user = await getUser(username);
	if (!user) return notFound();

	const currentUser = await getCurrentUser();
	if (!currentUser) return;

	const canEdit = currentUser.admin || user.id === currentUser.id;

	return (
		<div className={styles.UserTable}>
			<div className={styles.UserImage}>
				<img src={user.image} alt={`${user.name}'s image`} />
			</div>

			<div>
				<Header
					label={
						<div style={{ fontWeight: "bolder", fontSize: "2rem" }}>
							{user.name}
							{user.admin ? " ✨" : null}
						</div>
					}
				>
					{canEdit && (
						<Button href={`./${user.username}/edit`} className={styles.EditButton}>
							Edit Profile
						</Button>
					)}
					{user.id === currentUser.id ? <LogoutButton /> : null}
				</Header>

				<div className={styles.UserData}>
					<div className={styles.DataRow}>
						<div className={styles.Label}>Pronouns</div>
						<div className={styles.Value}>{user.pronouns?.length > 0 ? user.pronouns : "This user has not set their pronouns yet."}</div>
					</div>

					<div className={styles.DataRow}>
						<div className={styles.Label}>About</div>
						<div className={styles.Value}>{user.about?.length > 0 ? user.about : "This user has not written an about yet."}</div>
					</div>

					<div className={styles.DataRow}>
						<div className={styles.Label}>Presentations</div>
						<div className={styles.Value}>
							{user.presentations?.length > 0 ? (
								user.presentations.map((work) => <Presentation key={work.id} work={work} />)
							) : (
								<i>This user has not presented any work yet.</i>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
