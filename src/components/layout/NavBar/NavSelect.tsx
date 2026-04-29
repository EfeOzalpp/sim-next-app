"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Select } from "@/components/ui/AntD";

interface Page {
	href: string;
	label: string;
}

interface NavSelectProps {
	pages: Page[];
}

export function NavSelect({ pages }: NavSelectProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (value: string) => {
		router.push(value);
	};

	return (
		<Select
			value={pathname}
			onChange={handleChange}
			options={pages.map((p) => ({
				value: p.href,
				label: p.label,
			}))}
			style={{ width: "100%" }}
		/>
	);
}
