import Link from "next/link";
import styles from "./thursdays/thursdaycard.module.css";
import Button from "./Button";
import Header from "./Header";
import PresentationCard from "./PresentationCard";
import { auth } from "@/server/auth/config";
export default async function GroupCard({ thursday, group }) {
	const session = await auth();
	var producers = group.producers.filter((user) => user.admin === false);
	var faculty = group.producers.filter((user) => user.admin === true);
	const isAdmin = session?.user?.admin ?? false;
	return (
		<div className={styles.GroupCard}>
			<Header
				style={{ fontSize: "0.5rem" }}
				label={
					<h3>
						<b>{group.name}</b> ({group.location})
					</h3>
				}
			>
				{isAdmin && <Button href={`/thursdays/${thursday.id}/groups/${group.id}/edit`}>Edit</Button>}
			</Header>
			<hr />
			<div className={styles.People}>
				<div>
					<b>Producers:</b>
					<ul>
						{producers.length > 0 ? (
							producers.map((producer) => {
								return (
									<li key={`producer.id:${producer.id}`}>
										<Link href={`/users/${producer.username}`}>{producer.name}</Link>
									</li>
								);
							})
						) : (
							<li>
								<i>There are no producers credited for this group yet.</i>
							</li>
						)}
					</ul>
				</div>
				<div>
					<b>Faculty:</b>
					<ul>
						{faculty.length > 0 ? (
							faculty.map((faculty) => {
								return (
									<li key={`faculty.id:${faculty.id}`}>
										<Link href={`/users/${faculty.username}`}>{faculty.name}</Link>
									</li>
								);
							})
						) : (
							<li>
								<i>There are no faculty assigned to this group yet.</i>
							</li>
						)}
					</ul>
				</div>
			</div>

			<div>
				<b>Presentations:</b>
				<div style={{ paddingRight: "1rem", paddingLeft: "1rem", paddingTop: "0", paddingBottom: "0", display: "flex", flexDirection: "column" }}>
					{group.presentations.length > 0 ? (
						group.presentations?.map((work) => {
							return <PresentationCard key={work.id} work={work} />;
						})
					) : (
						<p>
							<i>There are no presented works for this group yet.</i>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
