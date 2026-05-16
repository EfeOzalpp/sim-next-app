"use client";

import Link from "next/link";
import { Table } from "@/components/ui/AntD";
import { Prisma, Semester } from "@prisma/client";
import styles from "@/components/domain/semesters/SemesterUsersTable.module.css";

type ProductionWithThursday = Prisma.ProductionGetPayload<{ include: { thursday: { select: { id: true, date: true } } } }>;
type PresentationWithProduction = Prisma.PresentationGetPayload<{ include: { production: { include: { thursday: { select: { id: true, date: true } } } } } }>;

interface UserStat {
	id: string;
	name: string | null;
	productions: (ProductionWithThursday & { date: Date | undefined })[];
	presentationsBeforeMid: (PresentationWithProduction & { date: Date | undefined })[];
	presentationsAfterMid: (PresentationWithProduction & { date: Date | undefined })[];
}

interface SemesterUsersTableProps {
	users?: UserStat[];
	semester?: Semester | null;
}

const dateFormat: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

function ItemCard({ name, date, href }: { name: string; date?: Date; href: string }) {
	return (
		<Link href={href} className={styles.card}>
			<span className={styles.cardDate}>
				{date ? new Date(date).toLocaleDateString("en-US", dateFormat) : "N/A"}
			</span>
			<div className={styles.cardBottom}>
				<span className={styles.cardName}>{name}</span>
				<span className={styles.cardArrow}>→</span>
			</div>
		</Link>
	);
}

export default function SemesterUsersTable({ users = [] }: SemesterUsersTableProps) {
	const columns = [
		{
			title: "Names",
			dataIndex: "name",
			key: "name",
			render: (text: string, user: UserStat) => (
				<Link href={`/users/${user.id}/`}>{text}</Link>
			),
		},
		{
			title: "Productions",
			key: "productions",
			width: "40%",
			render: (_: any, user: UserStat) => {
				const productions = user.productions || [];
				if (productions.length === 0) {
					return <span className={styles.emptyLabel}>No current productions</span>;
				}
				return (
					<div className={styles.section}>
						<span className={styles.sectionLabel}>
							Productions: {productions.length}
						</span>
						<div className={styles.cardsGrid}>
							{productions.map((p) => (
								<ItemCard
									key={p.id}
									name={p.name}
									date={p.date}
									href={`/thursdays/${p.thursday_id}`}
								/>
							))}
						</div>
					</div>
				);
			},
		},
		{
			title: "Presentations",
			key: "presentations",
			width: "40%",
			render: (_: any, user: UserStat) => {
				const hasPreMid = user.presentationsBeforeMid?.length > 0;
				const hasPostMid = user.presentationsAfterMid?.length > 0;
				const hasNone = !hasPreMid && !hasPostMid;

				if (hasNone) {
					return (
						<span className={styles.emptyLabel}>
							No current presentations
						</span>
					);
				}

				return (
					<>
						{hasPreMid && (
							<div className={styles.section}>
								<span className={styles.sectionLabel}>Pre-Mid</span>
								<div className={styles.cardsGrid}>
									{user.presentationsBeforeMid.map((p) => (
										<ItemCard
											key={p.id}
											name={p.name}
											date={p.date}
											href={`/thursdays/${p.production?.thursday?.id}`}
										/>
									))}
								</div>
							</div>
						)}
						{hasPostMid && (
							<div className={styles.section}>
								<span className={styles.sectionLabel}>Post-Mid</span>
								<div className={styles.cardsGrid}>
									{user.presentationsAfterMid.map((p) => (
										<ItemCard
											key={p.id}
											name={p.name}
											date={p.date}
											href={`/thursdays/${p.production?.thursday?.id}`}
										/>
									))}
								</div>
							</div>
						)}
					</>
				);
			},
		},
	];

	return <Table dataSource={users} columns={columns} rowKey="id" />;
}
