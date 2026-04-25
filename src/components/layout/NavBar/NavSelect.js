"use client";

import { useRouter, usePathname } from "next/navigation";
import { Select } from "@/components/ui/AntD";

export function NavSelect({ pages }) {
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (value) => {
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
