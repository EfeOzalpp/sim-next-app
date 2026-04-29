"use client";

import React from "react";
import Link from "next/link";
import { Table, Divider } from "@/components/ui/AntD";
import { Typography } from "antd";

const { Text } = Typography;

import { Prisma, Semester } from "@prisma/client";

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

export default function SemesterUsersTable({ users = [], semester = null }: SemesterUsersTableProps) {
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (text: string, user: UserStat) => <Link href={`/users/${user.id}/`}>{text}</Link>,
		},
		{
			title: "Productions",
			key: "productions",
			render: (_: any, user: UserStat) => (
				<>
					<Text strong>Total in Semester: {user.productions?.length ?? 0}</Text>
					<ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
						{(user.productions || []).map((production) => (
							<li key={`production.id:${production.id}`}>
								<Link href={`/thursdays/${production.thursday_id}`}>
									{production.name} ({production.date ? new Date(production.date).toLocaleDateString() : "N/A"})
								</Link>
							</li>
						))}
					</ul>
				</>
			),
		},
		{
			title: "Presentations",
			key: "presentations",
			render: (_: any, user: UserStat) => (
				<>
					<div>
						<Text strong>Total Before Mid: {user.presentationsBeforeMid?.length ?? 0}</Text>
						<ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
							{(user.presentationsBeforeMid || []).map((presentation) => (
								<li key={`presentation.id:${presentation.id}`}>
									<Link href={`/thursdays/${presentation.production?.thursday?.id}`}>
										{presentation.name} ({presentation.date ? new Date(presentation.date).toLocaleDateString() : "N/A"})
									</Link>
								</li>
							))}
						</ul>
					</div>
					<Divider style={{ margin: "8px 0" }} />
					<div>
						<Text strong>Total After Mid: {user.presentationsAfterMid?.length ?? 0}</Text>
						<ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
							{(user.presentationsAfterMid || []).map((presentation) => (
								<li key={`presentation.id:${presentation.id}`}>
									<Link href={`/thursdays/${presentation.production?.thursday?.id}`}>
										{presentation.name} ({presentation.date ? new Date(presentation.date).toLocaleDateString() : "N/A"})
									</Link>
								</li>
							))}
						</ul>
					</div>
				</>
			),
		},
	];

	return <Table dataSource={users} columns={columns} rowKey="id" />;
}
