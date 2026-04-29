"use client";

import React from "react";
import { useURLFilter } from "@/hooks/useURLFilter";
import { Input, Select } from "@/components/ui/AntD";
import { LoadingOutlined } from "@ant-design/icons";
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
			suffix={isPending ? <LoadingOutlined spin /> : null}
		/>
	);
}

interface FilterSelectProps extends Omit<SelectProps, "value" | "onChange" | "options" | "loading"> {
	filter: string;
	options?: Array<Record<string, any>>;
	defaultValue?: string | number | null;
	valueKey?: string;
	labelKey?: string;
}

export function FilterSelect({
	filter,
	options = [],
	defaultValue,
	valueKey = "id",
	labelKey = "name",
	placeholder,
	...props
}: FilterSelectProps) {
	const { value, isPending, handleChange } = useURLFilter(filter, 300);

	return (
		<Select
			{...props}
			showSearch
			allowClear
			placeholder={placeholder}
			value={value !== null ? value : defaultValue}
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
