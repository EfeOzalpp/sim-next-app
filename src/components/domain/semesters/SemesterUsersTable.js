"use client";

import Link from "next/link";
import { Table, Divider } from "@/components/ui/AntD";
import { Typography } from "antd";

const { Text } = Typography;

export default function SemesterUsersTable({ users = [], semester = {} }) {
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (text, user) => <Link href={`/users/${user.username}/`}>{text}</Link>,
		},
		{
			title: "Productions",
			key: "productions",
			render: (_, user) => (
				<>
					<Text strong>Total in Semester: {user.groups?.length ?? 0}</Text>
					<ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
						{(user.groups || []).map((group) => (
							<li key={`production.id:${group.id}`}>
								<Link href={`/thursdays/${group.thursday_id}`}>
									{group.name} ({new Date(group.thursday?.date || group.date).toLocaleDateString()})
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
			render: (_, user) => (
				<>
					<div>
						<Text strong>Total Before Mid: {user.worksBeforeMid?.length ?? 0}</Text>
						<ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
							{(user.worksBeforeMid || []).map((work) => (
								<li key={`work.id:${work.id}`}>
									<Link href={`/thursdays?semester=All&thursdays=${work.group_id}`}>
										{work.name} ({new Date(work.group?.thursday?.date || work.date).toLocaleDateString()})
									</Link>
								</li>
							))}
						</ul>
					</div>
					<Divider style={{ margin: "8px 0" }} />
					<div>
						<Text strong>Total After Mid: {user.worksAfterMid?.length ?? 0}</Text>
						<ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
							{(user.worksAfterMid || []).map((work) => (
								<li key={`work.id:${work.id}`}>
									<Link href={`/thursdays?semester=All&thursdays=${work.group_id}`}>
										{work.name} ({new Date(work.group?.thursday?.date || work.date).toLocaleDateString()})
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
