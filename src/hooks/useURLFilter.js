"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useTransition } from "react";

export function useURLFilter(queryKey, debounceMs = 500) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();
	const [isPending, startTransition] = useTransition();

	const paramValue = searchParams.get(queryKey) || "";
	const [value, setValue] = useState(paramValue);

	useEffect(() => {
		setValue(paramValue);
	}, [paramValue]);

	const debouncedReplace = useDebouncedCallback((newValue) => {
		const params = new URLSearchParams(searchParams);
		if (newValue) params.set(queryKey, newValue);
		else params.delete(queryKey);

		startTransition(() => {
			replace(`${pathname}?${params.toString()}`);
		});
	}, debounceMs);

	const handleChange = (newValue) => {
		setValue(newValue);
		debouncedReplace(newValue);
	};

	return {
		value,
		isPending,
		handleChange,
	};
}
