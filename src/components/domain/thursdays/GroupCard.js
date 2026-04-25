import Link from "next/link";
import styles from "@/components/domain/thursdays/ThursdayCard.module.css";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import PresentationCard from "@/components/domain/thursdays/PresentationCard";

export default async function GroupCard({ thursday, group, isAdmin = false }) {
	var producers = group.producers.filter((user) => user.admin === false);
	var faculty = group.producers.filter((user) => user.admin === true);
	return (
		<div className={styles.GroupCard}>
			<Split
				style={{ marginBottom: "0.5rem" }}
				start={
					<h3 style={{ fontSize: "1.2rem" }}>
						<b>{group.name}</b> ({group.location})
					</h3>
				}
				end={<div />}
			/>
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
