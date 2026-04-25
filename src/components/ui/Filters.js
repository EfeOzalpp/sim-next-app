"use client";

import { useURLFilter } from "@/hooks/useURLFilter";
import { Input, Select } from "@/components/ui/AntD";
import { LoadingOutlined } from "@ant-design/icons";

export function FilterInput({ query = "search", placeholder = "Search", ...props }) {
	const { value, isPending, handleChange } = useURLFilter(query, 500);

	return (
		<Input
			{...props}
			value={value}
			placeholder={placeholder}
			onChange={(e) => handleChange(e.target.value)}
			allowClear
			suffix={isPending ? <LoadingOutlined spin /> : null}
		/>
	);
}

export function FilterSelect({
	filter,
	options = [],
	defaultValue,
	valueKey = "name",
	labelKey = "name",
	placeholder,
	...props
}) {
	const { value, isPending, handleChange } = useURLFilter(filter, 300);

	return (
		<Select
			{...props}
			showSearch
			allowClear
			placeholder={placeholder}
			value={value || defaultValue}
			onChange={handleChange}
			loading={isPending}
			options={options.map((option) => ({
				value: option[valueKey],
				label: option[labelKey],
			}))}
			style={{ minWidth: 150, ...props.style }}
		/>
	);
}
