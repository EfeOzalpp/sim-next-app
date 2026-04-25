import Link from "next/link";
import styles from "./thursdays/thursdaycard.module.css";
import Button from "./Button";
import Header from "./Header";
import GroupCard from "./GroupCard";
import { auth } from "@/server/auth/config";

export default async function ThursdayCard({ thursday }) {
	const session = await auth();
	const isAdmin = session?.user?.admin ?? false;

	return (
		<div className={styles.ThursdayCard}>
			<Header
				label={
					<h3>
						<Link href={`/thursdays/${thursday.id}`}>
							<b>{thursday.name}</b> ({thursday.date.toLocaleDateString()})
						</Link>
					</h3>
				}
			>
				{isAdmin && <Button href={`/thursdays/${thursday.id}/edit`}>Edit Thursday</Button>}
			</Header>

			<div className={styles.GroupsTable}>
				{thursday.groups.length > 0 ? (
					thursday.groups.map((group) => <GroupCard key={group.id} thursday={thursday} group={group} />)
				) : (
					<div>There are no productions scheduled on this Thursday yet.</div>
				)}

				{isAdmin && (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginTop: "0.5rem",
						}}
					>
						<Button href={`thursdays/${thursday.id}/groups/add`}>Add Production</Button>
					</div>
				)}
			</div>
		</div>
	);
}
