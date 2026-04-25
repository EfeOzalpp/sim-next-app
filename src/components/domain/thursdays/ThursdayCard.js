import Link from "next/link";
import styles from "@/components/domain/thursdays/ThursdayCard.module.css";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import GroupCard from "@/components/domain/thursdays/GroupCard";
import { auth } from "@/authentication";

export default async function ThursdayCard({ thursday, isAdmin: initialIsAdmin }) {
	let isAdmin = initialIsAdmin;
	if (isAdmin === undefined) {
		const session = await auth();
		isAdmin = session?.user?.admin ?? false;
	}

	return (
		<div className={styles.ThursdayCard}>
			<Split
				start={
					<h3>
						<Link href={`/thursdays/${thursday.id}`}>
							<b>{thursday.name}</b> ({thursday.date.toLocaleDateString()})
						</Link>
					</h3>
				}
				end={isAdmin && <Button href={`/thursdays/${thursday.id}/edit`}>Edit Thursday</Button>}
			/>

			<div className={styles.GroupsTable}>
				{thursday.groups.length > 0 ? (
					thursday.groups.map((group) => <GroupCard key={group.id} thursday={thursday} group={group} isAdmin={isAdmin} />)
				) : (
					<div>There are no productions scheduled on this Thursday yet.</div>
				)}
			</div>
		</div>
	);
}
