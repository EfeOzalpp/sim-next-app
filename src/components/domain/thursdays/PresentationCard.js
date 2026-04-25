import Link from "next/link";
import styles from "@/components/domain/thursdays/PresentationCard.module.css";
import { formatNiceListFromArray } from "@/helpers";

export default function Presentation({ work }) {
	const authors = work.presenters.map((author) => (
		<Link key={`author.id:${author.id}`} href={`/users/${author.username}/`}>
			{author.name}
		</Link>
	));

	return (
		<div className={styles.Presentation}>
			<div>
				<b>{work.name}</b>
			</div>
			{work.about != "" ? (
				<div>
					<i>{work.about}</i>
				</div>
			) : null}
			{authors.length > 0 ? (
				<div>
					<> by </>
					{formatNiceListFromArray(authors)}
				</div>
			) : (
				<div>No one is credited as an author of this work yet.</div>
			)}
		</div>
	);
}
