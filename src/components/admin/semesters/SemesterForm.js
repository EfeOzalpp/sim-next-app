"use client";

import { useState } from "react";

import { DatePicker, Input, Transfer } from "antd";

const { RangePicker } = DatePicker;

import { FormWrapper, FormLabel, FormInput } from "../../Form";

import dayjs from "dayjs";

export default function SemesterForm({ onSubmit, semester, usersFromCurrentSemester, users }) {
	let defaultSelectedThursdays = [];

	if (semester) {
		defaultSelectedThursdays.push(dayjs(semester.thursdays[0].date));
		defaultSelectedThursdays.push(dayjs(semester.thursdays[defaultSelectedThursdays.length - 1].date));
	}

	const [dates, setDates] = useState(defaultSelectedThursdays);
	const handleDatesChange = (event) => {
		setDates(event);
	};

	const [selectedUsersKeys, setSelectedUsersKeys] = useState(semester?.users.map(({ id }) => id) || usersFromCurrentSemester?.map(({ id }) => id));
	const handleSelectedUsersKeysChange = (event) => {
		setSelectedUsersKeys(event);
	};
	return (
		<FormWrapper
			action={async (formData) => {
				const data = {
					name: formData.get("name"),
					dates: [dates[0].$d, dates[1].$d],
					users: selectedUsersKeys,
				};
				if (semester) {
					data.id = semester.id;
				}
				await onSubmit(data);
			}}
			button={semester ? "Edit Semester" : "Add Semester"}
		>
			<FormLabel>{semester ? "Edit Name" : "Add Name"}</FormLabel>
			<FormInput>
				<Input name="name" defaultValue={semester?.name} required />
			</FormInput>

			<FormLabel>Select Dates</FormLabel>
			<FormInput>
				<RangePicker onChange={handleDatesChange} defaultValue={[dates[0], dates[1]]} disabled={semester ? true : false} required />
			</FormInput>

			<FormLabel>Select Users</FormLabel>
			<FormInput>
				<Transfer dataSource={users} targetKeys={selectedUsersKeys} onChange={handleSelectedUsersKeysChange} oneWay showSearch render={(item) => item.name} />
			</FormInput>
		</FormWrapper>
	);
}
