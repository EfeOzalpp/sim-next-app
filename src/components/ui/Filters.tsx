"use client";

import { useURLFilter } from "@/hooks/useURLFilter";
import { Input, Select } from "@/components/ui/AntD";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { InputProps, SelectProps } from "antd";

interface FilterInputProps extends Omit<InputProps, "value" | "onChange"> {
	query?: string;
}

export function FilterInput({ query = "search", placeholder = "Search", ...props }: FilterInputProps) {
	const { value, isPending, handleChange } = useURLFilter(query, 500);

	return (
		<Input
			{...props}
			value={value || ""}
			placeholder={placeholder}
			onChange={(e) => handleChange(e.target.value)}
			allowClear
			prefix={<SearchOutlined />}
			suffix={isPending ? <LoadingOutlined spin /> : null}
		/>
	);
}

const ALL_SENTINEL = "__all__";

interface FilterSelectProps extends Omit<SelectProps, "value" | "onChange" | "options" | "loading"> {
	filter: string;
	options?: Array<Record<string, any>>;
	defaultValue?: string | number | null;
	valueKey?: string;
	labelKey?: string;
	allLabel?: string;
}

export function FilterSelect({
	filter,
	options = [],
	defaultValue,
	valueKey = "id",
	labelKey = "name",
	placeholder,
	allLabel,
	...props
}: FilterSelectProps) {
	const { value, isPending, handleChange } = useURLFilter(filter, 300);

	const allOption = allLabel ? [{ value: ALL_SENTINEL, label: allLabel }] : [];

	return (
		<Select
			{...props}
			size="large"
			showSearch
			placeholder={placeholder}
			value={value !== null ? value : defaultValue}
			onChange={(val) => handleChange(val === ALL_SENTINEL ? null : val)}
			loading={isPending}
			options={[
				...allOption,
				...options.map((option) => ({
					value: option[valueKey],
					label: option[labelKey],
				})),
			]}
			style={{ ...props.style }}
		/>
	);
}
